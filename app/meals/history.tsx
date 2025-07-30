import { Ionicons } from '@expo/vector-icons';
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
import Animated, {
    FadeIn,
    FadeInUp
} from 'react-native-reanimated';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/Colors';
import { getFoodById } from '../../db/foods';

const { width } = Dimensions.get('window');

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
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

  const mealHistory = [
    {
      id: 1,
      date: '8/1/2024',
      time: '19:30pm',
      meals: {
        fruits: { name: 'Fruits Eaten', value: 'CARBS 27%', image: apple?.image },
        vegetables: { name: 'Veg Eaten', value: 'NUTRIENTS 27%', image: carrot?.image },
        protein: { name: 'Protien Eaten', value: 'CARBS 27%', image: beef?.image }
      }
    },
    {
      id: 2,
      date: '8/1/2024',
      time: '19:30pm',
      meals: {
        fruits: { name: 'Fruits Eaten', value: 'CARBS 27%', image: apple?.image },
        vegetables: { name: 'Veg Eaten', value: 'NUTRIENTS 27%', image: carrot?.image },
        protein: { name: 'Protien Eaten', value: 'CARBS 27%', image: beef?.image }
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
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>
          {/* Simplified pie chart representation */}
          <View style={styles.chartSegments}>
            {segments.map((segment, index) => (
              <View
                key={index}
                style={[
                  styles.chartSegment,
                  {
                    backgroundColor: segment.color,
                    flex: segment.percentage
                  }
                ]}
              />
            ))}
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

  const MealCard = ({ meal, index }: { meal: any, index: number }) => {
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
          {Object.values(meal.meals).map((item, idx) => (
            <View key={idx} style={styles.mealItem}>
              <View style={styles.mealItemLeft}>
                <View style={styles.mealIcon}>
                  {item.image ? (
                    <Image 
                      source={item.image} 
                      style={styles.mealImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.mealEmoji}>🍽️</Text>
                  )}
                </View>
                <View>
                  <Text style={styles.mealItemName}>{item.name}</Text>
                  <Text style={styles.mealItemValue}>{item.value}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="bookmark" size={20} color={colors.primary} />
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
      <StatusBar />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Image 
              source={require('../../assets/images/avatars/user.jpg')}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>Laurentia Clarissa</Text>
            <View style={styles.premiumBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.text.inverse} />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="add-circle" size={20} color={colors.info} />
              <Text style={styles.statValue}>50</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="star" size={20} color={colors.warning} />
              <Text style={styles.statValue}>50</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'food' && styles.tabActive]}
            onPress={() => setActiveTab('food')}
          >
            <Text style={[styles.tabText, activeTab === 'food' && styles.tabTextActive]}>
              Food
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'mealHistory' && styles.tabActive]}
            onPress={() => setActiveTab('mealHistory')}
          >
            <Text style={[styles.tabText, activeTab === 'mealHistory' && styles.tabTextActive]}>
              Meal History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'learning' && styles.tabActive]}
            onPress={() => setActiveTab('learning')}
          >
            <Text style={[styles.tabText, activeTab === 'learning' && styles.tabTextActive]}>
              Learning Module
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Welcome how are we doing today?</Text>
          
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
            <Ionicons name="ribbon" size={24} color={colors.primary} />
            <Text style={styles.progressTitle}>Today Nutrient</Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>Good</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${todayProgress.completed}%` }]} />
          </View>
          
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Completed</Text>
            <Text style={styles.progressLabel}>Remaining</Text>
          </View>
          
          <Text style={styles.progressPercentage}>{todayProgress.completed}%</Text>
        </Animated.View>

        {/* Achievement */}
        <Animated.View
          entering={FadeIn.delay(300).springify()}
          style={styles.achievementCard}
        >
          <Ionicons name="ribbon" size={24} color={colors.primary} />
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
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.inverse,
    marginRight: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 14,
    color: colors.text.inverse,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginHorizontal: 24,
    marginBottom: -1,
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
    borderBottomColor: colors.warning,
  },
  tabText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.warning,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
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
    fontSize: 14,
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
  chartSegments: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  chartSegment: {
    height: '100%',
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
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  progressBadge: {
    backgroundColor: colors.success + '20',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
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
  progressLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressPercentage: {
    fontSize: 24,
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
    marginLeft: 12,
    lineHeight: 22,
  },
  achievementSubtext: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.text.secondary,
  },
  mealCard: {
    backgroundColor: colors.surface,
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
    fontSize: 14,
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
  mealIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  mealId: {
    fontSize: 12,
    color: colors.text.secondary,
    opacity: 0.5,
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
   },
});

export default MealHistoryScreen;