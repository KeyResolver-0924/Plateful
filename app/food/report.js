import { Ionicons } from '@expo/vector-icons';
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
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { getAllFoods } from '../../db/foods';

const { width } = Dimensions.get('window');

const FoodReportScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('foods');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get foods from database
  const allFoods = getAllFoods();
  
  const foodCategories = {
    foods: allFoods.slice(0, 9), // First 9 foods
    baseline: [
      // These would need to be added to the database
      { id: 'rice', name: 'Rice', image: require('../../assets/images/foods/rice.png'), category: 'Grains' },
      { id: 'bread', name: 'Bread', image: require('../../assets/images/foods/bread.png'), category: 'Grains' },
      { id: 'pasta', name: 'Pasta', image: require('../../assets/images/foods/pasta.png'), category: 'Grains' },
    ],
    notIntroduced: [
      // These would need to be added to the database
      { id: 'honey', name: 'Honey', image: require('../../assets/images/foods/honey.png'), category: 'Sweeteners' },
      { id: 'shellfish', name: 'Shellfish', image: require('../../assets/images/foods/shellfish.png'), category: 'Proteins' },
      { id: 'chocolate', name: 'Chocolate', image: require('../../assets/images/foods/chocolate.png'), category: 'Sweets' },
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
            <Image 
              source={food.image} 
              style={styles.foodImage}
              resizeMode="contain"
            />
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