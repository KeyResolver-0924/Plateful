# Environment Variables Setup Guide

## Why You Need a .env File

Your Plateful app needs a `.env` file to securely store sensitive configuration data, particularly Firebase credentials. This prevents exposing sensitive information in your code repository.

## Setup Instructions

### 1. Create Your .env File

Copy the `env.example` file to `.env`:

```bash
cp env.example .env
```

### 2. Configure Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings → Your Apps
4. If you don't have a web app, click "Add app" → Web
5. Copy the configuration values and update your `.env` file:

```env
FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 3. Additional Configuration (Optional)

If you plan to use external APIs for nutrition data or image recognition, uncomment and configure these variables:

```env
NUTRITION_API_KEY=your-nutrition-api-key
IMAGE_RECOGNITION_API_KEY=your-image-recognition-api-key
```

## Security Notes

- ✅ The `.env` file is already added to `.gitignore`
- ✅ Never commit your `.env` file to version control
- ✅ Share the `env.example` file with your team
- ✅ Use different Firebase projects for development and production

## Verification

After setting up your `.env` file, restart your development server:

```bash
npm start
```

Your Firebase configuration should now load from environment variables instead of placeholder values.

## Troubleshooting

If you see placeholder values in your app:
1. Make sure your `.env` file is in the project root
2. Restart your development server
3. Check that variable names match exactly (case-sensitive)
4. Verify your Firebase credentials are correct 