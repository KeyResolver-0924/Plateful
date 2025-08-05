// API Configuration
export const API_CONFIG = {
  // Development
  development: {
    BASE_URL: 'http://localhost:5000',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },
  // Production
  production: {
    BASE_URL: 'https://api.platefull.com',
    TIMEOUT: 15000,
    RETRY_ATTEMPTS: 2,
  },
  // Staging
  staging: {
    BASE_URL: 'https://staging-api.platefull.com',
    TIMEOUT: 12000,
    RETRY_ATTEMPTS: 3,
  }
};

// Get current environment
export const getCurrentEnvironment = () => {
  if (__DEV__) {
    return 'development';
  }
  // You can add logic here to detect staging/production
  return 'production';
};

// Get API config for current environment
export const getApiConfig = () => {
  const env = getCurrentEnvironment();
  return API_CONFIG[env] || API_CONFIG.development;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNUP: '/api/auth/signup',
    SIGNOUT: '/api/auth/signout',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESET_PASSWORD: '/api/auth/reset-password',
    REFRESH_TOKEN: '/api/auth/refresh-token',
  },

  // User endpoints
  USER: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    DELETE_ACCOUNT: '/api/users/account',
    UPLOAD_AVATAR: '/api/users/avatar',
  },

  // Food endpoints
  FOODS: {
    LIST: '/api/foods',
    DETAIL: (id: string) => `/api/foods/${id}`,
    SEARCH: '/api/foods/search',
    RECOMMENDED: '/api/foods/recommended',
    CATEGORIES: '/api/foods/categories',
    BY_CATEGORY: '/api/foods/category',
  },

  // Meal endpoints
  MEALS: {
    LIST: '/api/meals',
    CREATE: '/api/meals',
    DETAIL: (id: string) => `/api/meals/${id}`,
    UPDATE: (id: string) => `/api/meals/${id}`,
    DELETE: (id: string) => `/api/meals/${id}`,
    BY_DATE: (date: string) => `/api/meals/date/${date}`,
    BY_TYPE: '/api/meals/type',
    NUTRITION_SUMMARY: '/api/meals/nutrition-summary',
    UPLOAD_IMAGE: (id: string) => `/api/meals/${id}/image`,
  },

  // Progress endpoints
  PROGRESS: {
    GOALS: '/api/progress/goals',
    REPORTS: '/api/progress/reports',
    REPORT_BY_DATE: (date: string) => `/api/progress/reports/${date}`,
    ACHIEVEMENTS: '/api/progress/achievements',
    SUMMARY: '/api/progress/summary',
    STREAK: '/api/progress/streak',
    INSIGHTS: '/api/progress/insights',
    CHARTS: '/api/progress/charts',
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
    SETTINGS: '/api/notifications/settings',
  },

  // Health check
  HEALTH: '/health',
};

// API Response Status Codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// API Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
};

// API Request Headers
export const getApiHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// API Request Options
export const getApiRequestOptions = (method: string, data?: any, token?: string) => {
  const options: RequestInit = {
    method,
    headers: getApiHeaders(token),
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  return options;
}; 