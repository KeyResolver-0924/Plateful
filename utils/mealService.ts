import apiClient from './apiClient';
import { Food } from './foodService';

export interface MealItem {
  food: Food;
  quantity: number;
  unit: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: MealItem[];
  totalNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  image?: string;
  notes?: string;
  consumedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealRequest {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: Array<{
    foodId: string;
    quantity: number;
    unit: string;
  }>;
  notes?: string;
  image?: string;
}

export interface MealSearchParams {
  type?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface MealListResponse {
  meals: Meal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class MealService {
  private static instance: MealService;

  static getInstance(): MealService {
    if (!MealService.instance) {
      MealService.instance = new MealService();
    }
    return MealService.instance;
  }

  // Create a new meal
  async createMeal(mealData: CreateMealRequest): Promise<{ success: boolean; data?: Meal; message?: string }> {
    try {
      const response = await apiClient.post<Meal>('/api/meals', mealData);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Create meal error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to create meal'
      };
    }
  }

  // Get user's meals with optional filtering
  async getMeals(params?: MealSearchParams): Promise<{ success: boolean; data?: MealListResponse; message?: string }> {
    try {
      const response = await apiClient.get<MealListResponse>('/api/meals', params);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Get meals error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch meals'
      };
    }
  }

  // Get meal by ID
  async getMealById(id: string): Promise<{ success: boolean; data?: Meal; message?: string }> {
    try {
      const response = await apiClient.get<Meal>(`/api/meals/${id}`);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Get meal by ID error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch meal details'
      };
    }
  }

  // Update meal
  async updateMeal(id: string, mealData: Partial<CreateMealRequest>): Promise<{ success: boolean; data?: Meal; message?: string }> {
    try {
      const response = await apiClient.put<Meal>(`/api/meals/${id}`, mealData);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Update meal error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to update meal'
      };
    }
  }

  // Delete meal
  async deleteMeal(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete(`/api/meals/${id}`);
      return {
        success: response.success,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Delete meal error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to delete meal'
      };
    }
  }

  // Get meals for a specific date
  async getMealsByDate(date: string): Promise<{ success: boolean; data?: Meal[]; message?: string }> {
    try {
      const response = await apiClient.get<Meal[]>(`/api/meals/date/${date}`);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Get meals by date error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch meals for date'
      };
    }
  }

  // Get meals by type
  async getMealsByType(type: string, params?: Omit<MealSearchParams, 'type'>): Promise<{ success: boolean; data?: MealListResponse; message?: string }> {
    try {
      const typeParams = { type, ...params };
      const response = await apiClient.get<MealListResponse>('/api/meals/type', typeParams);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Get meals by type error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch meals by type'
      };
    }
  }

  // Get nutrition summary for a date range
  async getNutritionSummary(startDate: string, endDate: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.get(`/api/meals/nutrition-summary`, { startDate, endDate });
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Get nutrition summary error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch nutrition summary'
      };
    }
  }

  // Upload meal image
  async uploadMealImage(mealId: string, imageFile: any): Promise<{ success: boolean; data?: { imageUrl: string }; message?: string }> {
    try {
      const response = await apiClient.uploadFile<{ imageUrl: string }>(`/api/meals/${mealId}/image`, imageFile);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('MealService: Upload meal image error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to upload meal image'
      };
    }
  }
}

// Export singleton instance
const mealService = MealService.getInstance();
export default mealService; 