import apiClient from './apiClient';

export interface NutritionGoal {
  id: string;
  userId: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressReport {
  id: string;
  userId: string;
  date: string;
  totalNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  goalNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  progress: {
    calories: number; // percentage
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  mealsCount: number;
  createdAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'streak' | 'goal' | 'milestone' | 'variety';
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  isUnlocked: boolean;
}

export interface ProgressSearchParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface ProgressListResponse {
  reports: ProgressReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ProgressService {
  private static instance: ProgressService;

  static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }

  // Get user's nutrition goals
  async getNutritionGoals(): Promise<{ success: boolean; data?: NutritionGoal[]; message?: string }> {
    try {
      const response = await apiClient.get<NutritionGoal[]>('/api/progress/goals');
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Get nutrition goals error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch nutrition goals'
      };
    }
  }

  // Create or update nutrition goals
  async setNutritionGoals(goals: Partial<NutritionGoal>): Promise<{ success: boolean; data?: NutritionGoal; message?: string }> {
    try {
      const response = await apiClient.post<NutritionGoal>('/api/progress/goals', goals);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Set nutrition goals error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to set nutrition goals'
      };
    }
  }

  // Get progress reports
  async getProgressReports(params?: ProgressSearchParams): Promise<{ success: boolean; data?: ProgressListResponse; message?: string }> {
    try {
      const response = await apiClient.get<ProgressListResponse>('/api/progress/reports', params);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Get progress reports error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch progress reports'
      };
    }
  }

  // Get progress report for a specific date
  async getProgressReportByDate(date: string): Promise<{ success: boolean; data?: ProgressReport; message?: string }> {
    try {
      const response = await apiClient.get<ProgressReport>(`/api/progress/reports/${date}`);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Get progress report by date error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch progress report'
      };
    }
  }

  // Get user achievements
  async getAchievements(): Promise<{ success: boolean; data?: Achievement[]; message?: string }> {
    try {
      const response = await apiClient.get<Achievement[]>('/api/progress/achievements');
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Get achievements error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch achievements'
      };
    }
  }

  // Get progress summary for a date range
  async getProgressSummary(startDate: string, endDate: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.get('/api/progress/summary', { startDate, endDate });
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Get progress summary error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch progress summary'
      };
    }
  }

  // Get streak information
  async getStreakInfo(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.get('/api/progress/streak');
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Get streak info error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch streak information'
      };
    }
  }

  // Get nutrition insights
  async getNutritionInsights(dateRange?: { startDate: string; endDate: string }): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const params = dateRange ? { startDate: dateRange.startDate, endDate: dateRange.endDate } : {};
      const response = await apiClient.get('/api/progress/insights', params);
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Get nutrition insights error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch nutrition insights'
      };
    }
  }

  // Get weekly/monthly progress charts
  async getProgressCharts(period: 'week' | 'month', startDate: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.get('/api/progress/charts', { period, startDate });
      return {
        success: response.success,
        data: response.data,
        message: response.error
      };
    } catch (error: any) {
      console.error('ProgressService: Get progress charts error:', error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch progress charts'
      };
    }
  }
}

// Export singleton instance
const progressService = ProgressService.getInstance();
export default progressService; 