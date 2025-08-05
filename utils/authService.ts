import { Platform } from 'react-native';
import { safeGetItem, safeRemoveItem, safeSetItem } from './storage';
import apiClient from './apiClient';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  age?: string;
  dietaryRestrictions?: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SignInResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface SignUpResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message: string;
}

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Sign in user with email and password
  async signInUser(email: string, password: string): Promise<SignInResult> {
    try {
      console.log('AuthService: Attempting sign in for:', email, 'on platform:', Platform.OS);
      
      const response = await apiClient.post<AuthResponse>('/api/auth/signin', {
        email,
        password
      });

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store user data and token
        const storeSuccess = await Promise.all([
          safeSetItem('userToken', token),
          safeSetItem('userEmail', user.email),
          safeSetItem('userName', user.name),
          safeSetItem('userId', user.id)
        ]);
        
        if (storeSuccess.every(success => success)) {
          console.log('AuthService: Sign in successful, token stored');
          return {
            success: true,
            user,
            token,
            message: response.data.message || 'Sign in successful'
          };
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        return {
          success: false,
          message: response.error || 'Sign in failed'
        };
      }
    } catch (error: any) {
      console.error('AuthService: Sign in error:', error);
      return {
        success: false,
        message: error?.message || 'Sign in failed'
      };
    }
  }

  // Sign up new user
  async signUpUser(email: string, password: string, name: string, phone?: string): Promise<SignUpResult> {
    try {
      console.log('AuthService: Attempting sign up for:', email, 'on platform:', Platform.OS);
      
      const signUpData: any = {
        email,
        password,
        name
      };

      if (phone) {
        signUpData.phone = phone;
      }

      const response = await apiClient.post<AuthResponse>('/api/auth/signup', signUpData);

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store user data and token
        const storeSuccess = await Promise.all([
          safeSetItem('userToken', token),
          safeSetItem('userEmail', user.email),
          safeSetItem('userName', user.name),
          safeSetItem('userId', user.id)
        ]);
        
        if (storeSuccess.every(success => success)) {
          console.log('AuthService: Sign up successful, token stored');
          return {
            success: true,
            user,
            token,
            message: response.data.message || 'Account created successfully'
          };
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        return {
          success: false,
          message: response.error || 'Sign up failed'
        };
      }
    } catch (error: any) {
      console.error('AuthService: Sign up error:', error);
      return {
        success: false,
        message: error?.message || 'Sign up failed'
      };
    }
  }

  // Get current user from storage
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await safeGetItem('userToken');
      if (!token) {
        return null;
      }

      const [email, name, id] = await Promise.all([
        safeGetItem('userEmail'),
        safeGetItem('userName'),
        safeGetItem('userId')
      ]);

      if (email && name && id) {
        return {
          id,
          email,
          name
        };
      }

      return null;
    } catch (error) {
      console.error('AuthService: Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await safeGetItem('userToken');
      return !!token;
    } catch (error) {
      console.error('AuthService: Check authentication error:', error);
      return false;
    }
  }

  // Sign out user
  async signOut(): Promise<boolean> {
    try {
      console.log('AuthService: Signing out user');
      
      // Remove all auth-related data using web-compatible storage
      const removeSuccess = await Promise.all([
        safeRemoveItem('userToken'),
        safeRemoveItem('userEmail'),
        safeRemoveItem('userName'),
        safeRemoveItem('userId')
      ]);

      const success = removeSuccess.every(success => success);
      console.log('AuthService: Sign out', success ? 'successful' : 'failed');
      return success;
    } catch (error) {
      console.error('AuthService: Sign out error:', error);
      return false;
    }
  }

  // Send OTP for verification
  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api/auth/send-otp', { email });
      return {
        success: response.success,
        message: response.error || response.data?.message || 'OTP sent successfully'
      };
    } catch (error: any) {
      console.error('AuthService: Send OTP error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to send OTP'
      };
    }
  }

  // Verify OTP
  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api/auth/verify-otp', { email, otp });
      return {
        success: response.success,
        message: response.error || response.data?.message || 'OTP verified successfully'
      };
    } catch (error: any) {
      console.error('AuthService: Verify OTP error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to verify OTP'
      };
    }
  }

  // Reset password
  async resetPassword(email: string, newPassword: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api/auth/reset-password', {
        email,
        newPassword,
        otp
      });
      return {
        success: response.success,
        message: response.error || response.data?.message || 'Password reset successfully'
      };
    } catch (error: any) {
      console.error('AuthService: Reset password error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to reset password'
      };
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put('/api/users/profile', profileData);
      if (response.success && response.data) {
        // Update stored user data
        if (response.data.name) {
          await safeSetItem('userName', response.data.name);
        }
        return {
          success: true,
          message: response.data.message || 'Profile updated successfully'
        };
      } else {
        return {
          success: false,
          message: response.error || 'Failed to update profile'
        };
      }
    } catch (error: any) {
      console.error('AuthService: Update profile error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to update profile'
      };
    }
  }

  // Get user profile
  async getUserProfile(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await apiClient.get<User>('/api/users/profile');
      if (response.success && response.data) {
        return {
          success: true,
          user: response.data
        };
      } else {
        return {
          success: false,
          message: response.error || 'Failed to get user profile'
        };
      }
    } catch (error: any) {
      console.error('AuthService: Get user profile error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to get user profile'
      };
    }
  }
}

// Export singleton instance
const authService = AuthService.getInstance();
export default authService; 