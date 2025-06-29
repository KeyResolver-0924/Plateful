import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const plateDataProcessor = {
  // Process new plate readings
  processPlateReading: functions.firestore
    .document('meals/{mealId}/plateReadings/{readingId}')
    .onCreate(async (snap, context) => {
      const reading = snap.data();
      const mealId = context.params.mealId;
      
      try {
        // Process weight changes
        await plateDataProcessor.analyzeWeightChange(reading, mealId);
        
        // Update meal food items
        await plateDataProcessor.updateFoodConsumption(reading, mealId);
        
        // Check for meal completion
        await plateDataProcessor.checkMealCompletion(mealId);
        
        // Send real-time updates
        await plateDataProcessor.sendRealtimeUpdates(mealId, reading);
        
        console.log(`Processed plate reading for meal ${mealId}`);
      } catch (error) {
        console.error('Error processing plate reading:', error);
        throw error;
      }
    }),

  // Analyze weight changes from plate readings
  analyzeWeightChange: async (reading: any, mealId: string) => {
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
      await db.collection('meals').doc(mealId).collection('plateReadings').add({
        ...reading,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  },

  // Update food consumption based on plate readings
  updateFoodConsumption: async (reading: any, mealId: string) => {
    const { plateSection, weight, change } = reading;
    
    // Get meal food items for this section
    const foodItemsQuery = await db.collection('mealFoodItems')
      .where('mealId', '==', mealId)
      .where('plateSection', '==', plateSection)
      .get();
    
    if (foodItemsQuery.empty) return;
    
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
  checkMealCompletion: async (mealId: string) => {
    const mealDoc = await db.collection('meals').doc(mealId).get();
    if (!mealDoc.exists) return;
    
    const mealData = mealDoc.data();
    if (!mealData) return;
    
    // Get all food items for this meal
    const foodItemsQuery = await db.collection('mealFoodItems')
      .where('mealId', '==', mealId)
      .get();
    
    if (foodItemsQuery.empty) return;
    
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
        await plateDataProcessor.triggerAnalyticsCalculation(mealData.childId);
      }
    }
  },

  // Send real-time updates to connected clients
  sendRealtimeUpdates: async (mealId: string, reading: any) => {
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
  triggerAnalyticsCalculation: async (childId: string) => {
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
  getPlateCalibration: async (deviceId: string) => {
    const deviceDoc = await db.collection('plateDevices').doc(deviceId).get();
    if (!deviceDoc.exists) {
      throw new Error(`Device ${deviceId} not found`);
    }
    
    return deviceDoc.data()?.calibrationData || {};
  },

  // Update plate calibration
  updatePlateCalibration: async (deviceId: string, calibrationData: any) => {
    await db.collection('plateDevices').doc(deviceId).update({
      calibrationData,
      lastCalibration: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}; 