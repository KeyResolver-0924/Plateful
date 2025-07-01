import { default as AsyncStorage, default as ReactNativeAsyncStorage } from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
    getReactNativePersistence,
    initializeAuth,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import {
    doc,
    getDoc,
    getFirestore,
    updateDoc
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { firebaseConfig } from './firebaseConfig';

// Check if Firebase config is properly set up
const isFirebaseConfigured = firebaseConfig.apiKey !== "your-api-key-here";

// Initialize Firebase only if config is properly set up
let app, auth, db, functions;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  db = getFirestore(app);
  functions = getFunctions(app);
} else {
  console.warn('Firebase not configured. Using mock authentication for development.');
}

// Storage Keys - You can customize these if needed
// These keys are used to store data in AsyncStorage
const STORAGE_KEYS = {
  USER_TOKEN: '@plateful_user_token',        // Stores authentication token
  USER_DATA: '@plateful_user_data',          // Stores user profile data
  AUTH_STATE: '@plateful_auth_state'         // Stores authentication state
};

// You can customize the keys like this:
// const STORAGE_KEYS = {
//   USER_TOKEN: '@your_app_name_user_token',
//   USER_DATA: '@your_app_name_user_data',
//   AUTH_STATE: '@your_app_name_auth_state'
// };

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.isMockMode = !isFirebaseConfigured;
    
    if (isFirebaseConfigured) {
      this.setupAuthStateListener();
    } else {
      this.setupMockAuthState();
    }
  }

  // Setup Firebase Auth state listener
  setupAuthStateListener() {
    if (!auth) return;
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUser = user;
        await this.loadUserProfile(user.uid);
        this.notifyAuthStateListeners(true, user);
      } else {
        this.currentUser = null;
        await this.clearStoredData();
        this.notifyAuthStateListeners(false, null);
      }
    });
  }

  // Setup mock auth state for development
  setupMockAuthState() {
    // Check if user is already logged in (stored in AsyncStorage)
    this.checkMockAuthState();
  }

  async checkMockAuthState() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);
        this.currentUser = user;
        this.notifyAuthStateListeners(true, user);
      }
    } catch (error) {
      console.error('Error checking mock auth state:', error);
    }
  }

  // Add auth state listener
  addAuthStateListener(listener) {
    this.authStateListeners.push(listener);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    };
  }

  // Notify all auth state listeners
  notifyAuthStateListeners(isAuthenticated, user) {
    this.authStateListeners.forEach(listener => {
      try {
        listener(isAuthenticated, user);
      } catch (error) {
        console.error('Auth state listener error:', error);
      }
    });
  }

  // User Registration
  async registerUser(userData) {
    try {
      const { email, password, fullName, phoneNumber } = userData;

      // Validate input
      if (!email || !password || !fullName || !phoneNumber) {
        throw new Error('All fields are required');
      }

      if (this.isMockMode) {
        // Mock registration for development
        const mockUserId = `mock_${Date.now()}`;
        const mockUser = {
          userId: mockUserId,
          email,
          fullName,
          phoneNumber,
          isSignUp: true
        };

        // Store temporary user data for OTP verification
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));

        return {
          success: true,
          userId: mockUserId,
          message: 'Mock registration successful. OTP codes sent.'
        };
      }

      // Real Firebase registration
      const registerUserFunction = httpsCallable(functions, 'registerUser');
      const result = await registerUserFunction({
        email,
        password,
        fullName,
        phoneNumber
      });

      const { userId, message } = result.data;

      // Store temporary user data for OTP verification
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
        userId,
        email,
        fullName,
        phoneNumber,
        isSignUp: true
      }));

      return {
        success: true,
        userId,
        message
      };

    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Verify OTP Codes
  async verifyOTP(userId, emailOtp, phoneOtp) {
    try {
      if (!userId || !emailOtp || !phoneOtp) {
        throw new Error('All OTP codes are required');
      }

      if (this.isMockMode) {
        // Mock OTP verification for development
        // For mock mode, accept any 4-digit phone OTP and 6-digit email OTP
        if (emailOtp.length !== 6 || phoneOtp.length !== 4) {
          throw new Error('Invalid OTP format. Email OTP should be 6 digits, Phone OTP should be 4 digits.');
        }

        const mockUser = {
          userId,
          profile: {
            firstName: 'Mock',
            lastName: 'User',
            email: 'mock@example.com',
            phoneNumber: '+1234567890',
            emailVerified: true,
            phoneVerified: true
          },
          userType: 'parent',
          subscription: {
            planType: 'free',
            status: 'active'
          },
          preferences: {
            notifications: {
              mealReminders: true,
              reportGeneration: true,
              achievements: true
            },
            language: 'en',
            units: 'imperial'
          }
        };

        // Store authentication data
        await this.storeAuthData('mock-token', mockUser);

        return {
          success: true,
          token: 'mock-token',
          user: mockUser,
          message: 'Mock OTP verification successful'
        };
      }

      // Real Firebase OTP verification
      const verifyOTPFunction = httpsCallable(functions, 'verifyOTP');
      const result = await verifyOTPFunction({
        userId,
        emailOtp,
        phoneOtp
      });

      const { token, user, message } = result.data;

      // Store authentication data
      await this.storeAuthData(token, user);

      return {
        success: true,
        token,
        user,
        message
      };

    } catch (error) {
      console.error('OTP verification error:', error);
      throw new Error(error.message || 'OTP verification failed');
    }
  }

  // User Sign In
  async signInUser(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (this.isMockMode) {
        // Mock sign in for development
        const mockUser = {
          userId: `mock_${Date.now()}`,
          email,
          profile: {
            firstName: 'Mock',
            lastName: 'User',
            email,
            phoneNumber: '+1234567890'
          },
          userType: 'parent',
          subscription: {
            planType: 'free',
            status: 'active'
          },
          preferences: {
            notifications: {
              mealReminders: true,
              reportGeneration: true,
              achievements: true
            },
            language: 'en',
            units: 'imperial'
          }
        };

        // Store authentication data
        await this.storeAuthData('mock-token', mockUser);

        return {
          success: true,
          token: 'mock-token',
          user: mockUser,
          message: 'Mock sign in successful'
        };
      }

      // Real Firebase sign in
      const signInUserFunction = httpsCallable(functions, 'signInUser');
      const result = await signInUserFunction({
        email,
        password
      });

      const { token, user, message } = result.data;

      // Store authentication data
      await this.storeAuthData(token, user);

      return {
        success: true,
        token,
        user,
        message
      };

    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Sign in failed');
    }
  }

  // Resend OTP
  async resendOTP(userId, type) {
    try {
      if (!userId || !type) {
        throw new Error('User ID and type are required');
      }

      if (this.isMockMode) {
        // Mock resend OTP
        return {
          success: true,
          message: `Mock ${type} OTP resent successfully`
        };
      }

      // Real Firebase resend OTP
      const resendOTPFunction = httpsCallable(functions, 'resendOTP');
      const result = await resendOTPFunction({
        userId,
        type
      });

      return {
        success: true,
        message: result.data.message
      };

    } catch (error) {
      console.error('Resend OTP error:', error);
      throw new Error(error.message || 'Failed to resend OTP');
    }
  }

  // Password Reset
  async resetPassword(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      if (this.isMockMode) {
        // Mock password reset
        return {
          success: true,
          message: 'Mock password reset email sent'
        };
      }

      // Real Firebase password reset
      const resetPasswordFunction = httpsCallable(functions, 'resetPassword');
      const result = await resetPasswordFunction({ email });

      return {
        success: true,
        message: result.data.message
      };

    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  }

  // Sign Out
  async signOut() {
    try {
      if (this.isMockMode) {
        // Mock sign out
        this.currentUser = null;
        await this.clearStoredData();
        this.notifyAuthStateListeners(false, null);
        return { success: true };
      }

      // Real Firebase sign out
      await signOut(auth);
      await this.clearStoredData();
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Sign out failed');
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Load user profile from Firestore
  async loadUserProfile(userId) {
    try {
      if (this.isMockMode) {
        // Mock user profile
        const mockProfile = {
          userId,
          profile: {
            firstName: 'Mock',
            lastName: 'User',
            email: 'mock@example.com',
            phoneNumber: '+1234567890'
          },
          userType: 'parent',
          subscription: {
            planType: 'free',
            status: 'active'
          },
          preferences: {
            notifications: {
              mealReminders: true,
              reportGeneration: true,
              achievements: true
            },
            language: 'en',
            units: 'imperial'
          }
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockProfile));
        return mockProfile;
      }

      // Real Firebase user profile
      if (!db) return null;
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Load user profile error:', error);
      return null;
    }
  }

  // Get stored user data
  async getStoredUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get stored user data error:', error);
      return null;
    }
  }

  // Store authentication data
  async storeAuthData(token, user) {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_STATE, 'true')
      ]);
    } catch (error) {
      console.error('Store auth data error:', error);
    }
  }

  // Clear stored data
  async clearStoredData() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_STATE)
      ]);
    } catch (error) {
      console.error('Clear stored data error:', error);
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      if (this.isMockMode) {
        // Mock profile update
        const currentUserData = await this.getStoredUserData();
        if (currentUserData) {
          const updatedUserData = { ...currentUserData, ...updates };
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUserData));
        }
        return { success: true };
      }

      // Real Firebase profile update
      if (!db) return { success: false };
      
      await updateDoc(doc(db, 'users', userId), updates);
      
      // Update stored user data
      const currentUserData = await this.getStoredUserData();
      if (currentUserData) {
        const updatedUserData = { ...currentUserData, ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUserData));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Update user profile error:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Get stored token
  async getStoredToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Get stored token error:', error);
      return null;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService; 