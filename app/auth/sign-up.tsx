import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PhoneInput from '../../components/common/PhoneInput';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import authService from '../../utils/authService';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpScreen = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('US');
  const [country, setCountry] = useState(null);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [phone, setPhone] = useState('');
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      // Remove the country code to get just the number
      const phoneWithoutCode = formData.phoneNumber.replace(/^\+\d{1,4}/, '');
      if (phoneWithoutCode.length < 7) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else if (formData.confirmPassword != formData.password) {
      newErrors.confirmPassword = 'Input the same password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSignUp = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Register user with real authentication service
      const result = await authService.registerUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber
      });
      
      if (result.success) {
        // Navigate to OTP verification with user data
        router.push({
          pathname: '/auth/otp',
          params: { 
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            isSignUp: 'true',
            userId: result.userId
          }
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', (error as Error).message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignUp = async (): Promise<void> => {
    try {
      // Implement Google OAuth
      console.log('Google Sign Up');
    } catch (error) {
      console.error('Google sign up error:', error);
    }
  };
  
  const updateFormData = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
        <Text style={styles.welcomeText}>Join PLATEFULL</Text>
        <Text style={styles.subtitleText}>Create your account</Text>
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
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>
              Fill in your details to get started
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => updateFormData('fullName', text)}
              error={errors.fullName}
              icon={<Ionicons name="person-outline" />}
            />
            
            <Input
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
              icon={<Ionicons name="mail-outline" />}
            />
            
            <PhoneInput
              value={formData.phoneNumber}
              onChangeText={(text: string) => updateFormData('phoneNumber', text)}
              placeholder="Enter your phone number"
              error={errors.phoneNumber}
              style={{}}
              containerStyle={{}}
            />
            
            <Input
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
              icon={<Ionicons name="lock-closed-outline" />}
            />
            
            <Input
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
              icon={<Ionicons name="lock-closed-outline" />}
            />
            
            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={loading}
              style={styles.signUpButton}
            />
            
            <Button
              title="Back to Sign In"
              onPress={() => router.push('/auth/sign-in')}
              variant="outline"
              style={styles.backToSignInButton}
            />
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.divider} />
            </View>
            
            <Button
              title="Sign up with Google"
              onPress={handleGoogleSignUp}
              variant="google"
              icon={
                <Image 
                  source={require('../../assets/images/icons/google.png')}
                  style={styles.googleIcon}
                />
              }
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>By creating an account, you agree to our Terms of Service and Privacy Policy</Text>
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
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
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
    width: '100%',
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  backToSignInButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginHorizontal: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SignUpScreen; 