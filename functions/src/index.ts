import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Firebase Admin
admin.initializeApp();

// Import function modules
import { analyticsCalculator } from './analyticsCalculator';
import { authentication } from './authentication';
import { foodDatabase } from './foodDatabase';
import { imageRecognition } from './imageRecognition';
import { iotIntegration } from './iotIntegration';
import { learningContent } from './learningContent';
import { mlProcessor } from './mlProcessor';
import { notifications } from './notifications';
import { paymentProcessing } from './paymentProcessing';
import { plateDataProcessor } from './plateDataProcessor';
import { userManagement } from './userManagement';

// Export all functions
export const processPlateReading = plateDataProcessor.processPlateReading;
export const analyzeWeightChange = plateDataProcessor.analyzeWeightChange;
export const updateFoodConsumption = plateDataProcessor.updateFoodConsumption;
export const checkMealCompletion = plateDataProcessor.checkMealCompletion;

export const processUploadedImage = imageRecognition.processUploadedImage;
export const analyzeFood = imageRecognition.analyzeFood;
export const matchFoodsToDatabase = imageRecognition.matchFoodsToDatabase;

export const calculateDailyNutrition = analyticsCalculator.calculateDailyNutrition;
export const calculateChildDailyNutrition = analyticsCalculator.calculateChildDailyNutrition;
export const generateNutritionReport = analyticsCalculator.generateNutritionReport;

export const updateAcceptanceModel = mlProcessor.updateAcceptanceModel;
export const updateMLModel = mlProcessor.updateMLModel;
export const recalculatePredictions = mlProcessor.recalculatePredictions;

export const handlePlateDeviceData = iotIntegration.handlePlateDeviceData;
export const validateDevice = iotIntegration.validateDevice;
export const processDeviceReadings = iotIntegration.processDeviceReadings;

export const sendMealReminders = notifications.sendMealReminders;
export const sendAchievementNotifications = notifications.sendAchievementNotifications;
export const sendNutritionAlerts = notifications.sendNutritionAlerts;

export const createUserProfile = userManagement.createUserProfile;
export const createChildProfile = userManagement.createChildProfile;
export const updateUserPreferences = userManagement.updateUserPreferences;

export const seedFoodDatabase = foodDatabase.seedFoodDatabase;
export const updateFoodItem = foodDatabase.updateFoodItem;
export const getFoodRecommendations = foodDatabase.getFoodRecommendations;

export const processVideoUpload = learningContent.processVideoUpload;
export const generateVideoThumbnail = learningContent.generateVideoThumbnail;
export const updateWatchHistory = learningContent.updateWatchHistory;

export const createSubscription = paymentProcessing.createSubscription;
export const handlePaymentWebhook = paymentProcessing.handlePaymentWebhook;
export const cancelSubscription = paymentProcessing.cancelSubscription;

export const registerUser = authentication.registerUser;
export const verifyOTP = authentication.verifyOTP;
export const signInUser = authentication.signInUser;
export const resendOTP = authentication.resendOTP;
export const resetPassword = authentication.resetPassword;

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