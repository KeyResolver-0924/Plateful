import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
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
import foodGuideData from '../food_guide_json.json';
import FoodDetailModal from './food-detail-modal';

const { width } = Dimensions.get('window');

const FoodLearningScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFoodData, setSelectedFoodData] = useState<any>(null);

  const getAllFoods = () => {
    const foods: { name: string; category: string; description: string }[] = [];
    
    Object.keys(foodGuideData.fruits).forEach(fruitName => {
      const fruitData = foodGuideData.fruits[fruitName as keyof typeof foodGuideData.fruits];
      foods.push({
        name: fruitName,
        category: 'fruits',
        description: fruitData.description,
      });
    });

    Object.keys(foodGuideData.vegetables).forEach(vegName => {
      const vegData = foodGuideData.vegetables[vegName as keyof typeof foodGuideData.vegetables];
      foods.push({
        name: vegName,
        category: 'vegetables',
        description: vegData.description,
      });
    });

    Object.keys(foodGuideData.proteins).forEach(proteinName => {
      const proteinData = foodGuideData.proteins[proteinName as keyof typeof foodGuideData.proteins];
      foods.push({
        name: proteinName,
        category: 'proteins',
        description: proteinData.description,
      });
    });

    return foods;
  };

  const getFoodImage = (foodName: string) => {
    const imageMap: { [key: string]: any } = {
      // Fruits
      apple: require('../../../assets/images/foods/apple.png'),
      pear: require('../../../assets/images/foods/pear.png'),
      banana: require('../../../assets/images/foods/banana.png'),
      orange: require('../../../assets/images/foods/orange.png'),
      pineapple: require('../../../assets/images/foods/pineapple.png'),
      strawberry: require('../../../assets/images/foods/strawberry.png'),
      grapes: require('../../../assets/images/foods/grapes.png'),
      watermelon: require('../../../assets/images/foods/watermelon.png'),
      mango: require('../../../assets/images/foods/mango.png'),
      peach: require('../../../assets/images/foods/peach.png'),
      apricot: require('../../../assets/images/foods/apricot.png'),
      
      // Vegetables
      carrots: require('../../../assets/images/foods/carrot.png'),
      broccoli: require('../../../assets/images/foods/broccoli.png'),
      sweet_potato: require('../../../assets/images/foods/sweetpotato.png'),
      peas: require('../../../assets/images/foods/peas.png'),
      corn: require('../../../assets/images/foods/maize .png'),
      cucumber: require('../../../assets/images/foods/cucumber.png'),
      bell_peppers: require('../../../assets/images/foods/bellpepper.png'),
      spinach: require('../../../assets/images/foods/spinach.png'),
      tomato: require('../../../assets/images/foods/tomato.png'),
      cabbage: require('../../../assets/images/foods/cabbage.png'),
      
      // Proteins
      chicken: require('../../../assets/images/foods/chicken.png'),
      fish: require('../../../assets/images/foods/fish.png'),
      egg: require('../../../assets/images/foods/egg.png'),
      beans: require('../../../assets/images/foods/beans.png'),
      lentils: require('../../../assets/images/foods/lentils.png'),
      tofu: require('../../../assets/images/foods/tofu.png'),
      lean_beef: require('../../../assets/images/foods/beef.png'),
      turkey: require('../../../assets/images/foods/turkey.png'),
      nuts: require('../../../assets/images/foods/nuts.png'),
    };
    // Return the mapped image or a fallback based on category
    if (imageMap[foodName]) {
      return imageMap[foodName];
    }
    
    // Fallback images based on category
    if (selectedCategory === 'fruits') {
      return require('../../../assets/images/foods/apple.png');
    } else if (selectedCategory === 'vegetables') {
      return require('../../../assets/images/foods/carrot.png');
    } else if (selectedCategory === 'proteins') {
      return require('../../../assets/images/foods/chicken.png');
    }
    
    return require('../../../assets/images/foods/fruits.png');
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
      setShowFoodModal(true);
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
      
      <FoodDetailModal
        visible={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        foodData={selectedFoodData}
      />
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
    width: 50,
    height: 50,
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
});

export default FoodLearningScreen;