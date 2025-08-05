import apiClient from './apiClient';

export interface Food {
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
    vitamins?: Record<string, number>;
    minerals?: Record<string, number>;
  };
  servingSize: {
    amount: number;
    unit: string;
  };
  image?: string;
  isRecommended?: boolean;
  ageRange?: string[];
  dietaryRestrictions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodSearchParams {
  query?: string;
  category?: string;
  ageRange?: string;
  dietaryRestrictions?: string[];
  limit?: number;
  page?: number;
}

export interface FoodListResponse {
  foods: Food[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class FoodService {
  private static instance: FoodService;

  static getInstance(): FoodService {
    if (!FoodService.instance) {
      FoodService.instance = new FoodService();
    }
    return FoodService.instance;
  }

  // Get all foods with optional filtering
  async getFoods(params?: FoodSearchParams): Promise<{ success: boolean; data?: FoodListResponse; message?: string }> {
    try {
      const response = await apiClient.get<FoodListResponse>('/api/foods', params);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('FoodService: Get foods error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch foods'
      };
    }
  }

  // Get food by ID
  async getFoodById(id: string): Promise<{ success: boolean; data?: Food; message?: string }> {
    try {
      const response = await apiClient.get<Food>(`/api/foods/${id}`);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('FoodService: Get food by ID error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch food details'
      };
    }
  }

  // Search foods
  async searchFoods(query: string, params?: Omit<FoodSearchParams, 'query'>): Promise<{ success: boolean; data?: FoodListResponse; message?: string }> {
    try {
      const searchParams = { query, ...params };
      const response = await apiClient.get<FoodListResponse>('/api/foods/search', searchParams);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('FoodService: Search foods error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to search foods'
      };
    }
  }

  // Get recommended foods for user
  async getRecommendedFoods(): Promise<{ success: boolean; data?: Food[]; message?: string }> {
    try {
      const response = await apiClient.get<Food[]>('/api/foods/recommended');
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('FoodService: Get recommended foods error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch recommended foods'
      };
    }
  }

  // Get foods by category
  async getFoodsByCategory(category: string, params?: Omit<FoodSearchParams, 'category'>): Promise<{ success: boolean; data?: FoodListResponse; message?: string }> {
    try {
      const categoryParams = { category, ...params };
      const response = await apiClient.get<FoodListResponse>('/api/foods/category', categoryParams);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('FoodService: Get foods by category error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch foods by category'
      };
    }
  }

  // Get food categories
  async getFoodCategories(): Promise<{ success: boolean; data?: string[]; message?: string }> {
    try {
      const response = await apiClient.get<string[]>('/api/foods/categories');
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('FoodService: Get food categories error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch food categories'
      };
    }
  }
}

// Export singleton instance
const foodService = FoodService.getInstance();
export default foodService; 