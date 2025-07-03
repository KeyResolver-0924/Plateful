import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPhoneNumber, signOut, updateProfile, User } from 'firebase/auth';
import {
    doc,
    getDoc,
    getFirestore,
    updateDoc
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../app/firebase';
import { firebaseConfig } from './firebaseConfig';

// Type definitions
export interface UserData {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isSignUp?: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface UserPreferences {
  notifications: {
    mealReminders: boolean;
    reportGeneration: boolean;
    achievements: boolean;
  };
  language: string;
  units: string;
}

export interface UserSubscription {
  planType: string;
  status: string;
}

export interface CompleteUser {
  userId: string;
  email?: string;
  profile: UserProfile;
  userType: string;
  subscription: UserSubscription;
  preferences: UserPreferences;
}

export interface AuthStateListener {
  (isAuthenticated: boolean, user: User | CompleteUser | null): void;
}

export interface RegistrationData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface AuthResponse {
  success: boolean;
  userId?: string;
  token?: string;
  user?: CompleteUser;
  message: string;
}

// Check if Firebase config is properly set up
const isFirebaseConfigured = firebaseConfig.apiKey !== "your-api-key-here";

// Initialize Firebase only if config is properly set up
let db: any, functions: any;

if (isFirebaseConfigured) {
  // Firebase is initialized in app/firebase.ts
  db = getFirestore();
  functions = getFunctions();
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
  private currentUser: User | CompleteUser | null = null;
  private authStateListeners: AuthStateListener[] = [];
  private isMockMode: boolean = !isFirebaseConfigured;
  private confirmationResult: any;

  constructor() {
    if (isFirebaseConfigured) {
      this.setupAuthStateListener();
    } else {
      this.setupMockAuthState();
    }
  }

  // Setup Firebase Auth state listener
  private setupAuthStateListener(): void {
    if (!auth) return;
    
    onAuthStateChanged(auth, async (user: User | null) => {
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
  private setupMockAuthState(): void {
    // Check if user is already logged in (stored in AsyncStorage)
    this.checkMockAuthState();
  }

  private async checkMockAuthState(): Promise<void> {
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
  addAuthStateListener(listener: AuthStateListener): () => void {
    this.authStateListeners.push(listener);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    };
  }

  // Notify all auth state listeners
  private notifyAuthStateListeners(isAuthenticated: boolean, user: User | CompleteUser | null): void {
    this.authStateListeners.forEach(listener => {
      try {
        listener(isAuthenticated, user);
      } catch (error) {
        console.error('Auth state listener error:', error);
      }
    });
  }

  // User Registration
  async registerUser(userData: RegistrationData): Promise<AuthResponse> {
    try {
      const { email, password, fullName, phoneNumber } = userData;

      // Validate input
      if (!email || !password || !fullName || !phoneNumber) {
        throw new Error('All fields are required');
      }

      if (this.isMockMode) {
        // Mock registration for development
        const mockUserId = `mock_${Date.now()}`;
        const mockUser: UserData = {
          userId: mockUserId,
          email,
          fullName,
          phoneNumber,
          isSignUp: true
        };
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
        return {
          success: true,
          userId: mockUserId,
          message: 'Mock registration successful. OTP codes sent.'
        };
      }

      // Real Firebase registration (email/password)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Optionally send email verification
      // await sendEmailVerification(user);
      // Optionally update profile
      await updateProfile(user, { displayName: fullName });
      // Optionally store phone number in Firestore or Realtime DB
      // For phone auth, you would trigger phone verification separately
      return {
        success: true,
        userId: user.uid,
        message: 'Registration successful. Please verify your email or continue with OTP.'
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  // User Sign In
  async signInUser(email: string, password: string): Promise<AuthResponse> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      if (this.isMockMode) {
        // Mock sign in for development
        const mockUser: CompleteUser = {
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
        await this.storeAuthData('mock-token', mockUser);
        return {
          success: true,
          token: 'mock-token',
          user: mockUser,
          message: 'Mock sign in successful'
        };
      }
      // Real Firebase sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Optionally check email verification
      // if (!user.emailVerified) throw new Error('Please verify your email.');
      return {
        success: true,
        userId: user.uid,
        message: 'Sign in successful.'
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Sign in failed');
    }
  }

  // For phone/OTP flows, you would use Firebase's signInWithPhoneNumber and confirmationResult.confirm(otp)
  // Here is a basic structure for OTP send/verify (client-side only):
  async sendPhoneOTP(phoneNumber: string, recaptchaVerifier: any): Promise<any> {
    if (this.isMockMode) {
      return { success: true, message: 'Mock OTP sent.' };
    }
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      // Store confirmationResult for later verification
      this.confirmationResult = confirmationResult;
      return { success: true, message: 'OTP sent.' };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  async verifyOTP(otp: string): Promise<AuthResponse> {
    if (this.isMockMode) {
      return { success: true, message: 'Mock OTP verified.' };
    }
    try {
      if (!this.confirmationResult) throw new Error('No OTP confirmation in progress.');
      const result = await this.confirmationResult.confirm(otp);
      const user = result.user;
      return { success: true, userId: user.uid, message: 'OTP verified.' };
    } catch (error: any) {
      throw new Error(error.message || 'OTP verification failed');
    }
  }

  // Resend OTP
  async resendOTP(userId: string, type: string): Promise<AuthResponse> {
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
        message: (result.data as { message: string }).message
      };

    } catch (error: any) {
      console.error('Resend OTP error:', error);
      throw new Error(error.message || 'Failed to resend OTP');
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<AuthResponse> {
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
        message: (result.data as { message: string }).message
      };

    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  }

  // Sign Out
  async signOut(): Promise<{ success: boolean }> {
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
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Sign out failed');
    }
  }

  // Get current user
  getCurrentUser(): User | CompleteUser | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Load user profile from Firestore
  async loadUserProfile(userId: string): Promise<CompleteUser | null> {
    try {
      if (this.isMockMode) {
        // Mock user profile
        const mockProfile: CompleteUser = {
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
        const userData = userDoc.data() as CompleteUser;
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
  async getStoredUserData(): Promise<CompleteUser | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get stored user data error:', error);
      return null;
    }
  }

  // Store authentication data
  private async storeAuthData(token: string, user: CompleteUser): Promise<void> {
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
  async clearStoredData(): Promise<void> {
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
  async updateUserProfile(userId: string, updates: Partial<CompleteUser>): Promise<{ success: boolean }> {
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
    } catch (error: any) {
      console.error('Update user profile error:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Get stored token
  async getStoredToken(): Promise<string | null> {
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