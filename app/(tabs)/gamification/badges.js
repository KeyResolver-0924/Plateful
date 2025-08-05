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
  FadeInUp
} from 'react-native-reanimated';
import BadgePlatinum from '../../../assets/images/icons/badge_platinum.svg';
import BadgeSilver from '../../../assets/images/icons/badge_silver.svg';
import HeaderProfile from '../../../components/common/HeaderProfile';
import { colors } from '../../../constants/colors';


const { width } = Dimensions.get('window');

const BadgesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('badge');
  const [myBadge, setMyBadge] = useState({
    id: 1,
    name: 'Bronze',
    icon: require('../../../assets/images/icons/badge_bronze.svg'),
    deadline: '25, October 2025',
    points: 200,
    remaining: 850,
    color: '#CD7F32',
    locked: false
  });

  const badges = [
    {
      id: 1,
      name: 'Silver',
      icon: BadgeSilver,
      deadline: '05, April 2030',
      points: 200,
      locked: false
    },
    {
      id: 2,
      name: 'Platinum',
      icon: BadgePlatinum,
      deadline: '25, October 2035',
      points: 400,
      locked: true
    },
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
    <Animated.View
      // key={myBadge.id}
      // entering={FadeInUp.delay(index * 100).springify()}
    >
      <TouchableOpacity
        style={[
          styles.badgeCard,
          myBadge.locked && styles.badgeCardLocked
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.badgeContent}>
          <View style={styles.badgeInfo}>  
            <View style={styles.badgeDetails}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Text style={styles.badgeRemaining}>
                  Deadline:
                </Text>
                <Text style={styles.badgeRemainingtxt}>
                  {myBadge.deadline}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Text style={styles.badgeRemaining}>
                  Points:
                </Text>
                <Text style={styles.badgeRemainingtxt}>
                  {myBadge.points}
                </Text>
              </View>
              {myBadge.remaining && (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <Text style={styles.badgeRemaining}>
                  Earn:
                  </Text>
                  <Text style={styles.badgeRemainingtxt}>
                    {myBadge.remaining} Remaining to earn this Badge
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.badgeIcon}>
              <Image source={myBadge.icon} style={{width: 60, height: 60}} />
              <Text style={[styles.badgeName, { color: myBadge.color }]}>
                {myBadge.name}
              </Text>
            </View>
          </View>
          
          {myBadge.locked && (
            <TouchableOpacity style={styles.lockButton}>
              <Ionicons name="lock-closed" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
        {badges.map((badge) => (
          <View style={styles.badgeContent}>
            <View style={styles.badgeInfo1}>
              <View style={styles.badgeIcon1}>
                <Image source={badge.icon} style={{width: 40, height: 40}} />
                <Text style={[styles.badgeName1, { color: colors.primary }]}>
                  {badge.name}
                </Text>
              </View>  
              <View style={styles.badgeDetails}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <Text style={styles.badgeRemaining}>
                    Deadline:
                  </Text>
                  <Text style={styles.badgeRemainingtxt}>
                    {badge.deadline}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <Text style={styles.badgeRemaining}>
                    Points:
                  </Text>
                  <Text style={styles.badgeRemainingtxt}>
                    {badge.points}
                  </Text>
                </View>
              </View>
              {badge.locked && (
                  <TouchableOpacity style={styles.lockButton}>
                    <Ionicons name="lock-closed" size={24} color={colors.text.secondary} />
                  </TouchableOpacity>
                )}
            </View>
          </View>
        ))}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStatsTab = () => (
    <View>
      {/* Daily Macros */}
      <Animated.View entering={FadeInUp.springify()} style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <View style={styles.listItem}>
            <Image source={require('../../../assets/images/icons/calendar.svg')} style={{width: 25, height: 25}} />
            <Text style={styles.statsTitle}>Daily Macro</Text>
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
        </View>
        <View style={styles.statsHeader1}>
          <View style={styles.listItem}>
            <Image source={require('../../../assets/images/icons/fruit_white.svg')} style={{width: 25, height: 25}} />
            <Text style={styles.statsTitle}>Food Introduced</Text>
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
        </View>
        <View style={styles.statsHeader}>
          <View style={styles.listItem}>
            <Image source={require('../../../assets/images/icons/learning_video.svg')} style={{width: 25, height: 25}} />
            <Text style={styles.statsTitle}>Learning Modules</Text>
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
        </View>
      </Animated.View>

      {/* Statistics */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementItem}>
            <Image source={require('../../../assets/images/icons/fire.svg')} style={{width: 32, height: 32}} />
            <View>
              <Text style={styles.achievementValue}>{stats.achievements.streak}</Text>
              <Text style={styles.achievementLabel}>Day Streak</Text>
            </View>
          </View>
          
          <View style={styles.achievementItem}>
            <Image source={require('../../../assets/images/icons/flash.svg')} style={{width: 32, height: 32}} />
            <View>
              <Text style={styles.achievementValue}>{stats.achievements.totalXP}</Text>
              <Text style={styles.achievementLabel}>Total XP</Text>
            </View>
          </View>
          
          <View style={styles.achievementItem}>
            <View style={styles.leagueBadge}>
              <Image source={require('../../../assets/images/icons/bronze_medal.svg')} style={{width: 50, height: 50}} />
            </View>
            <View>
              <Text style={styles.achievementValue}>{stats.achievements.league}</Text>
              <Text style={styles.achievementLabel}>Current League</Text>
            </View>
          </View>
          
          <View style={styles.achievementItem}>
            <Image source={require('../../../assets/images/icons/top-medal.svg')} style={{width: 50, height: 50}} />
            <View>
              <Text style={styles.achievementValue}>{stats.achievements.topFinishes}</Text>
              <Text style={styles.achievementLabel}>Top 3</Text>
            </View>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderProfile/>
      <View style={styles.contentContainer}>
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
        </View>
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'badge' && renderBadgeTab()}
          {activeTab === 'stats' && renderStatsTab()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap:50,
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
    color: colors.text.grey,
  },
  tabTextActive: {
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 2, // This creates space between text and underline
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Badge styles
  badgeCard: {
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
    borderWidth: 1,
    borderColor: colors.whiteGrey,
    borderRadius: 16,
    width: width - 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  badgeInfo1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.whiteGrey,
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: width - 20,
    paddingHorizontal: 20,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 10,
    flexDirection: 'column',
  },
  badgeIcon1: {
    borderRadius: 32,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeDetails: {
    flex: 1,
    gap: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeName1: {
    fontSize: 16,
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
  badgeRemainingtxt: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  lockButton: {
    padding: 8,
  },
  // Stats styles
  statsCard: {
    backgroundColor: colors.goldB,
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 10,
    width: width - 30,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsHeader: {
    flexDirection: 'column',
    gap:8,
    alignItems: 'center',
    marginBottom: 16,
    flex: 1,
  },
  statsHeader1: {
    flexDirection: 'column',
    gap:8,
    alignItems: 'center',
    marginBottom: 16,
    flex: 1,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  statsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
    opacity: 0.5,
    marginLeft: 8,
  },
  macrosGrid: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    flexDirection: 'Row',
    gap: 30,
  },
  macroValue: {
    fontSize: 9,
    color: colors.text.inverse,
  },
  macroLabel: {
    fontSize: 9,
    color: colors.text.inverse,
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
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
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
    flexDirection: 'row',
    gap: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.goldB,
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
    width: '60%',
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