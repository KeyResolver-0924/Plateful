import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const foodDatabase = {
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
    } catch (error) {
      console.error('Error seeding food database:', error);
      res.status(500).json({ error: 'Failed to seed database' });
    }
  }),

  // Update food item
  updateFoodItem: async (foodItemId: string, updates: any) => {
    try {
      await db.collection('foodItems').doc(foodItemId).update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Food item updated: ${foodItemId}`);
    } catch (error) {
      console.error('Error updating food item:', error);
      throw error;
    }
  },

  // Get food recommendations for a child
  getFoodRecommendations: async (data: any) => {
    try {
      const { childId, mealType, preferences } = data;
      
      // Get child's allergies and restrictions
      const childDoc = await db.collection('children').doc(childId).get();
      if (!childDoc.exists) {
        throw new Error('Child not found');
      }
      
      const childData = childDoc.data();
      const allergies = childData?.medicalInfo?.allergies || [];
      const restrictions = childData?.medicalInfo?.dietaryRestrictions || [];
      
      // Get food items excluding allergens
      let foodQuery = db.collection('foodItems')
        .where('isActive', '==', true);
      
      const foodItems = await foodQuery.get();
      
      // Filter out allergens and apply restrictions
      const filteredFoods = foodItems.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(food => {
          // Check for allergens
          const hasAllergens = food.allergenInfo?.commonAllergens?.some((allergen: string) => 
            allergies.includes(allergen)
          );
          
          if (hasAllergens) return false;
          
          // Check dietary restrictions
          if (restrictions.includes('vegetarian') && food.allergenInfo?.commonAllergens?.includes('meat')) {
            return false;
          }
          
          if (restrictions.includes('vegan') && food.allergenInfo?.commonAllergens?.includes('dairy')) {
            return false;
          }
          
          return true;
        });
      
      // Group by food groups
      const groupedFoods: { [key: string]: any[] } = {};
      filteredFoods.forEach(food => {
        if (!groupedFoods[food.foodGroupId]) {
          groupedFoods[food.foodGroupId] = [];
        }
        groupedFoods[food.foodGroupId].push(food);
      });
      
      // Get food groups for context
      const foodGroupsQuery = await db.collection('foodGroups').get();
      const foodGroups = foodGroupsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Create recommendations
      const recommendations = foodGroups.map(group => ({
        foodGroup: group,
        foods: groupedFoods[group.id] || [],
        recommended: true
      }));
      
      return recommendations;
      
    } catch (error) {
      console.error('Error getting food recommendations:', error);
      throw error;
    }
  }
}; 