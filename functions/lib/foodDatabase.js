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
exports.foodDatabase = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const db = admin.firestore();
exports.foodDatabase = {
    // Seed food database with initial data
    seedFoodDatabase: functions.https.onRequest(async (req, res) => {
        try {
            const foodGroups = [
                {
                    name: 'Protein',
                    displayName: 'Protein',
                    description: 'Foods rich in protein for muscle development',
                    color: '#FF6B6B',
                    icon: 'protein-icon.svg',
                    sortOrder: 1,
                    isActive: true,
                    macroNutrients: {
                        proteinPercentage: 80,
                        carbPercentage: 5,
                        fatPercentage: 15
                    }
                },
                {
                    name: 'Vegetables',
                    displayName: 'Vegetables',
                    description: 'Colorful vegetables for vitamins and minerals',
                    color: '#4ECDC4',
                    icon: 'vegetables-icon.svg',
                    sortOrder: 2,
                    isActive: true,
                    macroNutrients: {
                        proteinPercentage: 10,
                        carbPercentage: 70,
                        fatPercentage: 20
                    }
                },
                {
                    name: 'Fruits',
                    displayName: 'Fruits',
                    description: 'Sweet fruits for natural sugars and vitamins',
                    color: '#45B7D1',
                    icon: 'fruits-icon.svg',
                    sortOrder: 3,
                    isActive: true,
                    macroNutrients: {
                        proteinPercentage: 5,
                        carbPercentage: 85,
                        fatPercentage: 10
                    }
                },
                {
                    name: 'Grains',
                    displayName: 'Grains',
                    description: 'Whole grains for energy and fiber',
                    color: '#96CEB4',
                    icon: 'grains-icon.svg',
                    sortOrder: 4,
                    isActive: true,
                    macroNutrients: {
                        proteinPercentage: 15,
                        carbPercentage: 75,
                        fatPercentage: 10
                    }
                },
                {
                    name: 'Dairy',
                    displayName: 'Dairy',
                    description: 'Dairy products for calcium and protein',
                    color: '#FFEAA7',
                    icon: 'dairy-icon.svg',
                    sortOrder: 5,
                    isActive: true,
                    macroNutrients: {
                        proteinPercentage: 25,
                        carbPercentage: 30,
                        fatPercentage: 45
                    }
                }
            ];
            // Add food groups
            for (const group of foodGroups) {
                await db.collection('foodGroups').add(group);
            }
            res.json({ success: true, message: 'Food database seeded successfully' });
        }
        catch (error) {
            console.error('Error seeding food database:', error);
            res.status(500).json({ error: 'Failed to seed database' });
        }
    }),
    // Update food item
    updateFoodItem: async (foodItemId, updates) => {
        try {
            await db.collection('foodItems').doc(foodItemId).update(Object.assign(Object.assign({}, updates), { updatedAt: admin.firestore.FieldValue.serverTimestamp() }));
            console.log(`Food item updated: ${foodItemId}`);
        }
        catch (error) {
            console.error('Error updating food item:', error);
            throw error;
        }
    },
    // Get food recommendations for a child
    getFoodRecommendations: async (data) => {
        var _a, _b;
        try {
            const { childId } = data;
            // Get child's allergies and restrictions
            const childDoc = await db.collection('children').doc(childId).get();
            if (!childDoc.exists) {
                throw new Error('Child not found');
            }
            const childData = childDoc.data();
            const allergies = ((_a = childData === null || childData === void 0 ? void 0 : childData.medicalInfo) === null || _a === void 0 ? void 0 : _a.allergies) || [];
            const restrictions = ((_b = childData === null || childData === void 0 ? void 0 : childData.medicalInfo) === null || _b === void 0 ? void 0 : _b.dietaryRestrictions) || [];
            // Get food items excluding allergens
            let foodQuery = db.collection('foodItems')
                .where('isActive', '==', true);
            const foodItems = await foodQuery.get();
            // Filter out allergens and apply restrictions
            const filteredFoods = foodItems.docs
                .map(doc => (Object.assign({ id: doc.id }, doc.data())))
                .filter(food => {
                var _a, _b, _c, _d, _e, _f;
                // Check for allergens
                const hasAllergens = (_b = (_a = food.allergenInfo) === null || _a === void 0 ? void 0 : _a.commonAllergens) === null || _b === void 0 ? void 0 : _b.some((allergen) => allergies.includes(allergen));
                if (hasAllergens)
                    return false;
                // Check dietary restrictions
                if (restrictions.includes('vegetarian') && ((_d = (_c = food.allergenInfo) === null || _c === void 0 ? void 0 : _c.commonAllergens) === null || _d === void 0 ? void 0 : _d.includes('meat'))) {
                    return false;
                }
                if (restrictions.includes('vegan') && ((_f = (_e = food.allergenInfo) === null || _e === void 0 ? void 0 : _e.commonAllergens) === null || _f === void 0 ? void 0 : _f.includes('dairy'))) {
                    return false;
                }
                return true;
            });
            // Group by food groups
            const groupedFoods = {};
            filteredFoods.forEach(food => {
                if (!groupedFoods[food.foodGroupId]) {
                    groupedFoods[food.foodGroupId] = [];
                }
                groupedFoods[food.foodGroupId].push(food);
            });
            // Get food groups for context
            const foodGroupsQuery = await db.collection('foodGroups').get();
            const foodGroups = foodGroupsQuery.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
            // Create recommendations
            const recommendations = foodGroups.map(group => ({
                foodGroup: group,
                foods: groupedFoods[group.id] || [],
                recommended: true
            }));
            return recommendations;
        }
        catch (error) {
            console.error('Error getting food recommendations:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=foodDatabase.js.map