import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const analyticsCalculator = {
  // Calculate daily nutrition for all children
  calculateDailyNutrition: functions.pubsub
    .schedule('0 23 * * *') // Daily at 11 PM
    .onRun(async (context) => {
      try {
        const children = await db.collection('children').get();
        
        for (const child of children.docs) {
          await analyticsCalculator.calculateChildDailyNutrition(child.id);
        }
        
        console.log('Daily nutrition calculation completed for all children');
      } catch (error) {
        console.error('Error in daily nutrition calculation:', error);
        throw error;
      }
    }),

  // Calculate daily nutrition for a specific child
  calculateChildDailyNutrition: async (childId: string, date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    try {
      // Get all meals for the child on the target date
      const startOfDay = new Date(targetDate);
      const endOfDay = new Date(targetDate);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      const mealsQuery = await db.collection('meals')
        .where('childId', '==', childId)
        .where('scheduledTime', '>=', startOfDay)
        .where('scheduledTime', '<', endOfDay)
        .get();
      
      if (mealsQuery.empty) {
        console.log(`No meals found for child ${childId} on ${targetDate}`);
        return;
      }
      
      // Calculate nutrition totals
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalFiber = 0;
      let totalSugar = 0;
      let totalCalcium = 0;
      let totalIron = 0;
      let totalVitaminC = 0;
      let totalHydration = 0;
      
      const foodGroupConsumption: { [key: string]: number } = {};
      const mealPatterns = {
        mealsCompleted: 0,
        mealsSkipped: 0,
        totalMealDuration: 0,
        mealTypes: {} as { [key: string]: number }
      };
      
      // Process each meal
      for (const mealDoc of mealsQuery.docs) {
        const mealData = mealDoc.data();
        
        // Count meal types
        mealPatterns.mealTypes[mealData.mealType] = (mealPatterns.mealTypes[mealData.mealType] || 0) + 1;
        
        if (mealData.status === 'completed') {
          mealPatterns.mealsCompleted++;
          
          // Calculate meal duration
          if (mealData.actualStartTime && mealData.actualEndTime) {
            const duration = (mealData.actualEndTime.toDate() - mealData.actualStartTime.toDate()) / (1000 * 60); // minutes
            mealPatterns.totalMealDuration += duration;
          }
        } else if (mealData.status === 'skipped') {
          mealPatterns.mealsSkipped++;
        }
        
        // Get food items for this meal
        const foodItemsQuery = await db.collection('mealFoodItems')
          .where('mealId', '==', mealDoc.id)
          .get();
        
        for (const foodItemDoc of foodItemsQuery.docs) {
          const foodItemData = foodItemDoc.data();
          
          // Get food item details
          const foodItemDetails = await db.collection('foodItems').doc(foodItemData.foodItemId).get();
          if (!foodItemDetails.exists) continue;
          
          const foodDetails = foodItemDetails.data();
          const consumedWeight = foodItemData.portionData.consumedWeight || 0;
          const consumedPercentage = foodItemData.portionData.consumedPercentage || 0;
          
          // Calculate nutrition based on consumed amount
          const nutritionMultiplier = consumedPercentage / 100;
          
          totalCalories += (foodDetails.nutritionData.caloriesPerOunce * consumedWeight) * nutritionMultiplier;
          totalProtein += (foodDetails.nutritionData.proteinPerOunce * consumedWeight) * nutritionMultiplier;
          totalCarbs += (foodDetails.nutritionData.carbsPerOunce * consumedWeight) * nutritionMultiplier;
          totalFat += (foodDetails.nutritionData.fatPerOunce * consumedWeight) * nutritionMultiplier;
          totalFiber += (foodDetails.nutritionData.fiberPerOunce * consumedWeight) * nutritionMultiplier;
          totalSugar += (foodDetails.nutritionData.sugarPerOunce * consumedWeight) * nutritionMultiplier;
          
          // Track food group consumption
          const foodGroupId = foodDetails.foodGroupId;
          foodGroupConsumption[foodGroupId] = (foodGroupConsumption[foodGroupId] || 0) + consumedWeight;
        }
      }
      
      // Calculate macro percentages
      const totalMacros = totalProtein + totalCarbs + totalFat;
      const macroBreakdown = {
        protein: totalMacros > 0 ? (totalProtein / totalMacros) * 100 : 0,
        carbohydrates: totalMacros > 0 ? (totalCarbs / totalMacros) * 100 : 0,
        fat: totalMacros > 0 ? (totalFat / totalMacros) * 100 : 0
      };
      
      // Get child's nutrition standards
      const childDoc = await db.collection('children').doc(childId).get();
      const childData = childDoc.data();
      const ageGroup = childData?.ageGroup || 'toddler';
      
      const standardsQuery = await db.collection('nutritionStandards')
        .where('ageGroup', '==', ageGroup)
        .get();
      
      let nutritionStandards = null;
      if (!standardsQuery.empty) {
        nutritionStandards = standardsQuery.docs[0].data();
      }
      
      // Generate recommendations
      const recommendations = await analyticsCalculator.generateRecommendations(
        foodGroupConsumption,
        nutritionStandards,
        childId
      );
      
      // Create analytics document
      const analyticsData = {
        childId,
        period: 'daily',
        date: targetDate,
        nutritionSummary: {
          totalCalories: Math.round(totalCalories),
          macroBreakdown,
          microNutrients: {
            calcium: Math.round(totalCalcium),
            iron: Math.round(totalIron * 10) / 10,
            vitaminC: Math.round(totalVitaminC)
          },
          hydration: Math.round(totalHydration)
        },
        foodGroupAnalysis: foodGroupConsumption,
        mealPatterns: {
          ...mealPatterns,
          averageMealDuration: mealPatterns.mealsCompleted > 0 
            ? Math.round(mealPatterns.totalMealDuration / mealPatterns.mealsCompleted)
            : 0
        },
        recommendations,
        riskAlerts: [],
        calculatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // Save analytics
      await db.collection('nutritionAnalytics').add(analyticsData);
      
      console.log(`Analytics calculated for child ${childId} on ${targetDate}`);
      
    } catch (error) {
      console.error(`Error calculating analytics for child ${childId}:`, error);
      throw error;
    }
  },

  // Generate nutrition recommendations
  generateRecommendations: async (foodGroupConsumption: any, standards: any, childId: string) => {
    const recommendations = [];
    
    // Get food groups for analysis
    const foodGroupsQuery = await db.collection('foodGroups').get();
    const foodGroups = foodGroupsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    for (const group of foodGroups) {
      const consumed = foodGroupConsumption[group.id] || 0;
      const recommended = standards?.dailyRequirements?.foodGroups?.[group.id] || 0;
      
      if (consumed < recommended * 0.8) {
        // Below 80% of recommended
        recommendations.push({
          type: `increase_${group.name.toLowerCase()}`,
          priority: 'medium',
          suggestion: `Add more ${group.displayName} to tomorrow's meals`,
          foodSuggestions: await analyticsCalculator.getFoodSuggestions(group.id, childId)
        });
      } else if (consumed > recommended * 1.2) {
        // Above 120% of recommended
        recommendations.push({
          type: `moderate_${group.name.toLowerCase()}`,
          priority: 'low',
          suggestion: `Consider reducing ${group.displayName} portions`,
          foodSuggestions: []
        });
      }
    }
    
    return recommendations;
  },

  // Get food suggestions for a food group
  getFoodSuggestions: async (foodGroupId: string, childId: string) => {
    const foodItemsQuery = await db.collection('foodItems')
      .where('foodGroupId', '==', foodGroupId)
      .where('isActive', '==', true)
      .limit(5)
      .get();
    
    return foodItemsQuery.docs.map(doc => doc.data().name);
  },

  // Generate nutrition report
  generateNutritionReport: async (data: { childId: string; startDate: string; endDate: string }) => {
    const { childId, startDate, endDate } = data;
    
    try {
      // Get analytics for the date range
      const analyticsQuery = await db.collection('nutritionAnalytics')
        .where('childId', '==', childId)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .orderBy('date', 'asc')
        .get();
      
      if (analyticsQuery.empty) {
        throw new Error('No analytics data found for the specified date range');
      }
      
      const analytics = analyticsQuery.docs.map(doc => doc.data());
      
      // Calculate averages
      const totalDays = analytics.length;
      const averages = {
        calories: analytics.reduce((sum, a) => sum + a.nutritionSummary.totalCalories, 0) / totalDays,
        protein: analytics.reduce((sum, a) => sum + a.nutritionSummary.macroBreakdown.protein, 0) / totalDays,
        carbs: analytics.reduce((sum, a) => sum + a.nutritionSummary.macroBreakdown.carbohydrates, 0) / totalDays,
        fat: analytics.reduce((sum, a) => sum + a.nutritionSummary.macroBreakdown.fat, 0) / totalDays
      };
      
      // Generate report
      const report = {
        childId,
        startDate,
        endDate,
        totalDays,
        averages,
        dailyData: analytics,
        summary: {
          totalMeals: analytics.reduce((sum, a) => sum + a.mealPatterns.mealsCompleted, 0),
          averageMealDuration: analytics.reduce((sum, a) => sum + a.mealPatterns.averageMealDuration, 0) / totalDays,
          mostCommonRecommendations: analyticsCalculator.getMostCommonRecommendations(analytics)
        },
        generatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      return report;
      
    } catch (error) {
      console.error('Error generating nutrition report:', error);
      throw error;
    }
  },

  // Get most common recommendations
  getMostCommonRecommendations: (analytics: any[]) => {
    const recommendationCounts: { [key: string]: number } = {};
    
    analytics.forEach(day => {
      day.recommendations?.forEach((rec: any) => {
        recommendationCounts[rec.type] = (recommendationCounts[rec.type] || 0) + 1;
      });
    });
    
    return Object.entries(recommendationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));
  }
}; 