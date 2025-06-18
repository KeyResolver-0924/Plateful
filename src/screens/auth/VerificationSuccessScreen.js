import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { colors } from '../../constants/colors';
import Button from '../../components/common/Button';
import StatusBar from '../../components/common/StatusBar';

const VerificationSuccessScreen = ({ navigation, route }) => {
  const { isSignUp } = route.params;
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Animate success animation
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    
    rotation.value = withSequence(
      withTiming(360, { duration: 1000, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 0 })
    );
    
    checkmarkOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, []);
  
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });
  
  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: checkmarkOpacity.value,
    };
  });
  
  const handleContinue = () => {
    if (isSignUp) {
      navigation.replace('ProfileSetup');
    } else {
      navigation.replace('Main');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Image 
          source={require('../../assets/images/logo/platefull-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Welcome to PLATEFULL</Text>
        <Text style={styles.subtitleText}>Let's get started.</Text>
      </LinearGradient>
      
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.successContainer, containerAnimatedStyle]}>
          <View style={styles.successCircle}>
            <Animated.View style={checkmarkAnimatedStyle}>
              <Ionicons name="checkmark" size={60} color={colors.text.inverse} />
            </Animated.View>
          </View>
          
          <View style={styles.decorativeElements}>
            <View style={[styles.confetti, styles.confettiPink]} />
            <View style={[styles.confetti, styles.confettiOrange]} />
            <View style={[styles.confetti, styles.confettiBlue]} />
            <View style={[styles.confetti, styles.confettiGreen]} />
          </View>
        </Animated.View>
        
        <Text style={styles.congratsText}>Congratulations!</Text>
        <Text style={styles.messageText}>
          {isSignUp 
            ? 'Your Account Has been successfully created'
            : 'You have successfully logged In to your account'
          }
        </Text>
        
        <Button
          title={isSignUp ? "Go to Sign in" : "Explore"}
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  mascot: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  confettiPink: {
    backgroundColor: '#FF6B6B',
    top: 20,
    left: 30,
  },
  confettiOrange: {
    backgroundColor: colors.primary,
    top: 40,
    right: 20,
  },
  confettiBlue: {
    backgroundColor: '#4ECDC4',
    bottom: 30,
    left: 20,
  },
  confettiGreen: {
    backgroundColor: '#95E1D3',
    bottom: 20,
    right: 30,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  continueButton: {
    width: '100%',
  },
});

export default VerificationSuccessScreen;