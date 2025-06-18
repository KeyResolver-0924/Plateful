import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { config } from './src/constants/config';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import OTPScreen from './src/screens/auth/OTPScreen';
import VerificationSuccessScreen from './src/screens/auth/VerificationSuccessScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import MainNavigator from './src/navigation/MainNavigator';

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress
          }
        })
      }}
    >
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
      <AuthStack.Screen name="VerificationSuccess" component={VerificationSuccessScreen} />
    </AuthStack.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  // Google Auth Configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: config.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: config.GOOGLE_WEB_CLIENT_ID,
  });
  
  useEffect(() => {
    checkAuthState();
  }, []);
  
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignIn(response.authentication.accessToken);
    }
  }, [response]);
  
  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      
      setUserToken(token);
      setHasCompletedOnboarding(onboardingComplete === 'true');
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async (accessToken) => {
    try {
      // Here you would validate the token with your backend
      // For now, we'll just store it
      await AsyncStorage.setItem('userToken', accessToken);
      setUserToken(accessToken);
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };
  
  if (isLoading) {
    return null; // Or a loading screen
  }
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress
              }
            })
          }}
        >
          {!userToken ? (
            <>
              <Stack.Screen name="Splash" component={SplashScreen} />
              {!hasCompletedOnboarding && (
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              )}
              <Stack.Screen name="Auth" component={AuthNavigator} />
              <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            </>
          ) : (
            <Stack.Screen name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}