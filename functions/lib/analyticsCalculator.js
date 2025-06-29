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
exports.analyticsCalculator = void 0;
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
exports.analyticsCalculator = {
    // Calculate daily nutrition for all children (called by scheduled function)
    calculateDailyNutrition: async () => {
        try {
            const children = await db.collection('children').get();
            for (const child of children.docs) {
                await exports.analyticsCalculator.calculateChildDailyNutrition(child.id);
            }
            console.log('Daily nutrition calculation completed for all children');
        }
        catch (error) {
            console.error('Error in daily nutrition calculation:', error);
            throw error;
        }
    },
    // Calculate daily nutrition for a specific child
    calculateChildDailyNutrition: async (childId, date) => {
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
            const foodGroupConsumption = {};
            const mealPatterns = {
                mealsCompleted: 0,
                mealsSkipped: 0,
                totalMealDuration: 0,
                mealTypes: {}
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
                }
                else if (mealData.status === 'skipped') {
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
                    if (!foodItemDetails.exists)
                        continue;
                    const foodDetails = foodItemDetails.data();
                    if (!foodDetails)
                        continue;
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
            const ageGroup = (childData === null || childData === void 0 ? void 0 : childData.ageGroup) || 'toddler';
            const standardsQuery = await db.collection('nutritionStandards')
                .where('ageGroup', '==', ageGroup)
                .get();
            let nutritionStandards = null;
            if (!standardsQuery.empty) {
                nutritionStandards = standardsQuery.docs[0].data();
            }
            // Generate recommendations
            const recommendations = await exports.analyticsCalculator.generateRecommendations(foodGroupConsumption, nutritionStandards, childId);
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
                mealPatterns: Object.assign(Object.assign({}, mealPatterns), { averageMealDuration: mealPatterns.mealsCompleted > 0
                        ? Math.round(mealPatterns.totalMealDuration / mealPatterns.mealsCompleted)
                        : 0 }),
                recommendations,
                riskAlerts: [],
                calculatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            // Save analytics
            await db.collection('nutritionAnalytics').add(analyticsData);
            console.log(`Analytics calculated for child ${childId} on ${targetDate}`);
        }
        catch (error) {
            console.error(`Error calculating analytics for child ${childId}:`, error);
            throw error;
        }
    },
    // Generate nutrition recommendations
    generateRecommendations: async (foodGroupConsumption, standards, childId) => {
        var _a, _b;
        const recommendations = [];
        // Get food groups for analysis
        const foodGroupsQuery = await db.collection('foodGroups').get();
        const foodGroups = foodGroupsQuery.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        for (const group of foodGroups) {
            const consumed = foodGroupConsumption[group.id] || 0;
            const recommended = ((_b = (_a = standards === null || standards === void 0 ? void 0 : standards.dailyRequirements) === null || _a === void 0 ? void 0 : _a.foodGroups) === null || _b === void 0 ? void 0 : _b[group.id]) || 0;
            if (consumed < recommended * 0.8) {
                // Below 80% of recommended
                recommendations.push({
                    type: `increase_${group.name.toLowerCase()}`,
                    priority: 'medium',
                    suggestion: `Add more ${group.displayName} to tomorrow's meals`,
                    foodSuggestions: await exports.analyticsCalculator.getFoodSuggestions(group.id, childId)
                });
            }
            else if (consumed > recommended * 1.2) {
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
    getFoodSuggestions: async (foodGroupId, childId) => {
        const foodItemsQuery = await db.collection('foodItems')
            .where('foodGroupId', '==', foodGroupId)
            .where('isActive', '==', true)
            .limit(5)
            .get();
        return foodItemsQuery.docs.map(doc => doc.data().name);
    },
    // Generate nutrition report
    generateNutritionReport: async (data) => {
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
                    mostCommonRecommendations: exports.analyticsCalculator.getMostCommonRecommendations(analytics)
                },
                generatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            return report;
        }
        catch (error) {
            console.error('Error generating nutrition report:', error);
            throw error;
        }
    },
    // Get most common recommendations
    getMostCommonRecommendations: (analytics) => {
        const recommendationCounts = {};
        analytics.forEach(day => {
            var _a;
            (_a = day.recommendations) === null || _a === void 0 ? void 0 : _a.forEach((rec) => {
                recommendationCounts[rec.type] = (recommendationCounts[rec.type] || 0) + 1;
            });
        });
        return Object.entries(recommendationCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([type, count]) => ({ type, count }));
    }
};
//# sourceMappingURL=analyticsCalculator.js.map