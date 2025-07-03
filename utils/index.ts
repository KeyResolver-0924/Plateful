import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  birthdate: string;
  gender: string;
  avatar?: string;
}

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
    sugar: number;
    sodium: number;
    calcium: number;
    iron: number;
    vitaminA: number;
    vitaminC: number;
  };
  image?: string;
}

export interface MealData {
  id: string;
  timestamp: string;
  childId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    calcium: number;
    iron: number;
    vitaminA: number;
    vitaminC: number;
  };
}

export interface UserData {
  id: string;
  name: string;
  email: string;
}

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
  CHILD_PROFILES: '@child_profiles',
  FOOD_HISTORY: '@food_history',
  MEAL_HISTORY: '@meal_history',
  ONBOARDING_COMPLETE: '@onboarding_complete',
};

// Storage Functions
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
};

// Validation Functions
export const validators = {
  email(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  password(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  },

  phone(phone: string): boolean {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone.replace(/\s/g, ''));
  },

  name(name: string): boolean {
    return Boolean(name && name.trim().length >= 2);
  },

  age(age: string | number): boolean {
    const ageNum = typeof age === 'string' ? parseInt(age) : age;
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 18;
  },
};

// Date Utilities
export const dateUtils = {
  formatDate(date: Date | string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  },

  formatTime(date: Date | string): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleTimeString(undefined, options);
  },

  formatDateTime(date: Date | string): string {
    return `${this.formatDate(date)} - ${this.formatTime(date)}`;
  },

  getAgeFromBirthdate(birthdate: string): number {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  getAgeString(birthdate: string): string {
    const ageInMonths = this.getAgeInMonths(birthdate);
    
    if (ageInMonths < 12) {
      return `${ageInMonths} months`;
    } else if (ageInMonths < 24) {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years} year ${months} months` : `${years} year`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      return `${years} years`;
    }
  },

  getAgeInMonths(birthdate: string): number {
    const today = new Date();
    const birth = new Date(birthdate);
    
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += today.getMonth();
    
    if (today.getDate() < birth.getDate()) {
      months--;
    }
    
    return months;
  },
};

// Number Utilities
export const numberUtils = {
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  },

  calculateBMI(weight: number, height: number): string {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  },
};

// String Utilities
export const stringUtils = {
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate(str: string, length: number = 50): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },
};

// Food & Nutrition Utilities
export const nutritionUtils = {
  calculateDailyValues(nutrients: Record<string, number>): Record<string, number> {
    const dailyValues: Record<string, number> = {
      protein: 50, // grams
      carbs: 275, // grams
      fat: 78, // grams
      fiber: 28, // grams
      sugar: 50, // grams
      sodium: 2300, // mg
      calcium: 1300, // mg
      iron: 18, // mg
      vitaminA: 900, // mcg
      vitaminC: 90, // mg
    };

    const percentages: Record<string, number> = {};
    
    Object.keys(nutrients).forEach(nutrient => {
      if (dailyValues[nutrient]) {
        percentages[nutrient] = Math.round((nutrients[nutrient] / dailyValues[nutrient]) * 100);
      }
    });

    return percentages;
  },

  getFoodCategory(food: string): string {
    const categories: Record<string, string[]> = {
      fruits: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'pear'],
      vegetables: ['carrot', 'broccoli', 'spinach', 'tomato', 'cucumber', 'potato'],
      proteins: ['chicken', 'fish', 'beef', 'eggs', 'beans', 'nuts'],
      dairy: ['milk', 'cheese', 'yogurt', 'butter'],
      grains: ['rice', 'bread', 'pasta', 'oats', 'quinoa'],
    };

    for (const [category, foods] of Object.entries(categories)) {
      if (foods.some(f => food.toLowerCase().includes(f))) {
        return category;
      }
    }

    return 'other';
  },
};

// Gamification Utilities
export const gamificationUtils = {
  calculateLevel(xp: number): number {
    const xpPerLevel = 1000;
    return Math.floor(xp / xpPerLevel) + 1;
  },

  calculateProgress(xp: number): number {
    const xpPerLevel = 1000;
    const currentLevelXP = xp % xpPerLevel;
    return (currentLevelXP / xpPerLevel) * 100;
  },

  getBadgeForAchievement(achievement: string): string {
    const badges: Record<string, string> = {
      firstFood: '🥇',
      tenFoods: '🌟',
      varietyEater: '🌈',
      consistentEater: '🎯',
      adventurous: '🚀',
    };

    return badges[achievement] || '🏆';
  },

  getStreakBonus(days: number): number {
    if (days >= 30) return 100;
    if (days >= 14) return 50;
    if (days >= 7) return 25;
    if (days >= 3) return 10;
    return 0;
  },
};

// API Utilities (Mock for now)
export const api = {
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: UserData }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'test@platefull.com' && password === 'Test123!') {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: email,
        },
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async register(userData: any): Promise<{ success: boolean; token: string; user: any }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: Date.now().toString(),
        ...userData,
      },
    };
  },

  async saveChildProfile(profileData: any): Promise<{ success: boolean; profile: any }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      profile: {
        id: Date.now().toString(),
        ...profileData,
      },
    };
  },

  async saveMealData(mealData: any): Promise<{ success: boolean; meal: any }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      meal: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...mealData,
      },
    };
  },
};

// Export all utilities
export default {
  storage,
  validators,
  dateUtils,
  numberUtils,
  stringUtils,
  nutritionUtils,
  gamificationUtils,
  api,
}; 