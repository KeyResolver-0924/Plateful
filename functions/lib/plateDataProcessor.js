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
exports.plateDataProcessor = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const db = admin.firestore();
exports.plateDataProcessor = {
    // Process new plate readings
    processPlateReading: functions.firestore
        .document('meals/{mealId}/plateReadings/{readingId}')
        .onCreate(async (snap, context) => {
        const reading = snap.data();
        const mealId = context.params.mealId;
        try {
            // Process weight changes
            await exports.plateDataProcessor.analyzeWeightChange(reading, mealId);
            // Update meal food items
            await exports.plateDataProcessor.updateFoodConsumption(reading, mealId);
            // Check for meal completion
            await exports.plateDataProcessor.checkMealCompletion(mealId);
            // Send real-time updates
            await exports.plateDataProcessor.sendRealtimeUpdates(mealId, reading);
            console.log(`Processed plate reading for meal ${mealId}`);
        }
        catch (error) {
            console.error('Error processing plate reading:', error);
            throw error;
        }
    }),
    // Analyze weight changes from plate readings
    analyzeWeightChange: async (reading, mealId) => {
        const { plateSection, weight, change, timestamp } = reading;
        // Get the meal document
        const mealDoc = await db.collection('meals').doc(mealId).get();
        if (!mealDoc.exists) {
            throw new Error(`Meal ${mealId} not found`);
        }
        // Update the meal's plate data
        await db.collection('meals').doc(mealId).update({
            [`plateData.sections.${plateSection}.currentWeight`]: weight,
            [`plateData.sections.${plateSection}.lastUpdate`]: timestamp,
            [`plateData.sections.${plateSection}.totalChange`]: admin.firestore.FieldValue.increment(change || 0)
        });
        // Log significant changes
        if (Math.abs(change || 0) > 0.5) { // More than 0.5 oz change
            await db.collection('meals').doc(mealId).collection('plateReadings').add(Object.assign(Object.assign({}, reading), { processedAt: admin.firestore.FieldValue.serverTimestamp() }));
        }
    },
    // Update food consumption based on plate readings
    updateFoodConsumption: async (reading, mealId) => {
        const { plateSection, weight, change } = reading;
        // Get meal food items for this section
        const foodItemsQuery = await db.collection('mealFoodItems')
            .where('mealId', '==', mealId)
            .where('plateSection', '==', plateSection)
            .get();
        if (foodItemsQuery.empty)
            return;
        const foodItem = foodItemsQuery.docs[0];
        const foodData = foodItem.data();
        // Calculate consumption
        const consumedWeight = Math.abs(change || 0);
        const consumedPercentage = (consumedWeight / foodData.portionData.initialWeight) * 100;
        // Update food item consumption
        await foodItem.ref.update({
            'portionData.consumedWeight': admin.firestore.FieldValue.increment(consumedWeight),
            'portionData.consumedPercentage': Math.min(100, foodData.portionData.consumedPercentage + consumedPercentage),
            'portionData.finalWeight': weight,
            'engagementData.lastInteraction': admin.firestore.FieldValue.serverTimestamp()
        });
    },
    // Check if meal is completed
    checkMealCompletion: async (mealId) => {
        const mealDoc = await db.collection('meals').doc(mealId).get();
        if (!mealDoc.exists)
            return;
        const mealData = mealDoc.data();
        if (!mealData)
            return;
        // Get all food items for this meal
        const foodItemsQuery = await db.collection('mealFoodItems')
            .where('mealId', '==', mealId)
            .get();
        if (foodItemsQuery.empty)
            return;
        // Check if all food items are consumed
        const totalItems = foodItemsQuery.size;
        const consumedItems = foodItemsQuery.docs.filter(doc => {
            const data = doc.data();
            return data.portionData.consumedPercentage >= 80; // 80% consumed threshold
        }).length;
        // If 80% of items are consumed, mark meal as completed
        if (consumedItems >= totalItems * 0.8) {
            await db.collection('meals').doc(mealId).update({
                status: 'completed',
                actualEndTime: admin.firestore.FieldValue.serverTimestamp(),
                completionPercentage: (consumedItems / totalItems) * 100
            });
            // Trigger analytics calculation
            if (mealData.childId) {
                await exports.plateDataProcessor.triggerAnalyticsCalculation(mealData.childId);
            }
        }
    },
    // Send real-time updates to connected clients
    sendRealtimeUpdates: async (mealId, reading) => {
        // This would integrate with WebSocket or Firebase Realtime Database
        // for real-time updates to the mobile app
        console.log(`Sending real-time update for meal ${mealId}`);
        // For now, we'll just log the update
        // In production, this would send to connected WebSocket clients
        const updateData = {
            mealId,
            reading,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
        // Store in real-time updates collection for WebSocket clients
        await db.collection('realtimeUpdates').add(updateData);
    },
    // Trigger analytics calculation for a child
    triggerAnalyticsCalculation: async (childId) => {
        // This would trigger the analytics calculation function
        console.log(`Triggering analytics calculation for child ${childId}`);
        // For now, we'll just log it
        // In production, this would call the analytics function
        await db.collection('analyticsTriggers').add({
            childId,
            triggerType: 'meal_completion',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            processed: false
        });
    },
    // Get plate calibration data
    getPlateCalibration: async (deviceId) => {
        var _a;
        const deviceDoc = await db.collection('plateDevices').doc(deviceId).get();
        if (!deviceDoc.exists) {
            throw new Error(`Device ${deviceId} not found`);
        }
        return ((_a = deviceDoc.data()) === null || _a === void 0 ? void 0 : _a.calibrationData) || {};
    },
    // Update plate calibration
    updatePlateCalibration: async (deviceId, calibrationData) => {
        await db.collection('plateDevices').doc(deviceId).update({
            calibrationData,
            lastCalibration: admin.firestore.FieldValue.serverTimestamp()
        });
    }
};
//# sourceMappingURL=plateDataProcessor.js.map