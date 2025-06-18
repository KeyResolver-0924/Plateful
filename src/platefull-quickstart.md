# PLATEFULL - Quick Start Guide 🚀

Get the PLATEFULL app running on your machine in 5 minutes!

## 📋 Prerequisites Checklist

- [ ] Node.js installed (v14+)
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Expo Go app on your phone (for testing on device)

## 🏃‍♂️ Quick Setup (3 Steps)

### 1. Clone and Install
```bash
# Clone the repo
git clone https://github.com/yourusername/platefull.git
cd platefull

# Install dependencies
npm install
```

### 2. Add Required Assets
Create placeholder images in `src/assets/images/`:
```bash
# Create directories
mkdir -p src/assets/images/logo
mkdir -p src/assets/images/avatars
mkdir -p src/assets/images/onboarding

# Download placeholder images (or add your own)
# Logo: 200x200px PNG
# Avatars: 100x100px JPG
# Onboarding: 300x300px PNG
```

### 3. Start the App
```bash
# Start Expo
expo start

# Then:
# - Press 'i' for iOS Simulator
# - Press 'a' for Android Emulator
# - Scan QR code with Expo Go app
```

## 🎯 Test Flow

1. **Splash Screen** → Wait 2 seconds
2. **Welcome Screen** → Click "Get Started"
3. **Login Screen** → Click "Create new account"
4. **Register Screen** → Fill form and submit
5. **Profile Setup** → Enter child details
6. **Food Selection** → Select introduced foods
7. **Home Dashboard** → Explore the app!

## 🔑 Test Credentials

For quick testing, use:
- Email: `test@platefull.com`
- Password: `Test123!`

## 📱 Key Features to Try

1. **Home Screen**
   - View child's ranking
   - Access different modules

2. **Food Report**
   - Browse food categories
   - Track introduced foods

3. **Meal Tracking**
   - Log daily meals
   - View nutritional data

4. **Learning Module**
   - Watch educational videos
   - Complete quizzes

5. **Gamification**
   - Check badges and stats
   - View leaderboard
   - Complete quests

## 🐛 Common Issues

### "Module not found" Error
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

### Images not showing
- Ensure all image assets are in the correct folders
- Check file extensions match the imports

### Navigation errors
- Make sure all screens are properly imported in navigation/index.js

## 📝 Development Tips

1. **Hot Reload**: Enabled by default - just save files to see changes
2. **Debugging**: Shake device or press `d` in terminal
3. **Performance**: Use React DevTools for optimization
4. **Testing**: Test on both iOS and Android

## 🎨 Customization

### Change Primary Color
Edit `src/constants/colors.js`:
```javascript
export const colors = {
  primary: '#YOUR_COLOR',
  // ...
};
```

### Add New Screen
1. Create screen in `src/screens/`
2. Import in `src/navigation/index.js`
3. Add to Stack.Navigator

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

## 🆘 Need Help?

- Check the [full README](README.md)
- Open an issue on GitHub
- Contact the development team

---

Happy coding! 🎉