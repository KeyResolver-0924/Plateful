import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Import function modules
import { plateDataProcessor } from './plateDataProcessor';
import { imageRecognition } from './imageRecognition';
import { analyticsCalculator } from './analyticsCalculator';
import { mlProcessor } from './mlProcessor';
import { iotIntegration } from './iotIntegration';
import { notifications } from './notifications';
import { userManagement } from './userManagement';
import { foodDatabase } from './foodDatabase';
import { learningContent } from './learningContent';
import { paymentProcessing } from './paymentProcessing';

// Export all functions
export {
  // Plate Data Processing
  processPlateReading: plateDataProcessor.processPlateReading,
  analyzeWeightChange: plateDataProcessor.analyzeWeightChange,
  updateFoodConsumption: plateDataProcessor.updateFoodConsumption,
  checkMealCompletion: plateDataProcessor.checkMealCompletion,
  
  // Image Recognition
  processUploadedImage: imageRecognition.processUploadedImage,
  analyzeFood: imageRecognition.analyzeFood,
  matchFoodsToDatabase: imageRecognition.matchFoodsToDatabase,
  
  // Analytics
  calculateDailyNutrition: analyticsCalculator.calculateDailyNutrition,
  calculateChildDailyNutrition: analyticsCalculator.calculateChildDailyNutrition,
  generateNutritionReport: analyticsCalculator.generateNutritionReport,
  
  // ML Processing
  updateAcceptanceModel: mlProcessor.updateAcceptanceModel,
  updateMLModel: mlProcessor.updateMLModel,
  recalculatePredictions: mlProcessor.recalculatePredictions,
  
  // IoT Integration
  handlePlateDeviceData: iotIntegration.handlePlateDeviceData,
  validateDevice: iotIntegration.validateDevice,
  processDeviceReadings: iotIntegration.processDeviceReadings,
  
  // Notifications
  sendMealReminders: notifications.sendMealReminders,
  sendAchievementNotifications: notifications.sendAchievementNotifications,
  sendNutritionAlerts: notifications.sendNutritionAlerts,
  
  // User Management
  createUserProfile: userManagement.createUserProfile,
  createChildProfile: userManagement.createChildProfile,
  updateUserPreferences: userManagement.updateUserPreferences,
  
  // Food Database
  seedFoodDatabase: foodDatabase.seedFoodDatabase,
  updateFoodItem: foodDatabase.updateFoodItem,
  getFoodRecommendations: foodDatabase.getFoodRecommendations,
  
  // Learning Content
  processVideoUpload: learningContent.processVideoUpload,
  generateVideoThumbnail: learningContent.generateVideoThumbnail,
  updateWatchHistory: learningContent.updateWatchHistory,
  
  // Payment Processing
  createSubscription: paymentProcessing.createSubscription,
  handlePaymentWebhook: paymentProcessing.handlePaymentWebhook,
  cancelSubscription: paymentProcessing.cancelSubscription
};

// HTTP Functions
export const api = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    const { action, data } = req.body;
    
    switch (action) {
      case 'getFoodRecommendations':
        const recommendations = await foodDatabase.getFoodRecommendations(data);
        res.json({ success: true, data: recommendations });
        break;
        
      case 'updateUserPreferences':
        await userManagement.updateUserPreferences(data);
        res.json({ success: true });
        break;
        
      case 'generateNutritionReport':
        const report = await analyticsCalculator.generateNutritionReport(data);
        res.json({ success: true, data: report });
        break;
        
      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scheduled Functions
export const scheduledAnalytics = functions.pubsub
  .schedule('0 23 * * *') // Daily at 11 PM
  .onRun(async (context) => {
    try {
      await analyticsCalculator.calculateDailyNutrition();
      console.log('Daily analytics calculation completed');
    } catch (error) {
      console.error('Scheduled analytics error:', error);
    }
  });

export const scheduledNotifications = functions.pubsub
  .schedule('0 7,12,17 * * *') // Breakfast, lunch, dinner times
  .onRun(async (context) => {
    try {
      const hour = new Date().getHours();
      const mealType = getMealTypeByHour(hour);
      await notifications.sendMealReminders(mealType);
      console.log(`Meal reminders sent for ${mealType}`);
    } catch (error) {
      console.error('Scheduled notifications error:', error);
    }
  });

// Helper function
function getMealTypeByHour(hour: number): string {
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 21) return 'dinner';
  return 'snack';
} 