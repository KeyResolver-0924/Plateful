# Backend Authentication Setup Guide

## Overview
This guide explains how to set up the complete backend authentication system for PlateFul, including user registration, OTP verification, and sign-in functionality.

## Prerequisites
1. Firebase project created
2. Firebase CLI installed
3. Node.js and npm installed
4. Email service (Gmail recommended for development)
5. SMS service (Twilio recommended for production)

## 1. Firebase Project Setup

### 1.1 Create Firebase Project
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select the following:
# - Firestore
# - Functions
# - Storage
# - Hosting (optional)
```

### 1.2 Configure Firebase Functions
```bash
cd functions
npm install
npm install nodemailer
npm install twilio (for SMS)
```

## 2. Environment Configuration

### 2.1 Set Firebase Environment Variables
```bash
# Email configuration (Gmail)
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.pass="your-app-password"

# Twilio configuration (for SMS)
firebase functions:config:set twilio.account_sid="your-account-sid"
firebase functions:config:set twilio.auth_token="your-auth-token"
firebase functions:config:set twilio.from_number="+1234567890"
```

### 2.2 Gmail App Password Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this password in the Firebase config

### 2.3 Twilio Setup (Optional for Development)
1. Create Twilio account
2. Get Account SID and Auth Token
3. Get a phone number for sending SMS
4. Configure in Firebase environment variables

## 3. Firestore Security Rules

### 3.1 Update firestore.rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // OTP codes collection (temporary)
    match /otpCodes/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Children collection
    match /children/{childId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.parentIds;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // Meal data collection
    match /meals/{mealId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.parentId;
    }
  }
}
```

## 4. Frontend Configuration

### 4.1 Update Firebase Config
In `utils/authService.js`, replace the placeholder config:
```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4.2 Install Required Dependencies
```bash
npm install firebase
npm install @react-native-async-storage/async-storage
```

## 5. Authentication Flow

### 5.1 User Registration Flow
1. User fills sign-up form
2. Frontend calls `authService.registerUser()`
3. Backend creates Firebase Auth user
4. Backend generates OTP codes
5. Backend sends email and SMS OTP
6. User enters OTP codes
7. Frontend calls `authService.verifyOTP()`
8. Backend verifies OTP and creates user profile
9. User is authenticated and redirected

### 5.2 User Sign-In Flow
1. User enters email and password
2. Frontend calls `authService.signInUser()`
3. Backend verifies credentials
4. Backend checks if user is verified
5. Backend returns authentication token
6. User is signed in and redirected

## 6. Testing the Setup

### 6.1 Deploy Functions
```bash
firebase deploy --only functions
```

### 6.2 Test Registration
1. Open the app
2. Go to sign-up screen
3. Fill in all fields
4. Submit registration
5. Check email for OTP
6. Enter OTP codes
7. Verify successful registration

### 6.3 Test Sign-In
1. Go to sign-in screen
2. Enter registered email and password
3. Submit sign-in
4. Verify successful authentication

## 7. Security Considerations

### 7.1 OTP Security
- OTP codes expire after 10 minutes
- Maximum 3 attempts allowed
- OTP codes are stored securely in Firestore
- Codes are deleted after successful verification

### 7.2 User Data Security
- All user data is stored in Firestore
- Access controlled by security rules
- Sensitive data encrypted
- Authentication tokens managed securely

### 7.3 Email Security
- Use app passwords for Gmail
- Enable 2-factor authentication
- Monitor email sending limits

## 8. Production Considerations

### 8.1 Email Service
- Consider using SendGrid or AWS SES for production
- Set up proper email templates
- Monitor delivery rates

### 8.2 SMS Service
- Use Twilio or similar service for SMS
- Set up proper error handling
- Monitor SMS costs

### 8.3 Monitoring
- Set up Firebase Analytics
- Monitor function execution times
- Set up error alerting

## 9. Troubleshooting

### 9.1 Common Issues
1. **Email not sending**: Check Gmail app password
2. **SMS not sending**: Verify Twilio credentials
3. **OTP verification failing**: Check Firestore rules
4. **Authentication errors**: Verify Firebase config

### 9.2 Debug Commands
```bash
# View function logs
firebase functions:log

# Test functions locally
firebase emulators:start

# Check environment variables
firebase functions:config:get
```

## 10. Next Steps

1. Implement password reset functionality
2. Add social authentication (Google, Apple)
3. Set up user profile management
4. Implement child profile creation
5. Add meal tracking functionality
6. Set up analytics and reporting

## Support
For issues or questions:
1. Check Firebase documentation
2. Review function logs
3. Test with Firebase emulators
4. Contact development team 