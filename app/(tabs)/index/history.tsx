import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp
} from 'react-native-reanimated';
import { colors } from '../../../constants/colors';
import { getFoodById } from '../../../db/foods';

const { width } = Dimensions.get('window');

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

interface MealItemType {
  name: string;
  value: string;
  image?: ImageSourcePropType;
}

interface MealMealsType {
  fruits: MealItemType;
  vegetables: MealItemType;
  protein: MealItemType;
  [key: string]: MealItemType;
}

interface MealType {
  id: number;
  date: string;
  time: string;
  meals: MealMealsType;
}

const MealHistoryScreen = ({ navigation }: { navigation: NavigationProps }) => {
  const [activeTab, setActiveTab] = useState('mealHistory');
  
  const weeklyNutrients = {
    protein: 45,
    fats: 28,
    carbs: 27,
    change: '+3% From Last Month'
  };

  const todayProgress = {
    completed: 60,
    remaining: 40
  };

  const achievements = [
    {
      id: 1,
      title: 'Today Nutrient',
      description: 'Completed',
      progress: 60,
      icon: '🏆'
    },
    {
      id: 2,
      title: 'Produce weekly Variety',
      description: "you've earned a new reward",
      icon: '⭐'
    }
  ];

  // Get food images from database
  const apple = getFoodById('apple');
  const carrot = getFoodById('carrot');
  const beef = getFoodById('beef');

  const mealHistory: MealType[] = [
    {
      id: 1,
      date: '8/1/2024',
      time: '19:30pm',
      meals: {
        fruits: { name: 'Fruits Eaten', value: 'CARBS 27%', image: require('../../../assets/images/foods/apple.png') },
        vegetables: { name: 'Veg Eaten', value: 'NUTRIENTS 27%', image: require('../../../assets/images/foods/carrot.png') },
        protein: { name: 'Protien Eaten', value: 'CARBS 27%', image: require('../../../assets/images/foods/beef.png') }
      }
    },
    {
      id: 2,
      date: '8/1/2024',
      time: '19:30pm',
      meals: {
        fruits: { name: 'Fruits Eaten', value: 'CARBS 27%', image: require('../../../assets/images/foods/apple.png') },
        vegetables: { name: 'Veg Eaten', value: 'NUTRIENTS 27%', image: require('../../../assets/images/foods/carrot.png') },
        protein: { name: 'Protien Eaten', value: 'CARBS 27%', image: require('../../../assets/images/foods/beef.png') }
      }
    }
  ];

  const NutrientChart = () => {
    const chartSize = 150;
    const strokeWidth = 15;
    const radius = (chartSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    const segments = [
      { percentage: weeklyNutrients.protein, color: '#4CAF50', label: 'Protein' },
      { percentage: weeklyNutrients.fats, color: '#FF9800', label: 'Fats' },
      { percentage: weeklyNutrients.carbs, color: '#2196F3', label: 'Carbs' }
    ];

    return (
      <View style={styles.chartContainer}>
        <View style={styles.pieChart}>
          <View style={styles.chartCenter}>
            <Image source={require('../../../assets/images/characters/marketing.png')} style={{width: 150, height: 150}}/>
          </View>
        </View>
        
        <View style={styles.chartLegend}>
          {segments.map((segment, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
              <Text style={styles.legendLabel}>{segment.label}</Text>
              <Text style={styles.legendValue}>{segment.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const MealCard = ({ meal, index }: { meal: MealType, index: number }) => {
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={styles.mealCard}
      >
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>Dinner</Text>
          <Text style={styles.mealDateTime}>{meal.date} - {meal.time}</Text>
        </View>
        
        <View style={styles.mealItems}>
          {Object.values(meal.meals).map((item: MealItemType, idx) => (
            <View key={idx} style={styles.mealItem}>
              <View style={styles.mealItemLeft}>
                  {item.image ? (
                    <Image 
                      source={item.image} 
                      style={styles.mealImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image source={item.image} style={{width: 20, height: 20}}/>
                  )}
                <View>
                  <Text style={styles.mealItemName}>{item.name}</Text>
                  <Text style={styles.mealItemValue}>{item.value}</Text>
                </View>
              </View>
              <TouchableOpacity>
              <Image source={require('../../../assets/images/icons/Bookmark.png')} style={{width: 30, height: 30}}/>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <Text style={styles.mealId}>172365816045x763641946663901300</Text>
      </Animated.View>
    );
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
        <Text style={styles.headerTitle}>Meal History</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.text.secondary} />
            <Text style={styles.searchPlaceholder}>Search here</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Meal History</Text>

        {/* Weekly Nutrient Chart */}
        <Animated.View
          entering={FadeIn.springify()}
          style={styles.nutrientCard}
        >
          <View style={styles.nutrientHeader}>
            <Text style={styles.nutrientTitle}>Weekly Nutrient</Text>
            <Text style={styles.nutrientChange}>{weeklyNutrients.change}</Text>
          </View>
          <NutrientChart />
        </Animated.View>

        {/* Today Progress */}
        <Animated.View
          entering={FadeIn.delay(200).springify()}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <Image source={require('../../../assets/images/icons/Bookmark.png')} style={{width: 30, height: 30}}/>
            <Text style={styles.progressTitle}>Today Nutrient</Text>
            <Text style={styles.progressPercentage}>{todayProgress.completed}%</Text>
          </View>          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${todayProgress.completed}%` }]} />
          </View>
          
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel1}>Completed</Text>
            <Text style={styles.progressLabel2}>Remaining</Text>
          </View>
          
        </Animated.View>

        {/* Achievement */}
        <Animated.View
          entering={FadeIn.delay(300).springify()}
          style={styles.achievementCard}
        >
          <Image source={require('../../../assets/images/icons/Bookmark.png')} style={{width: 30, height: 30}}/>
          <Text style={styles.achievementText}>
            Produce weekly Variety{'\n'}
            <Text style={styles.achievementSubtext}>you've earned a new reward</Text>
          </Text>
        </Animated.View>

        {/* Meal History */}
        {mealHistory.map((meal, index) => (
          <MealCard key={meal.id} meal={meal} index={index} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  nutrientCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nutrientTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  nutrientChange: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    width: 150,
    height: 150,
    position: 'relative',
    marginRight: 20,
  },
  chartCenter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    zIndex: 1,
  },
  chartLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel1: {
    position: 'absolute',
    left : 20,
    top : -20,
    fontSize: 8,
    color: colors.background,
  },
  progressLabel2: {
    position: 'absolute',
    right : 20,
    top : -20,
    fontSize: 8,
    color: colors.primary,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  achievementCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    lineHeight: 22,
  },
  achievementSubtext: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.text.secondary,
  },
  mealCard: {
    backgroundColor: colors.background2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  mealDateTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  mealItems: {
    marginBottom: 12,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealEmoji: {
    fontSize: 24,
  },
  mealItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  mealItemValue: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 2,
  },
  mealId: {
    fontSize: 12,
    color: colors.text.secondary,
    opacity: 0.5,
    textAlign: 'right',
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
   },
});

export default MealHistoryScreen;