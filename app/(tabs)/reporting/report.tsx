import HeaderProfile from '@/components/common/HeaderProfile';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { colors } from '../../../constants/colors';
import { Food } from '../../../constants/foods';
import { getAllFoods } from '../../../db/foods';

const { width } = Dimensions.get('window');

interface FoodItemProps {
  food: Food;
  index: number;
  onPress: (food: Food) => void;
}

// Image mapping for food items
const foodImages: { [key: string]: any } = {
  apple: require('../../../assets/images/foods/apple.png'),
  banana: require('../../../assets/images/foods/banana.png'),
  orange: require('../../../assets/images/foods/orange.png'),
  strawberry: require('../../../assets/images/foods/strawberry.png'),
  grapes: require('../../../assets/images/foods/grapes.png'),
  watermelon: require('../../../assets/images/foods/watermelon.png'),
  mango: require('../../../assets/images/foods/mango.png'),
  pear: require('../../../assets/images/foods/pear.png'),
  peach: require('../../../assets/images/foods/peach.png'),
  carrot: require('../../../assets/images/foods/carrot.png'),
  broccoli: require('../../../assets/images/foods/broccoli.png'),
  sweetpotato: require('../../../assets/images/foods/sweetpotato.png'),
  peas: require('../../../assets/images/foods/peas.png'),
  corn: require('../../../assets/images/foods/corn.png'),
  cucumber: require('../../../assets/images/foods/cucumber.png'),
  bellpepper: require('../../../assets/images/foods/bellpepper.png'),
  spinach: require('../../../assets/images/foods/spinach.png'),
  tomato: require('../../../assets/images/foods/tomato.png'),
  chicken: require('../../../assets/images/foods/chicken.png'),
  fish: require('../../../assets/images/foods/fish.png'),
  eggs: require('../../../assets/images/foods/eggs.png'),
  beans: require('../../../assets/images/foods/beans.png'),
  lentils: require('../../../assets/images/foods/lentils.png'),
  tofu: require('../../../assets/images/foods/tofu.png'),
  beef: require('../../../assets/images/foods/beef.png'),
  turkey: require('../../../assets/images/foods/turkey.png'),
  nuts: require('../../../assets/images/foods/nuts.png'),
  rice: require('../../../assets/images/foods/rice.png'),
  yogurt: require('../../../assets/images/foods/yogurt.png'),
  cheese: require('../../../assets/images/foods/cheese.png'),
  bread: require('../../../assets/images/foods/bread.png'),
  potato: require('../../../assets/images/foods/potato.png'),
  garlic: require('../../../assets/images/foods/garlic.png'),
  avocado: require('../../../assets/images/foods/avocado.png'),
  almonds: require('../../../assets/images/foods/almonds.png'),
  pistachios: require('../../../assets/images/foods/pistachios.png'),
  pineapple: require('../../../assets/images/foods/pineapple.png'),
  cream: require('../../../assets/images/foods/cream.png'),
  coconut_oil: require('../../../assets/images/foods/coconut_oil.png'),
  chocolate: require('../../../assets/images/foods/chocolate.png'),
  butter: require('../../../assets/images/foods/butter.png'),
  honey: require('../../../assets/images/foods/honey.png'),
  ice_cream: require('../../../assets/images/foods/ice_cream.png'),
  shellfish: require('../../../assets/images/foods/shellfish.png'),
  tofus: require('../../../assets/images/foods/tofus.png'),
  meal: require('../../../assets/images/foods/meal.png'),
  meat: require('../../../assets/images/foods/meat.png'),
  milk: require('../../../assets/images/foods/milk.png'),
  fruits: require('../../../assets/images/foods/fruits.png'),
  egg: require('../../../assets/images/foods/egg.png'),
  clock: require('../../../assets/images/foods/clock.png'),
  box: require('../../../assets/images/foods/box.png'),
  // Default fallback image
  default: require('../../../assets/images/foods/apple.png'),
};

const FoodReportScreen = () => {
  const [activeTab, setActiveTab] = useState('foods');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get foods from database
  const allFoods = getAllFoods();
  
  const foodCategories = {
    foods: allFoods.slice(0, 9), // First 9 foods
    baseline: [
      // These would need to be added to the database
      { id: 'rice', name: 'Rice', image: require('../../../assets/images/foods/rice.png'), category: 'Grains' },
      { id: 'bread', name: 'Bread', image: require('../../../assets/images/foods/bread.png'), category: 'Grains' },
      { id: 'pasta', name: 'Pasta', image: require('../../../assets/images/foods/pasta.png'), category: 'Grains' },
    ],
    notIntroduced: [
      // These would need to be added to the database
      { id: 'honey', name: 'Honey', image: require('../../../assets/images/foods/honey.png'), category: 'Sweeteners' },
      { id: 'shellfish', name: 'Shellfish', image: require('../../../assets/images/foods/shellfish.png'), category: 'Proteins' },
      { id: 'chocolate', name: 'Chocolate', image: require('../../../assets/images/foods/chocolate.png'), category: 'Sweets' },
    ]
  };

  const FoodItem: React.FC<FoodItemProps> = ({ food, index, onPress }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePress = () => {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });
      if (onPress) {
        setTimeout(() => onPress(food), 100);
      }
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).springify()}
        style={animatedStyle}
      >
        <TouchableOpacity
          style={styles.foodItem}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.foodImageContainer}>
            <Image 
              source={foodImages[food.id] || foodImages.default} 
              defaultSource={foodImages.default}
              style={styles.foodImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.foodName}>{food.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleFoodPress = (food: Food) => {
    // Navigate to food detail or add to meal
    router.push({
      pathname: '/(tabs)/reporting/report',
      params: { food: JSON.stringify(food) }
    });
  };

  const filteredFoods = (foodCategories as any)[activeTab].filter((food: Food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderProfile />
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'foods' && styles.tabActive]}
            onPress={() => setActiveTab('foods')}
          >
            <Text style={[styles.tabText, activeTab === 'foods' && styles.tabTextActive]}>
              Foods
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'baseline' && styles.tabActive]}
            onPress={() => setActiveTab('baseline')}
          >
            <Text style={[styles.tabText, activeTab === 'baseline' && styles.tabTextActive]}>
              Baseline Foods
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notIntroduced' && styles.tabActive]}
            onPress={() => setActiveTab('notIntroduced')}
          >
            <Text style={[styles.tabText, activeTab === 'notIntroduced' && styles.tabTextActive]}>
              Not Introduced
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Food Report</Text>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.foodGrid}>
            {filteredFoods.map((food: Food, index: number) => (
              <FoodItem
                key={food.id}
                food={food}
                index={index}
                onPress={handleFoodPress}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    // backgroundColor: colors.primary,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginHorizontal: 24,
    marginBottom: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodItem: {
    width: (width - 72) / 3,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  foodImageContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
});

export default FoodReportScreen;