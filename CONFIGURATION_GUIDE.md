# PlateFul Configuration Guide

## 🔧 **Step-by-Step Configuration Setup**

### **1. Firebase Project Setup**

#### **1.1 Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `plateful-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

#### **1.2 Enable Services**
1. **Authentication**: 
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Phone" (for SMS verification)

2. **Firestore Database**:
   - Go to Firestore Database → Create database
   - Choose "Start in test mode" (we'll add security rules later)

3. **Functions**:
   - Go to Functions → Get started
   - Choose your billing plan (Blaze plan required for external API calls)

#### **1.3 Get Firebase Config**
1. Go to Project Settings (gear icon ⚙️)
2. Scroll to "Your apps" section
3. Click "Add app" → "Web" (</>)
4. Register app with name: `PlateFul Web App`
5. Copy the config object

### **2. Update Firebase Config**

#### **2.1 Replace Config in `utils/authService.js`**
```javascript
// Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### **3. Email Service Setup (Gmail)**

#### **3.1 Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification → Turn it on

#### **3.2 Generate App Password**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification → App passwords
3. Select "Mail" and "Other (Custom name)"
4. Enter name: `PlateFul App`
5. Copy the generated 16-character password

#### **3.3 Set Firebase Environment Variables**
```bash
# Open terminal in your project root
firebase login
firebase use your-project-id

# Set email configuration
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.pass="your-16-char-app-password"
```

### **4. SMS Service Setup (Twilio - Optional for Development)**

#### **4.1 Create Twilio Account**
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for free account
3. Get your Account SID and Auth Token

#### **4.2 Get Phone Number**
1. Go to Phone Numbers → Manage → Active numbers
2. Buy a number or use trial number
3. Copy the phone number

#### **4.3 Set Firebase Environment Variables**
```bash
# Set Twilio configuration
firebase functions:config:set twilio.account_sid="your-account-sid"
firebase functions:config:set twilio.auth_token="your-auth-token"
firebase functions:config:set twilio.from_number="+1234567890"
```

### **5. Deploy Firebase Functions**

#### **5.1 Install Dependencies**
```bash
cd functions
npm install
npm install nodemailer
npm install twilio
```

#### **5.2 Deploy Functions**
```bash
# From project root
firebase deploy --only functions
```

### **6. Test Configuration**

#### **6.1 Test Email Service**
```bash
# Check if email config is set correctly
firebase functions:config:get
```

#### **6.2 Test SMS Service**
```bash
# Check if SMS config is set correctly
firebase functions:config:get
```

## 🔑 **Storage Keys Customization**

### **Current Storage Keys**
The app uses these keys to store data locally:

```javascript
const STORAGE_KEYS = {
  USER_TOKEN: '@plateful_user_token',        // Authentication token
  USER_DATA: '@plateful_user_data',          // User profile data
  AUTH_STATE: '@plateful_auth_state'         // Authentication state
};
```

### **Customize Storage Keys (Optional)**
If you want to change the storage keys:

```javascript
const STORAGE_KEYS = {
  USER_TOKEN: '@your_app_name_user_token',
  USER_DATA: '@your_app_name_user_data',
  AUTH_STATE: '@your_app_name_auth_state'
};
```

## 📋 **Configuration Checklist**

### **Firebase Setup**
- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password, Phone)
- [ ] Firestore database created
- [ ] Functions enabled
- [ ] Firebase config copied to `utils/authService.js`

### **Email Setup**
- [ ] Gmail 2-factor authentication enabled
- [ ] App password generated
- [ ] Firebase environment variables set
- [ ] Email service tested

### **SMS Setup (Optional)**
- [ ] Twilio account created
- [ ] Phone number obtained
- [ ] Firebase environment variables set
- [ ] SMS service tested

### **Deployment**
- [ ] Functions dependencies installed
- [ ] Functions deployed to Firebase
- [ ] Configuration tested end-to-end

## 🚨 **Important Notes**

### **Security**
- Never commit your Firebase config to public repositories
- Use environment variables for sensitive data
- Keep your app passwords and API keys secure

### **Billing**
- Firebase Blaze plan required for external API calls (email/SMS)
- Twilio has free trial credits for development
- Monitor usage to avoid unexpected charges

### **Development vs Production**
- Use Firebase emulators for local development
- Test with real email/SMS in staging environment
- Use production services only when ready

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Email not sending**:
   - Check Gmail app password
   - Verify 2-factor authentication is enabled
   - Check Firebase function logs

2. **SMS not sending**:
   - Verify Twilio credentials
   - Check phone number format
   - Ensure Twilio account is active

3. **Authentication errors**:
   - Verify Firebase config
   - Check if functions are deployed
   - Review Firebase console logs

### **Debug Commands**
```bash
# View function logs
firebase functions:log

# Check environment variables
firebase functions:config:get

# Test locally
firebase emulators:start

# Deploy functions
firebase deploy --only functions
```

## 📞 **Support**

If you encounter issues:
1. Check Firebase console for error logs
2. Verify all configuration steps are completed
3. Test with Firebase emulators first
4. Review the troubleshooting section above 