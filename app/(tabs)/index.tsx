import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

interface UserData {
  name: string;
  childName: string;
  childAge: string;
  streak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface TodayStats {
  mealsLogged: number;
  foodsIntroduced: number;
  caloriesConsumed: number;
  targetCalories: number;
}

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'Sarah',
    childName: 'Emma',
    childAge: '2',
    streak: 7,
    level: 3,
    xp: 1250,
    nextLevelXp: 2000
  });
  
  const [todayStats, setTodayStats] = useState<TodayStats>({
    mealsLogged: 2,
    foodsIntroduced: 1,
    caloriesConsumed: 450,
    targetCalories: 800
  });
  
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  const getProgressPercentage = (): number => {
    return (userData.xp / userData.nextLevelXp) * 100;
  };
  
  const getCalorieProgress = (): number => {
    return (todayStats.caloriesConsumed / todayStats.targetCalories) * 100;
  };
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning, {userData.name}! 👋</Text>
              <Text style={styles.subtitle}>Let's track {userData.childName}'s nutrition</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('../profile')}
            >
              <Image 
                source={require('../../assets/images/avatar.png')}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
          
          {/* Level Progress */}
          <View style={styles.levelContainer}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {userData.level}</Text>
              <Text style={styles.xpText}>{userData.xp} / {userData.nextLevelXp} XP</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
          </View>
        </LinearGradient>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('../meals/logging')}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.actionGradient}
            >
              <Ionicons name="fast-food" size={32} color="white" />
              <Text style={styles.actionTitle}>Log Meal</Text>
              <Text style={styles.actionSubtitle}>Track what {userData.childName} ate</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('../food/selection')}
          >
            <LinearGradient
              colors={['#4ECDC4', '#6EE7DF']}
              style={styles.actionGradient}
            >
              <Ionicons name="restaurant" size={32} color="white" />
              <Text style={styles.actionTitle}>Add Food</Text>
              <Text style={styles.actionSubtitle}>Introduce new foods</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Today's Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{todayStats.mealsLogged}</Text>
              <Text style={styles.statLabel}>Meals Logged</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="leaf" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{todayStats.foodsIntroduced}</Text>
              <Text style={styles.statLabel}>New Foods</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{todayStats.caloriesConsumed}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{userData.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
          
          {/* Calorie Progress */}
          <View style={styles.calorieProgress}>
            <View style={styles.calorieHeader}>
              <Text style={styles.calorieTitle}>Calorie Goal</Text>
              <Text style={styles.calorieText}>
                {todayStats.caloriesConsumed} / {todayStats.targetCalories} cal
              </Text>
            </View>
            <View style={styles.calorieBar}>
              <View 
                style={[
                  styles.calorieFill, 
                  { width: `${getCalorieProgress()}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('../meals/history')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="sunny" size={20} color={colors.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Breakfast logged</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <Text style={styles.activityCalories}>320 cal</Text>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="restaurant" size={20} color={colors.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New food added</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
              <Text style={styles.activityCalories}>Broccoli</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  levelContainer: {
    marginTop: 10,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  xpText: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.text.inverse,
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -15,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  calorieProgress: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calorieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  calorieText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  calorieBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  calorieFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  activityCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default HomeScreen;
