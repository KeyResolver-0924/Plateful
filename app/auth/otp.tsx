import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import OTPInput from '../../components/common/OTPInput';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import authService from '../../utils/authService';

const OTPScreen = () => {
  const params = useLocalSearchParams();
  const { phoneNumber, email, isSignUp, userId } = params;
  
  const [phoneOtp, setPhoneOtp] = useState<string[]>(['', '', '', '']);
  const [emailOtp, setEmailOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);
  
  const handleVerifyOTP = async (): Promise<void> => {
    const phoneOtpString = phoneOtp.join('');
    const emailOtpString = emailOtp.join('');
    
    if (phoneOtpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit phone OTP');
      return;
    }
    
    if (emailOtpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit email OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify OTP with real authentication service
      const result = await authService.verifyOTP(phoneOtpString);
      
      if (result.success) {
        // Navigate to verification success
        router.push({
          pathname: '/auth/verification-success',
          params: { isSignUp: (isSignUp === 'true').toString() }
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', (error as Error).message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOTP = async (): Promise<void> => {
    setResendLoading(true);
    
    try {
      // Resend OTP using real authentication service
      await Promise.all([
        authService.resendOTP(userId as string, 'email'),
        authService.resendOTP(userId as string, 'phone')
      ]);
      
      setTimer(30);
      Alert.alert('Success', 'OTP codes resent successfully!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', (error as Error).message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
        </TouchableOpacity>
        
        <Image 
          source={require('../../assets/images/logo/platefull-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Verify Your Account</Text>
        <Text style={styles.subtitleText}>Enter the codes sent to</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        <Text style={styles.emailText}>{email}</Text>
      </LinearGradient>
      
      <KeyboardAvoidingView 
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Enter OTP Codes</Text>
            <Text style={styles.formSubtitle}>
              We've sent verification codes to your phone and email
            </Text>
          </View>
          
          <View style={styles.form}>
            <OTPInput
              length={4}
              value={phoneOtp}
              onChange={setPhoneOtp}
              label="Phone Verification Code (4 digits)"
              keyboardType="numeric"
              autoFocus={true}
            />
            
            <OTPInput
              length={6}
              value={emailOtp}
              onChange={setEmailOtp}
              label="Email Verification Code (6 digits)"
              keyboardType="numeric"
            />
            
            <Button
              title="Verify OTP"
              onPress={handleVerifyOTP}
              loading={loading}
              style={styles.verifyButton}
            />
            
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code? 
              </Text>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={timer > 0 || resendLoading}
                style={styles.resendButton}
              >
                <Text style={[
                  styles.resendButtonText,
                  (timer > 0 || resendLoading) && styles.resendButtonDisabled
                ]}>
                  {resendLoading ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  mascot: {
    width: 180,
    height: 180,
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
  phoneNumber: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  emailText: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
    marginTop: 4,
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
  scrollContent: {
    flexGrow: 1,
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
  form: {
    flex: 1,
  },
  verifyButton: {
    marginTop: 16,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  resendButton: {
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
  resendButtonText: {
    fontSize: 16,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  resendButtonDisabled: {
    backgroundColor: colors.border,
  },
});

export default OTPScreen; 