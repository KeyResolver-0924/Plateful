"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledNotifications = exports.scheduledAnalytics = exports.api = exports.resetPassword = exports.resendOTP = exports.signInUser = exports.verifyOTP = exports.registerUser = exports.cancelSubscription = exports.handlePaymentWebhook = exports.createSubscription = exports.updateWatchHistory = exports.generateVideoThumbnail = exports.processVideoUpload = exports.getFoodRecommendations = exports.updateFoodItem = exports.seedFoodDatabase = exports.updateUserPreferences = exports.createChildProfile = exports.createUserProfile = exports.sendNutritionAlerts = exports.sendAchievementNotifications = exports.sendMealReminders = exports.processDeviceReadings = exports.validateDevice = exports.handlePlateDeviceData = exports.recalculatePredictions = exports.updateMLModel = exports.updateAcceptanceModel = exports.generateNutritionReport = exports.calculateChildDailyNutrition = exports.calculateDailyNutrition = exports.matchFoodsToDatabase = exports.analyzeFood = exports.processUploadedImage = exports.checkMealCompletion = exports.updateFoodConsumption = exports.analyzeWeightChange = exports.processPlateReading = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
// Initialize Firebase Admin
admin.initializeApp();
// Import function modules
const analyticsCalculator_1 = require("./analyticsCalculator");
const authentication_1 = require("./authentication");
const foodDatabase_1 = require("./foodDatabase");
const imageRecognition_1 = require("./imageRecognition");
const iotIntegration_1 = require("./iotIntegration");
const learningContent_1 = require("./learningContent");
const mlProcessor_1 = require("./mlProcessor");
const notifications_1 = require("./notifications");
const paymentProcessing_1 = require("./paymentProcessing");
const plateDataProcessor_1 = require("./plateDataProcessor");
const userManagement_1 = require("./userManagement");
// Export all functions
exports.processPlateReading = plateDataProcessor_1.plateDataProcessor.processPlateReading;
exports.analyzeWeightChange = plateDataProcessor_1.plateDataProcessor.analyzeWeightChange;
exports.updateFoodConsumption = plateDataProcessor_1.plateDataProcessor.updateFoodConsumption;
exports.checkMealCompletion = plateDataProcessor_1.plateDataProcessor.checkMealCompletion;
exports.processUploadedImage = imageRecognition_1.imageRecognition.processUploadedImage;
exports.analyzeFood = imageRecognition_1.imageRecognition.analyzeFood;
exports.matchFoodsToDatabase = imageRecognition_1.imageRecognition.matchFoodsToDatabase;
exports.calculateDailyNutrition = analyticsCalculator_1.analyticsCalculator.calculateDailyNutrition;
exports.calculateChildDailyNutrition = analyticsCalculator_1.analyticsCalculator.calculateChildDailyNutrition;
exports.generateNutritionReport = analyticsCalculator_1.analyticsCalculator.generateNutritionReport;
exports.updateAcceptanceModel = mlProcessor_1.mlProcessor.updateAcceptanceModel;
exports.updateMLModel = mlProcessor_1.mlProcessor.updateMLModel;
exports.recalculatePredictions = mlProcessor_1.mlProcessor.recalculatePredictions;
exports.handlePlateDeviceData = iotIntegration_1.iotIntegration.handlePlateDeviceData;
exports.validateDevice = iotIntegration_1.iotIntegration.validateDevice;
exports.processDeviceReadings = iotIntegration_1.iotIntegration.processDeviceReadings;
exports.sendMealReminders = notifications_1.notifications.sendMealReminders;
exports.sendAchievementNotifications = notifications_1.notifications.sendAchievementNotifications;
exports.sendNutritionAlerts = notifications_1.notifications.sendNutritionAlerts;
exports.createUserProfile = userManagement_1.userManagement.createUserProfile;
exports.createChildProfile = userManagement_1.userManagement.createChildProfile;
exports.updateUserPreferences = userManagement_1.userManagement.updateUserPreferences;
exports.seedFoodDatabase = foodDatabase_1.foodDatabase.seedFoodDatabase;
exports.updateFoodItem = foodDatabase_1.foodDatabase.updateFoodItem;
exports.getFoodRecommendations = foodDatabase_1.foodDatabase.getFoodRecommendations;
exports.processVideoUpload = learningContent_1.learningContent.processVideoUpload;
exports.generateVideoThumbnail = learningContent_1.learningContent.generateVideoThumbnail;
exports.updateWatchHistory = learningContent_1.learningContent.updateWatchHistory;
exports.createSubscription = paymentProcessing_1.paymentProcessing.createSubscription;
exports.handlePaymentWebhook = paymentProcessing_1.paymentProcessing.handlePaymentWebhook;
exports.cancelSubscription = paymentProcessing_1.paymentProcessing.cancelSubscription;
exports.registerUser = authentication_1.authentication.registerUser;
exports.verifyOTP = authentication_1.authentication.verifyOTP;
exports.signInUser = authentication_1.authentication.signInUser;
exports.resendOTP = authentication_1.authentication.resendOTP;
exports.resetPassword = authentication_1.authentication.resetPassword;
// HTTP Functions
exports.api = functions.https.onRequest(async (req, res) => {
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
                const recommendations = await foodDatabase_1.foodDatabase.getFoodRecommendations(data);
                res.json({ success: true, data: recommendations });
                break;
            case 'updateUserPreferences':
                await userManagement_1.userManagement.updateUserPreferences(data);
                res.json({ success: true });
                break;
            case 'generateNutritionReport':
                const report = await analyticsCalculator_1.analyticsCalculator.generateNutritionReport(data);
                res.json({ success: true, data: report });
                break;
            default:
                res.status(400).json({ error: 'Invalid action' });
        }
    }
    catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Scheduled Functions
exports.scheduledAnalytics = functions.pubsub
    .schedule('0 23 * * *') // Daily at 11 PM
    .onRun(async (context) => {
    try {
        await analyticsCalculator_1.analyticsCalculator.calculateDailyNutrition();
        console.log('Daily analytics calculation completed');
    }
    catch (error) {
        console.error('Scheduled analytics error:', error);
    }
});
exports.scheduledNotifications = functions.pubsub
    .schedule('0 7,12,17 * * *') // Breakfast, lunch, dinner times
    .onRun(async (context) => {
    try {
        const hour = new Date().getHours();
        const mealType = getMealTypeByHour(hour);
        await notifications_1.notifications.sendMealReminders(mealType);
        console.log(`Meal reminders sent for ${mealType}`);
    }
    catch (error) {
        console.error('Scheduled notifications error:', error);
    }
});
// Helper function
function getMealTypeByHour(hour) {
    if (hour >= 6 && hour < 11)
        return 'breakfast';
    if (hour >= 11 && hour < 16)
        return 'lunch';
    if (hour >= 16 && hour < 21)
        return 'dinner';
    return 'snack';
}
//# sourceMappingURL=index.js.map