import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import StatusBar from '../../components/common/StatusBar';

const { width } = Dimensions.get('window');

const FoodReportScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('foods');
  const [searchQuery, setSearchQuery] = useState('');
  
  const foodCategories = {
    foods: [
      { id: 1, name: 'Apple', image: '🍎', category: 'Fruits' },
      { id: 2, name: 'Carrots', image: '🥕', category: 'Vegetables' },
      { id: 3, name: 'Fish', image: '🐟', category: 'Proteins' },
      { id: 4, name: 'Sweet Potatoes', image: '🍠', category: 'Vegetables' },
      { id: 5, name: 'Grapes', image: '🍇', category: 'Fruits' },
      { id: 6, name: 'Beans', image: '🫘', category: 'Legumes' },
      { id: 7, name: 'Yogurt', image: '🥣', category: 'Dairy' },
      { id: 8, name: 'Pear', image: '🍐', category: 'Fruits' },
      { id: 9, name: 'Nuts', image: '🥜', category: 'Proteins' },
    ],
    baseline: [
      { id: 10, name: 'Rice', image: '🍚', category: 'Grains' },
      { id: 11, name: 'Bread', image: '🍞', category: 'Grains' },
      { id: 12, name: 'Pasta', image: '🍝', category: 'Grains' },
    ],
    notIntroduced: [
      { id: 13, name: 'Honey', image: '🍯', category: 'Sweeteners' },
      { id: 14, name: 'Shellfish', image: '🦐', category: 'Proteins' },
      { id: 15, name: 'Chocolate', image: '🍫', category: 'Sweets' },
    ]
  };

  const FoodItem = ({ food, index, onPress }) => {
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
            <Text style={styles.foodEmoji}>{food.image}</Text>
          </View>
          
          <Text style={styles.foodName}>{food.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleFoodPress = (food) => {
    // Navigate to food detail or add to meal
    navigation.navigate('FoodDetail', { food });
  };

  const filteredFoods = foodCategories[activeTab].filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Image 
              source={require('../../assets/images/avatars/user.jpg')}
              style={styles.userAvatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Laurentia Clarissa</Text>
              <View style={styles.premiumBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.text.inverse} />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
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

        <Text style={styles.sectionTitle}>Food Report</Text>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.foodGrid}>
            {filteredFoods.map((food, index) => (
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
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userDetails: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
  foodEmoji: {
    fontSize: 40,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
});

export default FoodReportScreen;