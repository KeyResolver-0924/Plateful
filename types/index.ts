// Authentication Types
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
  (isAuthenticated: boolean, user: any | CompleteUser | null): void;
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

// Form Types
export interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

// OTP Types
export interface OTPData {
  phoneOtp: string[];
  emailOtp: string[];
  phoneNumber: string;
  email: string;
  userId: string;
  isSignUp: boolean;
}

// Navigation Types
export interface NavigationParams {
  phoneNumber?: string;
  email?: string;
  isSignUp?: string;
  userId?: string;
}

// Video Types
export interface VideoConfig {
  url: string;
  title?: string;
  description?: string;
}

// Common UI Types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'google';
  style?: any;
  icon?: React.ReactNode;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  error?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  style?: any;
  textAlign?: 'left' | 'center' | 'right';
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyPress?: (e: any) => void;
}

// Food and Nutrition Types
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  image?: string;
}

export interface MealData {
  id: string;
  userId: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  timestamp: Date;
  totalCalories: number;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  progress: number;
  target: number;
  completed: boolean;
  reward: {
    type: 'points' | 'badge' | 'unlock';
    value: any;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// Firebase Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// App Configuration Types
export interface AppConfig {
  introVideo: VideoConfig;
  version: string;
  buildNumber: string;
  features: {
    camera: boolean;
    gamification: boolean;
    analytics: boolean;
  };
} 