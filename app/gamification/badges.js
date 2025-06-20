import React, { useState } from 'react';
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

const BadgesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('badge');
  
  const badges = [
    {
      id: 1,
      name: 'Bronze',
      icon: '🥉',
      deadline: '25, October 2025',
      points: 200,
      remaining: 850,
      color: '#CD7F32',
      locked: false
    },
    {
      id: 2,
      name: 'Platinum',
      icon: '💎',
      deadline: '25, October 2035',
      points: 200,
      color: '#E5E4E2',
      locked: true
    },
    {
      id: 3,
      name: 'Silver',
      icon: '🥈',
      deadline: '25, October 2035',
      points: 200,
      color: '#C0C0C0',
      locked: true
    },
    {
      id: 4,
      name: 'Silver',
      icon: '🥈',
      deadline: '25, October 23',
      points: 200,
      color: '#C0C0C0',
      locked: true,
      hasImage: true
    }
  ];

  const stats = {
    dailyMacros: {
      protein: { value: 25, unit: 'g' },
      carb: { value: 20, unit: 'g' },
      fat: { value: 18, unit: 'g' }
    },
    foodsIntroduced: {
      total: 0,
      accepted: 2
    },
    learningModules: {
      watched: 1,
      accepted: 1,
      refused: 2
    },
    achievements: {
      streak: 3,
      totalXP: 1432,
      league: 'Bronze',
      topFinishes: 0
    },
    performance: {
      fruits: { answered: 3, total: 10, percentage: 33 },
      proteins: { answered: 8, total: 10, percentage: 80 },
      vegetables: { answered: 6, total: 10, percentage: 60 }
    }
  };

  const renderBadgeTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {badges.map((badge, index) => (
        <Animated.View
          key={badge.id}
          entering={FadeInUp.delay(index * 100).springify()}
        >
          <TouchableOpacity
            style={[
              styles.badgeCard,
              badge.locked && styles.badgeCardLocked
            ]}
            activeOpacity={0.8}
          >
            {badge.hasImage && (
              <Image 
                source={require('../../assets/images/food-bg.jpg')}
                style={styles.badgeImage}
              />
            )}
            
            <View style={styles.badgeContent}>
              <View style={styles.badgeInfo}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color + '30' }]}>
                  <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                </View>
                
                <View style={styles.badgeDetails}>
                  <Text style={[styles.badgeName, { color: badge.color }]}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDeadline}>
                    Deadline: {badge.deadline}
                  </Text>
                  <Text style={styles.badgePoints}>
                    Points: {badge.points}
                  </Text>
                  {badge.remaining && (
                    <Text style={styles.badgeRemaining}>
                      Earn: {badge.remaining} Remaining to earn this Badge
                    </Text>
                  )}
                </View>
              </View>
              
              {badge.locked && (
                <TouchableOpacity style={styles.lockButton}>
                  <Ionicons name="lock-closed" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );

  const renderStatsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Daily Macros */}
      <Animated.View entering={FadeInUp.springify()} style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Ionicons name="calendar" size={24} color={colors.primary} />
          <Text style={styles.statsTitle}>Daily Macros</Text>
        </View>
        <View style={styles.macrosGrid}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{stats.dailyMacros.protein.value}{stats.dailyMacros.protein.unit}</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{stats.dailyMacros.carb.value}{stats.dailyMacros.carb.unit}</Text>
            <Text style={styles.macroLabel}>Carb</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{stats.dailyMacros.fat.value}{stats.dailyMacros.fat.unit}</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </Animated.View>

      {/* Food & Learning Stats */}
      <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="restaurant" size={24} color={colors.primary} />
            <Text style={styles.statBoxTitle}>Foods Introduced</Text>
            <Text style={styles.statBoxValue}>{stats.foodsIntroduced.total}</Text>
            <Text style={styles.statBoxSubtext}>Introduced</Text>
            <Text style={styles.statBoxValue}>{stats.foodsIntroduced.accepted}</Text>
            <Text style={styles.statBoxSubtext}>Accepted</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="play-circle" size={24} color={colors.primary} />
            <Text style={styles.statBoxTitle}>Learning Modules</Text>
            <Text style={styles.statBoxValue}>{stats.learningModules.watched}</Text>
            <Text style={styles.statBoxSubtext}>Watched</Text>
            <Text style={styles.statBoxValue}>{stats.learningModules.accepted}</Text>
            <Text style={styles.statBoxSubtext}>Accepted</Text>
            <Text style={styles.statBoxValue}>{stats.learningModules.refused}</Text>
            <Text style={styles.statBoxSubtext}>Refused</Text>
          </View>
        </View>
      </Animated.View>

      {/* Statistics */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementItem}>
            <Ionicons name="flame" size={32} color={colors.primary} />
            <Text style={styles.achievementValue}>{stats.achievements.streak}</Text>
            <Text style={styles.achievementLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.achievementItem}>
            <Ionicons name="flash" size={32} color={colors.warning} />
            <Text style={styles.achievementValue}>{stats.achievements.totalXP}</Text>
            <Text style={styles.achievementLabel}>Total XP</Text>
          </View>
          
          <View style={styles.achievementItem}>
            <View style={styles.leagueBadge}>
              <Text style={styles.leagueEmoji}>🥉</Text>
            </View>
            <Text style={styles.achievementValue}>{stats.achievements.league}</Text>
            <Text style={styles.achievementLabel}>Current League</Text>
          </View>
          
          <View style={styles.achievementItem}>
            <Ionicons name="trophy" size={32} color={colors.info} />
            <Text style={styles.achievementValue}>{stats.achievements.topFinishes}</Text>
            <Text style={styles.achievementLabel}>Top 3 Finishes</Text>
          </View>
        </View>
      </Animated.View>

      {/* Performance Chart */}
      <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.chartCard}>
        <Text style={styles.chartTitle}>Top performance by category</Text>
        <TouchableOpacity style={styles.leaderboardButton}>
          <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
        </TouchableOpacity>
        
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
            <Text style={styles.legendText}>Fruits</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.info }]} />
            <Text style={styles.legendText}>Proteins</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF1493' }]} />
            <Text style={styles.legendText}>Vegitables</Text>
          </View>
        </View>
        
        <View style={styles.chart}>
          <View style={styles.chartBars}>
            <View style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: `${stats.performance.fruits.percentage}%`,
                    backgroundColor: colors.error 
                  }
                ]} 
              />
              <Text style={styles.chartBarLabel}>
                {stats.performance.fruits.answered}/{stats.performance.fruits.total}
              </Text>
              <Text style={styles.chartBarSublabel}>Answered</Text>
            </View>
            
            <View style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: `${stats.performance.proteins.percentage}%`,
                    backgroundColor: colors.info 
                  }
                ]} 
              />
              <Text style={styles.chartBarLabel}>
                {stats.performance.proteins.answered}/{stats.performance.proteins.total}
              </Text>
              <Text style={styles.chartBarSublabel}>Answered</Text>
            </View>
            
            <View style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: `${stats.performance.vegetables.percentage}%`,
                    backgroundColor: '#FF1493' 
                  }
                ]} 
              />
              <Text style={styles.chartBarLabel}>
                {stats.performance.vegetables.answered}/{stats.performance.vegetables.total}
              </Text>
              <Text style={styles.chartBarSublabel}>Answered</Text>
            </View>
          </View>
          
          <View style={styles.chartYAxis}>
            <Text style={styles.chartAxisLabel}>100%</Text>
            <Text style={styles.chartAxisLabel}>75%</Text>
            <Text style={styles.chartAxisLabel}>50%</Text>
            <Text style={styles.chartAxisLabel}>25%</Text>
            <Text style={styles.chartAxisLabel}>0%</Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
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
            <View>
              <Text style={styles.userName}>Laurentia Clarissa</Text>
              <View style={styles.premiumBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.text.inverse} />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="add-circle" size={20} color={colors.info} />
              <Text style={styles.statValue}>50</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color={colors.warning} />
              <Text style={styles.statValue}>50</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'badge' && styles.tabActive]}
            onPress={() => setActiveTab('badge')}
          >
            <Text style={[styles.tabText, activeTab === 'badge' && styles.tabTextActive]}>
              Badge
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
              Stats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'quests' && styles.tabActive]}
            onPress={() => navigation.navigate('Quests')}
          >
            <Text style={[styles.tabText, activeTab === 'quests' && styles.tabTextActive]}>
              Quests
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'badge' && renderBadgeTab()}
        {activeTab === 'stats' && renderStatsTab()}
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
    paddingBottom: 16,
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
    paddingHorizontal: 24,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 12,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.text.inverse,
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  // Badge styles
  badgeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  badgeCardLocked: {
    opacity: 0.7,
  },
  badgeImage: {
    width: '100%',
    height: 100,
    position: 'absolute',
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  badgeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  badgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeDetails: {
    flex: 1,
  },
  badgeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeDeadline: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  badgePoints: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  badgeRemaining: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  lockButton: {
    padding: 8,
  },
  // Stats styles
  statsCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginLeft: 8,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  macroLabel: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.text.inverse,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  statBoxValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statBoxSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: (width - 56) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  leagueBadge: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leagueEmoji: {
    fontSize: 32,
  },
  achievementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: 8,
  },
  achievementLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  // Chart styles
  chartCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 16,
  },
  leaderboardButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: colors.text.inverse,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  leaderboardButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  chartLegend: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: colors.text.inverse,
  },
  chart: {
    flexDirection: 'row',
    height: 200,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  chartBarSublabel: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.8,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  chartAxisLabel: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.8,
  },
});

export default BadgesScreen;