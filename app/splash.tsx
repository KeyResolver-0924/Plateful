import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Animate logo entrance
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
            delay: 500
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            delay: 500
          })
        ]).start();
        
        // Animate text entrance
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          delay: 1200
        }).start();
        
        // Check authentication state
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const userToken = await AsyncStorage.getItem('userToken');
        const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
        
        if (userToken) {
          // User is authenticated, go to main app
          router.replace('../(tabs)');
        } else if (onboardingComplete === 'true') {
          // User has completed onboarding but not authenticated
          router.replace('../auth/sign-in');
        } else {
          // First time user, show onboarding
          router.replace('../auth/onboarding');
        }
      } catch (error) {
        // Fallback to sign-in screen
        router.replace('../auth/sign-in');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity
            }
          ]}
        >
          <Image 
            source={require('../assets/images/logo/platefull-mascot.png')}
            style={styles.logo}
          />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.textContainer,
            { opacity: textOpacity }
          ]}
        >
          <Text style={styles.appName}>PLATEFUL</Text>
          <Text style={styles.tagline}>Nourishing Little Ones</Text>
        </Animated.View>
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    color: colors.text.inverse,
    opacity: 0.9,
    fontStyle: 'italic',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.8,
  },
});

export default SplashScreen; 