import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

const HomeScreen = ({ navigation }) => {
  const userStats = {
    name: 'Laurentia Clarissa',
    isPremium: true,
    healthScore: 50,
    coins: 50,
    rank: 4,
    betterThan: 60
  };

  const menuItems = [
    {
      id: 'eating',
      title: 'What Are We Eating?',
      image: '🍓',
      bgColor: '#FFE5E5',
      onPress: () => navigation.navigate('FoodReport')
    },
    {
      id: 'learn',
      title: 'Lets Learn',
      image: '👶',
      bgColor: '#E5F3FF',
      onPress: () => navigation.navigate('LearningModule')
    },
    {
      id: 'timeToEat',
      title: 'Time To Eat',
      image: '🍽️',
      bgColor: '#E5F0FF',
      onPress: () => navigation.navigate('MealTracking')
    },
    {
      id: 'chart',
      title: 'Our Chart',
      image: '📊',
      bgColor: '#FFE5F0',
      onPress: () => navigation.navigate('MealHistory')
    }
  ];

  const MenuItem = ({ item, index }) => {
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
      if (item.onPress) {
        setTimeout(() => item.onPress(), 100);
      }
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={animatedStyle}
      >
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: item.bgColor }]}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          {item.id === 'eating' && (
            <View style={styles.menuImageContainer}>
              <Text style={styles.menuEmoji}>🍓</Text>
              <Text style={[styles.menuEmoji, styles.emojiSmall]}>🥝</Text>
              <Text style={[styles.menuEmoji, styles.emojiMedium]}>🍒</Text>
              <Text style={[styles.menuEmoji, styles.emojiTiny]}>🍉</Text>
            </View>
          )}
          
          {item.id === 'learn' && (
            <View style={styles.menuImageContainer}>
              <Text style={styles.menuEmoji}>👶</Text>
              <View style={styles.learningIcons}>
                <Text style={styles.learningIcon}>A B</Text>
                <Text style={styles.learningIcon}>1 2</Text>
              </View>
            </View>
          )}
          
          {item.id === 'timeToEat' && (
            <View style={styles.menuImageContainer}>
              <View style={styles.plateContainer}>
                <Text style={styles.plateEmoji}>🍽️</Text>
              </View>
            </View>
          )}
          
          {item.id === 'chart' && (
            <View style={styles.menuImageContainer}>
              <View style={styles.chartPreview}>
                <Text style={styles.chartTitle}>Kids Daily Meal</Text>
                <View style={styles.mealCategories}>
                  <Text style={styles.mealCategory}>🥣 Breakfast</Text>
                  <Text style={styles.mealCategory}>🍜 Lunch</Text>
                </View>
                <View style={styles.chartIcon}>
                  <Text>📊</Text>
                </View>
              </View>
            </View>
          )}
          
          <Text style={styles.menuTitle}>{item.title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Image 
              source={require('../../assets/images/avatars/user.jpg')}
              style={styles.userAvatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userStats.name}</Text>
              {userStats.isPremium && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.text.inverse} />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="add-circle" size={20} color={colors.info} />
              <Text style={styles.statValue}>{userStats.healthScore}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="star" size={20} color={colors.warning} />
              <Text style={styles.statValue}>{userStats.coins}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View 
          entering={FadeIn.springify()}
          style={styles.welcomeSection}
        >
          <Text style={styles.welcomeText}>Welcome how are we doing today?</Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInUp.springify()}
          style={styles.rankCard}
        >
          <View style={styles.rankBadge}>
            <Text style={styles.rankNumber}>#{userStats.rank}</Text>
          </View>
          <Text style={styles.rankText}>
            You are doing better than {userStats.betterThan}%{'\n'}
            of other Children's!
          </Text>
        </Animated.View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <Text style={styles.searchPlaceholder}>Search here</Text>
        </View>

        <ScrollView 
          style={styles.menuGrid}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.menuRow}>
            {menuItems.slice(0, 2).map((item, index) => (
              <MenuItem key={item.id} item={item} index={index} />
            ))}
          </View>
          <View style={styles.menuRow}>
            {menuItems.slice(2, 4).map((item, index) => (
              <MenuItem key={item.id} item={item} index={index + 2} />
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
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    paddingVertical: 8,
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
  welcomeSection: {
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text.inverse,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -20,
  },
  rankCard: {
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rankBadge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  rankText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 22,
    flex: 1,
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
  searchPlaceholder: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 12,
  },
  menuGrid: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  menuItem: {
    width: (width - 56) / 2,
    height: 180,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuEmoji: {
    fontSize: 48,
  },
  emojiSmall: {
    fontSize: 32,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  emojiMedium: {
    fontSize: 36,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  emojiTiny: {
    fontSize: 24,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  learningIcons: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 10,
    top: 10,
  },
  learningIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  plateContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateEmoji: {
    fontSize: 64,
  },
  chartPreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  mealCategories: {
    marginBottom: 8,
  },
  mealCategory: {
    fontSize: 10,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  chartIcon: {
    marginTop: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
});

export default HomeScreen;