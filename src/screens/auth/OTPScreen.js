import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { config } from '../../constants/config';
import Button from '../../components/common/Button';
import StatusBar from '../../components/common/StatusBar';

const OTPScreen = ({ navigation, route }) => {
  const { phoneNumber, isSignUp } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(config.otp.resendDelay);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const shakeAnimation = useSharedValue(0);
  
  useEffect(() => {
    // Focus first input
    inputRefs.current[0]?.focus();
    
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto submit when all fields are filled
    if (index === 3 && value) {
      const otpString = newOtp.join('');
      if (otpString.length === 4) {
        Keyboard.dismiss();
        handleVerify();
      }
    }
  };
  
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      shakeInputs();
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to success screen
      navigation.navigate('VerificationSuccess', { isSignUp });
    } catch (error) {
      console.error('OTP verification error:', error);
      shakeInputs();
    } finally {
      setLoading(false);
    }
  };
  
  const shakeInputs = () => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };
  
  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(config.otp.resendDelay);
    
    // Start timer again
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Simulate resend OTP
    console.log('Resending OTP...');
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }],
    };
  });
  
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
      
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Phone Number Verification</Text>
          <Text style={styles.formSubtitle}>
            Enter OTP to get your account verified
          </Text>
        </View>
        
        <Text style={styles.phoneText}>
          OTP sent to {phoneNumber}
        </Text>
        
        <Animated.View style={[styles.otpContainer, animatedStyle]}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : null
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>
        
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend in {formatTime(resendTimer)}
            </Text>
          )}
        </View>
        
        <Button
          title="Verify Account"
          onPress={handleVerify}
          loading={loading}
          style={styles.verifyButton}
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
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  phoneText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 8,
    color: colors.text.primary,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  resendText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  verifyButton: {
    marginTop: 16,
  },
});

export default OTPScreen;