import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
    FadeInUp,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const LeaderboardScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [timeRemaining] = useState('06d 23h 00m');
  
  const topThree = [
    {
      id: 1,
      rank: 2,
      name: 'Alena Donin',
      country: '🇫🇷',
      points: '1,469 QP',
      avatar: require('../../assets/images/avatars/user2.jpg')
    },
    {
      id: 2,
      rank: 1,
      name: 'Davis Curtis',
      country: '🇺🇸',
      points: '2,569 QP',
      avatar: require('../../assets/images/avatars/user1.jpg'),
      isWinner: true
    },
    {
      id: 3,
      rank: 3,
      name: 'Craig Gouse',
      country: '🇨🇦',
      points: '1,053 QP',
      avatar: require('../../assets/images/avatars/user3.jpg')
    }
  ];

  const leaderboard = [
    { id: 4, rank: 4, name: 'Madelyn Dias', country: '🇧🇷', points: 590, avatar: null },
    { id: 5, rank: 5, name: 'Zain Vaccaro', country: '🇮🇹', points: 448, avatar: null },
    { id: 6, rank: 6, name: 'Skylar Geidt', country: '🇨🇿', points: 448, avatar: null },
    { id: 7, rank: 7, name: 'Justin Bator', country: '🇳🇴', points: 448, avatar: null },
    { id: 8, rank: 8, name: 'Cooper Lipshutz', country: '🇩🇪', points: 448, avatar: null },
    { id: 9, rank: 9, name: 'Alfredo Septimus', country: '🇮🇹', points: 447, avatar: null },
  ];

  const PodiumPlace = ({ user, index }) => {
    const scale = useSharedValue(0);
    
    React.useEffect(() => {
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 100,
      });
    }, []);
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const podiumHeight = user.rank === 1 ? 120 : user.rank === 2 ? 90 : 70;
    
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 200).springify()}
        style={[
          styles.podiumPlace,
          user.rank === 1 && styles.winnerPlace
        ]}
      >
        {user.rank === 1 && (
          <View style={styles.crownContainer}>
            <Text style={styles.crown}>👑</Text>
          </View>
        )}
        
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={user.avatar} style={styles.podiumAvatar} />
        </TouchableOpacity>
        
        <Text style={styles.podiumName}>{user.name}</Text>
        <Text style={styles.podiumCountry}>{user.country}</Text>
        <Text style={styles.podiumPoints}>{user.points}</Text>
        
        <Animated.View
          style={[
            animatedStyle,
            styles.podium,
            { height: podiumHeight },
            user.rank === 1 && styles.goldPodium,
            user.rank === 2 && styles.silverPodium,
            user.rank === 3 && styles.bronzePodium,
          ]}
        >
          <Text style={styles.podiumRank}>{user.rank}</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  const LeaderboardItem = ({ user, index }) => {
    return (
      <Animated.View
        entering={SlideInRight.delay(index * 50).springify()}
      >
        <TouchableOpacity
          style={styles.leaderboardItem}
          activeOpacity={0.8}
        >
          <View style={styles.rankContainer}>
            <Text style={styles.rankText}>{user.rank}</Text>
          </View>
          
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              {user.avatar ? (
                <Image source={user.avatar} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: getAvatarColor(user.rank) }]}>
                  <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPoints}>{user.points} points</Text>
            </View>
          </View>
          
          <Text style={styles.userCountry}>{user.country}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getAvatarColor = (rank) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    return colors[rank % colors.length];
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Leaderboard</Text>
        
        <View style={styles.headerRight}>
          <View style={styles.userProfile}>
            <Image 
              source={require('../../assets/images/avatars/user.jpg')}
              style={styles.headerAvatar}
            />
            <Text style={styles.headerName}>Laurentia Clarissa</Text>
            <View style={styles.premiumBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.premiumText}>Premium</Text>
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
      </View>

      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'weekly' && styles.tabActive]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'alltime' && styles.tabActive]}
            onPress={() => setActiveTab('alltime')}
          >
            <Text style={[styles.tabText, activeTab === 'alltime' && styles.tabTextActive]}>
              All Time
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Ranking Card */}
        <Animated.View
          entering={FadeIn.springify()}
          style={styles.userRankCard}
        >
          <View style={styles.rankBadge}>
            <Text style={styles.rankBadgeText}>#4</Text>
          </View>
          <Text style={styles.userRankText}>
            You're doing better than 60%{'\n'}of other players!
          </Text>
        </Animated.View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.timerText}>{timeRemaining}</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top 3 Podium */}
          <View style={styles.podiumContainer}>
            <PodiumPlace user={topThree[0]} index={0} />
            <PodiumPlace user={topThree[1]} index={1} />
            <PodiumPlace user={topThree[2]} index={2} />
          </View>

          {/* Rest of Leaderboard */}
          <View style={styles.leaderboardContainer}>
            {leaderboard.map((user, index) => (
              <LeaderboardItem key={user.id} user={user} index={index} />
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
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerName: {
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 4,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  userRankCard: {
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
  rankBadgeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  userRankText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 22,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 40,
  },
  podiumPlace: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  winnerPlace: {
    marginBottom: 20,
  },
  crownContainer: {
    position: 'absolute',
    top: -30,
    zIndex: 1,
  },
  crown: {
    fontSize: 32,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: colors.background,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  podiumCountry: {
    fontSize: 20,
    marginBottom: 4,
  },
  podiumPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  podium: {
    width: 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  goldPodium: {
    backgroundColor: '#FFD700',
  },
  silverPodium: {
    backgroundColor: '#C0C0C0',
  },
  bronzePodium: {
    backgroundColor: '#CD7F32',
  },
  podiumRank: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  leaderboardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rankContainer: {
    width: 32,
    marginRight: 12,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  userPoints: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  userCountry: {
    fontSize: 20,
    marginLeft: 12,
  },
});

export default LeaderboardScreen;