export interface AgeRange {
  label: string;
  value: string;
}

export interface DietaryRestriction {
  label: string;
  value: string;
}

export interface AnimationConfig {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    standard: string;
    decelerate: string;
    accelerate: string;
  };
}

export interface OtpConfig {
  length: number;
  resendDelay: number;
  expiryTime: number;
}

export interface ImageUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  quality: number;
}

export interface FoodCategories {
  fruits: string;
  vegetables: string;
  proteins: string;
  grains: string;
  dairy: string;
}

export interface Config {
  APP_NAME: string;
  API_BASE_URL: string;
  GOOGLE_IOS_CLIENT_ID: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  animation: AnimationConfig;
  otp: OtpConfig;
  imageUpload: ImageUploadConfig;
  foodCategories: FoodCategories;
  ageRanges: AgeRange[];
  dietaryRestrictions: DietaryRestriction[];
}

export const config: Config = {
  APP_NAME: 'PlateFull',
  API_BASE_URL: 'https://api.platefull.com',
  
  // Google OAuth Configuration
  GOOGLE_IOS_CLIENT_ID: 'YOUR_IOS_CLIENT_ID',
  GOOGLE_ANDROID_CLIENT_ID: 'YOUR_ANDROID_CLIENT_ID',
  GOOGLE_WEB_CLIENT_ID: 'YOUR_WEB_CLIENT_ID',
  
  // Animation Configuration
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500
    },
    easing: {
      standard: 'ease-in-out',
      decelerate: 'ease-out',
      accelerate: 'ease-in'
    }
  },
  
  // OTP Configuration
  otp: {
    length: 4,
    resendDelay: 180, // 3 minutes in seconds
    expiryTime: 300 // 5 minutes in seconds
  },
  
  // Image Upload Configuration
  imageUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    quality: 0.8
  },
  
  // Food Categories
  foodCategories: {
    fruits: 'Fruits',
    vegetables: 'Vegetables',
    proteins: 'Proteins',
    grains: 'Grains',
    dairy: 'Dairy'
  },
  
  // Age Ranges
  ageRanges: [
    { label: '6-12 months', value: '6-12m' },
    { label: '1-2 years', value: '1-2y' },
    { label: '2-3 years', value: '2-3y' },
    { label: '3-4 years', value: '3-4y' },
    { label: '4-5 years', value: '4-5y' },
    { label: '5-6 years', value: '5-6y' },
    { label: '6+ years', value: '6+y' }
  ],
  
  // Dietary Restrictions
  dietaryRestrictions: [
    { label: 'None', value: 'none' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten Free', value: 'gluten_free' },
    { label: 'Dairy Free', value: 'dairy_free' },
    { label: 'Nut Free', value: 'nut_free' },
    { label: 'Egg Free', value: 'egg_free' },
    { label: 'Soy Free', value: 'soy_free' }
  ]
};

export default config; 