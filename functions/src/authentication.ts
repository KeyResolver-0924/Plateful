import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

const db = admin.firestore();
const auth = admin.auth();

// Email configuration (you'll need to set these in Firebase environment variables)
const emailConfig = {
  service: 'gmail',
  auth: {
    user: functions.config().email?.user || 'your-email@gmail.com',
    pass: functions.config().email?.pass || 'your-app-password'
  }
};

// SMS configuration (you'll need to set these in Firebase environment variables)
// const smsConfig = {
//   accountSid: functions.config().twilio?.account_sid || 'your-account-sid',
//   authToken: functions.config().twilio?.auth_token || 'your-auth-token',
//   fromNumber: functions.config().twilio?.from_number || '+1234567890'
// };

export const authentication = {
  // User Registration
  registerUser: functions.https.onCall(async (data, context) => {
    try {
      const { email, password, fullName, phoneNumber } = data;
      
      // Validate input
      if (!email || !password || !fullName || !phoneNumber) {
        throw new functions.https.HttpsError('invalid-argument', 'All fields are required');
      }
      
      // Check if user already exists
      const existingUser = await auth.getUserByEmail(email);
      if (existingUser) {
        throw new functions.https.HttpsError('already-exists', 'User already exists');
      }
      
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
        phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`,
        emailVerified: false
      });
      
      // Generate OTP codes
      const emailOtp = generateOTP(6);
      const phoneOtp = generateOTP(4);
      
      // Store OTP codes with expiration
      const otpData = {
        emailOtp,
        phoneOtp,
        emailVerified: false,
        phoneVerified: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attempts: 0,
        maxAttempts: 3
      };
      
      await db.collection('otpCodes').doc(userRecord.uid).set(otpData);
      
      // Send OTP codes
      await Promise.all([
        sendEmailOTP(email, emailOtp, fullName),
        sendSMSOTP(phoneNumber, phoneOtp)
      ]);
      
      return {
        success: true,
        userId: userRecord.uid,
        message: 'OTP codes sent successfully'
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      throw new functions.https.HttpsError('internal', 'Registration failed');
    }
  }),

  // Verify OTP Codes
  verifyOTP: functions.https.onCall(async (data, context) => {
    try {
      const { userId, emailOtp, phoneOtp } = data;
      
      if (!userId || !emailOtp || !phoneOtp) {
        throw new functions.https.HttpsError('invalid-argument', 'All OTP codes are required');
      }
      
      // Get OTP data
      const otpDoc = await db.collection('otpCodes').doc(userId).get();
      if (!otpDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'OTP codes not found');
      }
      
      const otpData = otpDoc.data();
      
      // Check if otpData exists
      if (!otpData) {
        throw new functions.https.HttpsError('not-found', 'OTP data not found');
      }
      
      // Check expiration
      if (otpData.expiresAt.toDate() < new Date()) {
        throw new functions.https.HttpsError('deadline-exceeded', 'OTP codes expired');
      }
      
      // Check attempts
      if (otpData.attempts >= otpData.maxAttempts) {
        throw new functions.https.HttpsError('permission-denied', 'Too many attempts');
      }
      
      // Verify OTP codes
      if (otpData.emailOtp !== emailOtp || otpData.phoneOtp !== phoneOtp) {
        // Increment attempts
        await db.collection('otpCodes').doc(userId).update({
          attempts: admin.firestore.FieldValue.increment(1)
        });
        throw new functions.https.HttpsError('invalid-argument', 'Invalid OTP codes');
      }
      
      // Mark as verified
      await auth.updateUser(userId, {
        emailVerified: true
      });
      
      // Create user profile
      const userRecord = await auth.getUser(userId);
      const userProfile = {
        userId: userRecord.uid,
        email: userRecord.email,
        userType: 'parent',
        profile: {
          firstName: userRecord.displayName?.split(' ')[0] || '',
          lastName: userRecord.displayName?.split(' ').slice(1).join(' ') || '',
          phoneNumber: userRecord.phoneNumber || '',
          avatar: '',
          timezone: 'America/New_York',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastLogin: admin.firestore.FieldValue.serverTimestamp(),
          isActive: true,
          emailVerified: true,
          phoneVerified: true
        },
        subscription: {
          planType: 'free',
          status: 'active',
          startDate: admin.firestore.FieldValue.serverTimestamp(),
          endDate: null,
          paymentMethodId: null
        },
        preferences: {
          notifications: {
            mealReminders: true,
            reportGeneration: true,
            achievements: true
          },
          language: 'en',
          units: 'imperial'
        }
      };
      
      await db.collection('users').doc(userId).set(userProfile);
      
      // Clean up OTP data
      await db.collection('otpCodes').doc(userId).delete();
      
      // Generate custom token for client
      const customToken = await auth.createCustomToken(userId);
      
      return {
        success: true,
        token: customToken,
        user: userProfile,
        message: 'Account verified successfully'
      };
      
    } catch (error) {
      console.error('OTP verification error:', error);
      throw new functions.https.HttpsError('internal', 'OTP verification failed');
    }
  }),

  // User Sign In
  signInUser: functions.https.onCall(async (data, context) => {
    try {
      const { email, password } = data;
      
      if (!email || !password) {
        throw new functions.https.HttpsError('invalid-argument', 'Email and password are required');
      }
      
      // Verify user credentials
      const userRecord = await auth.getUserByEmail(email);
      
      // Check if user exists and is verified
      if (!userRecord.emailVerified) {
        throw new functions.https.HttpsError('permission-denied', 'Please verify your account first');
      }
      
      // Get user profile
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User profile not found');
      }
      
      const userProfile = userDoc.data();
      
      // Update last login
      await db.collection('users').doc(userRecord.uid).update({
        'profile.lastLogin': admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Generate custom token
      const customToken = await auth.createCustomToken(userRecord.uid);
      
      return {
        success: true,
        token: customToken,
        user: userProfile,
        message: 'Sign in successful'
      };
      
    } catch (error) {
      console.error('Sign in error:', error);
      throw new functions.https.HttpsError('internal', 'Sign in failed');
    }
  }),

  // Resend OTP
  resendOTP: functions.https.onCall(async (data, context) => {
    try {
      const { userId, type } = data; // type: 'email' or 'phone'
      
      if (!userId || !type) {
        throw new functions.https.HttpsError('invalid-argument', 'User ID and type are required');
      }
      
      const userRecord = await auth.getUser(userId);
      
      // Generate new OTP
      const otp = generateOTP(type === 'email' ? 6 : 4);
      
      // Update OTP data
      const otpData = {
        [`${type}Otp`]: otp,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attempts: 0
      };
      
      await db.collection('otpCodes').doc(userId).update(otpData);
      
      // Send OTP
      if (type === 'email') {
        await sendEmailOTP(userRecord.email!, otp, userRecord.displayName || 'User');
      } else {
        await sendSMSOTP(userRecord.phoneNumber!, otp);
      }
      
      return {
        success: true,
        message: `${type} OTP resent successfully`
      };
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw new functions.https.HttpsError('internal', 'Failed to resend OTP');
    }
  }),

  // Password Reset
  resetPassword: functions.https.onCall(async (data, context) => {
    try {
      const { email } = data;
      
      if (!email) {
        throw new functions.https.HttpsError('invalid-argument', 'Email is required');
      }
      
      const userRecord = await auth.getUserByEmail(email);
      
      // Generate password reset link
      const resetLink = await auth.generatePasswordResetLink(email);
      
      // Send reset email
      await sendPasswordResetEmail(email, resetLink, userRecord.displayName || 'User');
      
      return {
        success: true,
        message: 'Password reset email sent'
      };
      
    } catch (error) {
      console.error('Password reset error:', error);
      throw new functions.https.HttpsError('internal', 'Password reset failed');
    }
  })
};

// Helper Functions
function generateOTP(length: number): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

async function sendEmailOTP(email: string, otp: string, name: string): Promise<void> {
  const transporter = nodemailer.createTransport(emailConfig);
  
  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject: 'PlateFul - Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">PlateFul Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Your email verification code is:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Best regards,<br>The PlateFul Team</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

async function sendSMSOTP(phoneNumber: string, otp: string): Promise<void> {
  // For now, we'll log the SMS. In production, integrate with Twilio or similar service
  console.log(`SMS OTP ${otp} sent to ${phoneNumber}`);
  
  // Example Twilio integration (uncomment and configure):
  /*
  const twilio = require('twilio')(smsConfig.accountSid, smsConfig.authToken);
  await twilio.messages.create({
    body: `Your PlateFul verification code is: ${otp}. Valid for 10 minutes.`,
    from: smsConfig.fromNumber,
    to: phoneNumber
  });
  */
}

async function sendPasswordResetEmail(email: string, resetLink: string, name: string): Promise<void> {
  const transporter = nodemailer.createTransport(emailConfig);
  
  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject: 'PlateFul - Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">PlateFul Password Reset</h2>
        <p>Hello ${name},</p>
        <p>You requested a password reset for your PlateFul account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>Best regards,<br>The PlateFul Team</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
} 