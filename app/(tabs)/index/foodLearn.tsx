import LearnFoods from '@/components/common/LearnFoods';
import foodGuideData from '@/db/foods.json';
import { useUserStore } from '@/stores/userStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../../../constants/colors';
import { getFoodImageSource } from '../../../utils/imageUtils';

const { width } = Dimensions.get('window');

const FoodLearn = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLearnFoods, setShowLearnFoods] = useState(false);
  const [selectedFoodData, setSelectedFoodData] = useState<any>(null);
  const { profile, selectedChildId } = useUserStore();

  const childProfile = (profile as any)?.data?.user?.children || profile?.children;
  const selectedChild = childProfile.find((child: any) => child.id === selectedChildId) || childProfile[0];

  const allowedFruits = selectedChild.fruits || [];
  const allowedVegetables = selectedChild.vegetables || [];
  const allowedProteins = selectedChild.proteins || [];

  // Reset selected category and food data when switching children
  useEffect(() => {
    console.log('FoodLearn - selectedChildId changed to:', selectedChildId);
    setSelectedCategory('all');
    setShowLearnFoods(false);
    setSelectedFoodData(null);
  }, [selectedChildId]);

  const getAllFoods = () => {
    const foods: { name: string; category: string; description: string }[] = [];
    
    // Only add fruits that are in the allowedFruits array
    Object.keys(foodGuideData.fruits).forEach(fruitName => {
      if (allowedFruits.includes(fruitName)) {
        const fruitData = foodGuideData.fruits[fruitName as keyof typeof foodGuideData.fruits];
        foods.push({
          name: fruitName,
          category: 'fruits',
          description: fruitData.description,
        });
      }
    });

    // Only add vegetables that are in the allowedVegetables array
    Object.keys(foodGuideData.vegetables).forEach(vegName => {
      if (allowedVegetables.includes(vegName)) {
        const vegData = foodGuideData.vegetables[vegName as keyof typeof foodGuideData.vegetables];
        foods.push({
          name: vegName,
          category: 'vegetables',
          description: vegData.description,
        });
      }
    });

    // Only add proteins that are in the allowedProteins array
    Object.keys(foodGuideData.proteins).forEach(proteinName => {
      if (allowedProteins.includes(proteinName)) {
        const proteinData = foodGuideData.proteins[proteinName as keyof typeof foodGuideData.proteins];
        foods.push({
          name: proteinName,
          category: 'proteins',
          description: proteinData.description,
        });
      }
    });

    return foods;
  };

  const getFoodImage = (foodName: string) => {
    return getFoodImageSource(foodName);
  };

  const filteredFoods = getAllFoods().filter(food => {
    if (selectedCategory === 'all') return true;
    return food.category === selectedCategory;
  });

  const handleFoodPress = (foodName: string, category: string) => {
    // Get food data from the JSON file
    let foodData = null;
    
    if (category === 'fruits' && foodGuideData.fruits[foodName as keyof typeof foodGuideData.fruits]) {
      foodData = {
        name: foodName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        ...foodGuideData.fruits[foodName as keyof typeof foodGuideData.fruits]
      };
    } else if (category === 'vegetables' && foodGuideData.vegetables[foodName as keyof typeof foodGuideData.vegetables]) {
      foodData = {
        name: foodName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        ...foodGuideData.vegetables[foodName as keyof typeof foodGuideData.vegetables]
      };
    } else if (category === 'proteins' && foodGuideData.proteins[foodName as keyof typeof foodGuideData.proteins]) {
      foodData = {
        name: foodName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        ...foodGuideData.proteins[foodName as keyof typeof foodGuideData.proteins]
      };
    }
    
    if (foodData) {
       setSelectedFoodData(foodData);
       setShowLearnFoods(true);
     }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Learn About Food</Text>
        
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'all' && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'all' && styles.categoryTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'fruits' && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory('fruits')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'fruits' && styles.categoryTextActive]}>
                Fruits
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'vegetables' && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory('vegetables')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'vegetables' && styles.categoryTextActive]}>
                Vegetables
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'proteins' && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory('proteins')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'proteins' && styles.categoryTextActive]}>
                Proteins
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
          {filteredFoods.map((food) => (
            <TouchableOpacity
              key={food.name}
              style={styles.foodItem}
              onPress={() => handleFoodPress(food.name, food.category)}
              activeOpacity={0.7}
            >
              <Image source={getFoodImage(food.name)} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>
                  {food.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
       {showLearnFoods && selectedFoodData && (
        <View style={styles.overlay}>
          <LearnFoods
            imageSource={getFoodImage(selectedFoodData.name)}
            data={{
              description: selectedFoodData.description,
              nutrition_per_medium: {
                carbohydrates: selectedFoodData.nutrition_per_medium?.carbohydrates || selectedFoodData.nutrition_per_cup?.carbohydrates || 'N/A',
                protein: selectedFoodData.nutrition_per_medium?.protein || selectedFoodData.nutrition_per_cup?.protein || selectedFoodData.nutrition_per_3oz?.protein || selectedFoodData.nutrition_per_large_egg?.protein || 'N/A',
                fat: selectedFoodData.nutrition_per_medium?.fat || selectedFoodData.nutrition_per_cup?.fat || selectedFoodData.nutrition_per_3oz?.fat || selectedFoodData.nutrition_per_large_egg?.fat || 'N/A',
              },
              nutrient_sources: {
                carbohydrates: selectedFoodData.nutrient_sources?.carbohydrates || 'N/A',
                protein: selectedFoodData.nutrient_sources?.protein || 'N/A',
                fat: selectedFoodData.nutrient_sources?.fat || 'N/A',
              },
              how_grown: selectedFoodData.how_grown || selectedFoodData.how_produced || ['Information not available'],
              how_to_eat: selectedFoodData.how_to_eat || ['Information not available'],
            }}
            onBack={() => setShowLearnFoods(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingTop: 23,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
    marginBottom: 20,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryFilter: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: 'white',
  },
  foodList: {
    flex: 1,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  foodImage: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 15,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
});

export default FoodLearn;