# PLATEFULL - Food Introduction App for Kids

A React Native mobile application designed to help parents track and manage their children's food introduction journey with gamification elements.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login and registration system
- **Child Profile Management**: Create and manage multiple child profiles
- **Food Introduction Tracking**: Track which foods have been introduced
- **Meal Logging**: Record daily meals and nutritional intake
- **Learning Modules**: Educational content about foods and nutrition
- **Gamification**: Badges, quests, and leaderboards to encourage engagement

### Key Screens
- Splash & Welcome screens
- Authentication (Login/Register/Forgot Password)
- Profile setup wizard
- Food selection and categorization
- Home dashboard
- Meal tracking and history
- Learning modules with videos
- Gamification (Badges, Stats, Quests, Leaderboard)

## 🛠️ Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation solution
- **React Native Reanimated**: Smooth animations
- **AsyncStorage**: Local data persistence
- **Linear Gradient**: Beautiful gradient effects
- **Vector Icons**: Ionicons for consistent iconography

## 📱 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/platefull.git
cd platefull
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
expo start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

## 📂 Project Structure

```
platefull/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json               # Dependencies and scripts
├── src/
│   ├── assets/                # Images, fonts, and other assets
│   ├── components/            # Reusable components
│   │   ├── common/           # Common UI components
│   │   └── forms/            # Form-related components
│   ├── constants/            # App constants (colors, config)
│   ├── navigation/           # Navigation configuration
│   ├── screens/              # All app screens
│   │   ├── auth/            # Authentication screens
│   │   ├── profileSetup/    # Profile setup screens
│   │   ├── main/            # Main app screens
│   │   ├── food/            # Food management screens
│   │   ├── meal/            # Meal tracking screens
│   │   ├── gamification/    # Gamification screens
│   │   └── onboarding/      # Onboarding screens
│   ├── services/            # API and external services
│   └── utils/               # Utility functions
```

## 🎨 Design System

### Colors
- Primary: `#FF6B35` (Orange)
- Primary Dark: `#E85A2C`
- Secondary: `#4ECDC4` (Teal)
- Success: `#52C41A`
- Warning: `#FFC107`
- Error: `#FF4757`
- Info: `#1890FF`

### Typography
- System font with various weights
- Consistent sizing scale

### Components
- Custom Button component with variants
- Input fields with validation
- Status bar component
- Loading indicators
- Modals and overlays

## 🔧 Key Components

### Navigation
- Stack Navigator for screen transitions
- Bottom Tab Navigator for main app sections
- Proper navigation flow with authentication guards

### State Management
- React hooks for local state
- AsyncStorage for persistent data
- Context API for global state (if needed)

### Animations
- Entrance animations for engaging UX
- Smooth transitions between screens
- Interactive feedback animations

## 📦 Dependencies

Key packages used:
```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/native-stack": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "react-native-reanimated": "~3.x",
  "react-native-linear-gradient": "^2.x",
  "@react-native-async-storage/async-storage": "~1.x",
  "@expo/vector-icons": "^13.x"
}
```

## 🚀 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

Follow Expo's documentation for detailed build instructions and app store deployment.

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Product Manager
- UI/UX Designer
- React Native Developer
- Backend Developer

## 📞 Support

For support, email support@platefull.com or join our Slack channel.

## 🔜 Future Enhancements

- [ ] Recipe suggestions based on introduced foods
- [ ] Meal planning features
- [ ] Nutritionist consultations
- [ ] Social features for parent community
- [ ] AI-powered food recommendations
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline mode improvements

---

Made with ❤️ for parents and kids everywhere