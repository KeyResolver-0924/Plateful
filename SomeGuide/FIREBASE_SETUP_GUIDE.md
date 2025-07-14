# Firebase Setup Guide for Plateful

This guide will help you set up Firebase for the Plateful child nutrition app.

## Prerequisites

- Google account
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js (v18 or higher)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `plateful-nutrition`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable the following sign-in methods:
   - Email/Password
   - Phone Number
   - Google (optional)
4. Configure authorized domains

### Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location (choose closest to your users)
5. Click "Done"

### Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location
5. Click "Done"

### Functions
1. Go to "Functions"
2. Click "Get started"
3. Install Firebase CLI if not already installed
4. Initialize Functions in your project

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

To get these values:
1. In Firebase Console, go to Project Settings
2. Scroll down to "Your apps"
3. Click the web app icon (</>) to add a web app
4. Register app and copy the config values

## Step 4: Set Up Firestore Security Rules

Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their children's data
    match /children/{childId} {
      allow read, write: if request.auth != null && 
        resource.data.parentId == request.auth.uid;
    }
    
    // Users can read/write their meals
    match /meals/{mealId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Public food database (read-only)
    match /foods/{foodId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Analytics (users can read/write their own)
    match /analytics/{analyticsId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 5: Set Up Storage Rules

Update `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own profile images
    match /users/{userId}/profile/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can upload meal images
    match /meals/{mealId}/images/{allPaths=**} {
      allow read, write: if request.auth != null && 
        resource.metadata.userId == request.auth.uid;
    }
    
    // Public food images (read-only)
    match /foods/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Step 6: Deploy Firebase Functions

1. Navigate to the functions directory:
```bash
cd functions
```

2. Install dependencies:
```bash
npm install
```

3. Build the functions:
```bash
npm run build
```

4. Deploy to Firebase:
```bash
firebase deploy --only functions
```

## Step 7: Initialize Database with Sample Data

Create a script to populate the database with initial data:

```javascript
// scripts/initDatabase.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeDatabase() {
  // Add food categories
  const foodCategories = [
    { id: 'fruits', name: 'Fruits', description: 'Fresh fruits and berries' },
    { id: 'vegetables', name: 'Vegetables', description: 'Fresh vegetables' },
    { id: 'proteins', name: 'Proteins', description: 'Meat, fish, eggs, legumes' },
    { id: 'grains', name: 'Grains', description: 'Bread, rice, pasta, cereals' },
    { id: 'dairy', name: 'Dairy', description: 'Milk, cheese, yogurt' },
    { id: 'fats', name: 'Fats', description: 'Oils, nuts, butter' }
  ];

  for (const category of foodCategories) {
    await db.collection('foodCategories').doc(category.id).set(category);
  }

  // Add sample foods
  const foods = [
    {
      id: 'apple',
      name: 'Apple',
      category: 'fruits',
      nutrients: {
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fiber: 2.4,
        vitaminC: 4.6
      },
      imageUrl: 'foods/apple.png',
      suitableFor: ['6m+']
    },
    // Add more foods...
  ];

  for (const food of foods) {
    await db.collection('foods').doc(food.id).set(food);
  }

  console.log('Database initialized successfully!');
}

initializeDatabase().catch(console.error);
```

## Step 8: Configure Authentication Triggers

The Firebase Functions include authentication triggers that automatically:
- Create user profiles when users sign up
- Update user data when profiles are modified
- Send welcome emails to new users
- Handle phone number verification

## Step 9: Test the Setup

1. Run the app in development:
```bash
npm start
```

2. Test authentication flow
3. Test food logging functionality
4. Verify data is being stored in Firestore

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check environment variables are correct
   - Verify Firebase project ID matches
   - Ensure Authentication is enabled in Firebase Console

2. **Functions not deploying**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check Firebase CLI is logged in

3. **Database rules blocking access**
   - Check Firestore rules syntax
   - Verify user authentication state
   - Test rules in Firebase Console

4. **Storage uploads failing**
   - Check Storage rules
   - Verify file size limits
   - Ensure proper file types

### Debug Commands

```bash
# Check Firebase CLI status
firebase login:list

# View function logs
firebase functions:log

# Test functions locally
firebase emulators:start

# Check project configuration
firebase projects:list
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **Service Accounts**: Use service account keys only for server-side operations
3. **Rules**: Regularly review and update security rules
4. **Authentication**: Implement proper user authentication flows
5. **Data Validation**: Validate all data on both client and server side

## Production Deployment

Before deploying to production:

1. Update security rules to be more restrictive
2. Set up proper authentication methods
3. Configure custom domains
4. Set up monitoring and analytics
5. Test all functionality thoroughly
6. Set up backup and recovery procedures 