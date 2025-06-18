import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import StatusBar from '../../components/common/StatusBar';

const SignInScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSignIn = async () => {
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to OTP verification
      navigation.navigate('OTP', { 
        phoneNumber: phoneNumber,
        isSignUp: false 
      });
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      // Implement Google OAuth
      console.log('Google Sign In');
    } catch (error) {
      console.error('Google sign in error:', error);
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
      
      <KeyboardAvoidingView 
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Welcome Back!</Text>
            <Text style={styles.formSubtitle}>
              Let's login for explore continues
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Phone Number"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (error) setError('');
              }}
              placeholder="Enter your Phone Number"
              keyboardType="phone-pad"
              maxLength={10}
              error={error}
              icon={<Ionicons name="call-outline" />}
            />
            
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              style={styles.signInButton}
            />
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.divider} />
            </View>
            
            <Button
              title="Log in with Google"
              onPress={handleGoogleSignIn}
              variant="google"
              icon={
                <Image 
                  source={require('../../assets/images/icons/google.png')}
                  style={styles.googleIcon}
                />
              }
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Sign Up here</Text>
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
  signInButton: {
    marginTop: 24,
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
    fontSize: 16,
    color: colors.text.primary,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SignInScreen;