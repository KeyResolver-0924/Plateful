import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Profile Setup Screens
import ProfileSetupScreen from '../screens/profileSetup/ProfileSetupScreen';
import FoodSelectionScreen from '../screens/profileSetup/FoodSelectionScreens';
import ChildProfileScreen from '../screens/main/ChildProfileScreen';

// Onboarding
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import LearningModuleScreen from '../screens/main/LearningModuleScreen';

// Food Screens
import FoodReportScreen from '../screens/food/FoodReportScreen';

// Meal Screens
import MealHistoryScreen from '../screens/meal/MealHistoryScreen';
import MealTrackingScreen from '../screens/meal/MealTrackingScreen';

// Gamification Screens
import BadgesScreen from '../screens/gamification/BadgesScreen';
import QuestsScreen from '../screens/gamification/QuestsScreen';
import LeaderboardScreen from '../screens/gamification/LeaderboardScreen';

// Constants
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ChildProfile') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'LearningModule') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Reporting') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="ChildProfile" 
        component={ChildProfileScreen} 
        options={{ tabBarLabel: "Child's Profile" }}
      />
      <Tab.Screen 
        name="LearningModule" 
        component={LearningModuleScreen} 
        options={{ tabBarLabel: 'Learning Module' }}
      />
      <Tab.Screen 
        name="Reporting" 
        component={MealHistoryScreen} 
        options={{ tabBarLabel: 'Reporting' }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
        {/* Profile Setup Stack */}
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="FoodSelection" component={FoodSelectionScreen} />
        <Stack.Screen name="ProfileComplete" component={ChildProfileScreen} />
        
        {/* Onboarding */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        
        {/* Main App */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
        
        {/* Food Management */}
        <Stack.Screen name="FoodReport" component={FoodReportScreen} />
        <Stack.Screen name="MealTracking" component={MealTrackingScreen} />
        <Stack.Screen name="MealHistory" component={MealHistoryScreen} />
        
        {/* Gamification */}
        <Stack.Screen name="Badges" component={BadgesScreen} />
        <Stack.Screen name="Quests" component={QuestsScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;