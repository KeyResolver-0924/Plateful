import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const plateRotation = useSharedValue(0);
  
  useEffect(() => {
    // Animate logo entrance
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    
    opacity.value = withTiming(1, { duration: 500 });
    
    // Rotate plate
    plateRotation.value = withSequence(
      withDelay(500, withTiming(360, { duration: 1000 })),
      withTiming(0, { duration: 0 })
    );
    
    // Navigate to onboarding after animation
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  
  const plateAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${plateRotation.value}deg` }],
    };
  });
  
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Animated.View style={plateAnimatedStyle}>
          <View style={styles.plate}>
            {/* Food sections in plate */}
            <View style={styles.plateSection}>
              <Image 
                source={require('../assets/images/food-icons/vegetables.png')} 
                style={styles.foodIcon}
              />
            </View>
            <View style={[styles.plateSection, styles.plateSectionRight]}>
              <Image 
                source={require('../assets/images/food-icons/fruits.png')} 
                style={styles.foodIcon}
              />
            </View>
            <View style={[styles.plateSection, styles.plateSectionBottom]}>
              <Image 
                source={require('../assets/images/food-icons/proteins.png')} 
                style={styles.foodIcon}
              />
            </View>
            <View style={[styles.plateSection, styles.plateSectionLeft]}>
              <Image 
                source={require('../assets/images/food-icons/grains.png')} 
                style={styles.foodIcon}
              />
            </View>
            
            {/* Center fork */}
            <View style={styles.centerIcon}>
              <Text style={styles.forkIcon}>🍴</Text>
            </View>
          </View>
        </Animated.View>
        
        <Text style={styles.title}>PLATE FULL</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  plate: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.background,
    position: 'relative',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  plateSection: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.border,
  },
  plateSectionRight: {
    right: 0,
    borderRightWidth: 0,
    borderLeftWidth: 2,
  },
  plateSectionBottom: {
    bottom: 0,
    borderBottomWidth: 0,
    borderTopWidth: 2,
  },
  plateSectionLeft: {
    bottom: 0,
    right: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
  foodIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  centerIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  forkIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginTop: 24,
    letterSpacing: 2,
  },
});