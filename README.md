# Plateful - Child Nutrition App

A React Native application for tracking and managing children's nutrition with Firebase backend integration.

## Project Structure

```
Plateful/
├── app/                    # React Native Frontend (Expo Router)
│   ├── (tabs)/            # Main app tabs
│   ├── auth/              # Authentication screens
│   ├── food/              # Food tracking screens
│   ├── meals/             # Meal logging screens
│   ├── profile/           # User profile screens
│   ├── gamification/      # Gamification features
│   └── debug/             # Debug screens
├── components/            # Reusable UI components
├── constants/             # App constants and configurations
├── utils/                 # Utility functions and services
├── types/                 # TypeScript type definitions
├── assets/                # Images, fonts, and static assets
├── functions/             # Firebase Cloud Functions (Backend)
│   ├── src/              # TypeScript source files
│   └── lib/              # Compiled JavaScript files
└── SomeGuide/            # Project documentation and guides
```

## Features

- **Authentication**: Firebase Auth with email/password and phone verification
- **Food Tracking**: Camera-based food recognition and manual logging
- **Meal Management**: Comprehensive meal logging and history
- **Nutrition Analytics**: Detailed nutrition reports and insights
- **Gamification**: Badges, leaderboards, and quests for engagement
- **Child Profiles**: Multiple child profile management
- **Learning Content**: Educational content about nutrition

## Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Firebase SDK** for client-side operations

### Backend
- **Firebase Cloud Functions** (Node.js)
- **Firestore** for database
- **Firebase Storage** for file uploads
- **Firebase Auth** for authentication

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI
- Firebase CLI
- Android Studio / Xcode (for mobile development)

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd functions
npm install
```

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, Storage, and Functions
3. Download `google-services.json` and place it in the root directory
4. Deploy Firebase Functions:

```bash
firebase login
firebase init
firebase deploy --only functions
```

### 4. Run the Application

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Development

### Frontend Development
- The app uses Expo Router for file-based routing
- Components are organized in the `components/` directory
- Utilities and services are in the `utils/` directory
- TypeScript types are defined in `types/`

### Backend Development
- Firebase Functions are in the `functions/` directory
- Source code is in TypeScript (`functions/src/`)
- Compiled JavaScript is in `functions/lib/`
- Functions include:
  - Authentication management
  - Food database operations
  - Image recognition
  - Analytics calculations
  - Notification handling

### Database Schema

The app uses Firestore with the following collections:
- `users`: User profiles and preferences
- `children`: Child profiles and data
- `meals`: Meal logging data
- `foods`: Food database
- `analytics`: Nutrition analytics
- `notifications`: Push notifications

## Deployment

### Frontend
```bash
# Build for production
eas build --platform all
```

### Backend
```bash
# Deploy Firebase Functions
firebase deploy --only functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
