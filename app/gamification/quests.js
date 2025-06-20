import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Easing,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const QuestsScreen = ({ navigation }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  
  const questPath = [
    { id: 1, type: 'start', status: 'completed', icon: '⭐' },
    { id: 2, type: 'chest', status: 'locked', icon: '🎁' },
    { id: 3, type: 'quest', status: 'locked', icon: '⭐' },
    { id: 4, type: 'challenge', status: 'locked', icon: '📚' },
    { id: 5, type: 'boss', status: 'locked', icon: '🏆' },
    { id: 6, type: 'chest', status: 'locked', icon: '🎁' },
  ];

  const gameStats = {
    streak: 1,
    coins: 505,
    hearts: 5
  };

  const QuestNode = ({ quest, index }) => {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scale.value },
          { rotate: `${rotation.value}deg` }
        ],
      };
    });

    const handlePress = () => {
      if (quest.status === 'completed' || quest.id === currentLevel + 1) {
        scale.value = withSpring(0.9, {}, () => {
          scale.value = withSpring(1);
        });
        
        if (quest.id === 1) {
          // Start quest animation
          rotation.value = withTiming(360, {
            duration: 600,
            easing: Easing.out(Easing.cubic)
          });
        }
      }
    };

    const isAccessible = quest.status === 'completed' || quest.id === currentLevel + 1;
    
    // Zigzag pattern positioning
    const leftPosition = index % 2 === 0 ? width * 0.25 : width * 0.55;
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 200).springify()}
        style={[
          styles.questNode,
          {
            left: leftPosition,
            top: index * 150,
          }
        ]}
      >
        {/* Connection line to next node */}
        {index < questPath.length - 1 && (
          <View
            style={[
              styles.connectionLine,
              {
                transform: [
                  { rotate: index % 2 === 0 ? '45deg' : '-45deg' }
                ],
              }
            ]}
          />
        )}
        
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            style={[
              styles.questButton,
              quest.status === 'completed' && styles.questCompleted,
              quest.status === 'locked' && styles.questLocked,
              quest.type === 'chest' && styles.questChest,
              quest.type === 'boss' && styles.questBoss,
            ]}
            onPress={handlePress}
            disabled={!isAccessible}
            activeOpacity={0.8}
          >
            {quest.type === 'start' && (
              <View style={styles.startBadge}>
                <Text style={styles.startText}>START</Text>
              </View>
            )}
            
            <Text style={styles.questIcon}>{quest.icon}</Text>
            
            {quest.status === 'locked' && (
              <View style={styles.lockOverlay}>
                <Ionicons name="lock-closed" size={24} color={colors.text.secondary} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
        </TouchableOpacity>
        
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color={colors.warning} />
            <Text style={styles.statValue}>{gameStats.streak}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color={colors.warning} />
            <Text style={styles.statValue}>{gameStats.coins}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="heart" size={20} color={colors.error} />
            <Text style={styles.statValue}>{gameStats.hearts}</Text>
          </View>
        </View>
      </View>

      {/* Quest Path */}
      <ScrollView
        style={styles.questPath}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.questPathContent}
      >
        <View style={[styles.pathContainer, { height: questPath.length * 150 + 100 }]}>
          {questPath.map((quest, index) => (
            <QuestNode key={quest.id} quest={quest} index={index} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Badges')}
        >
          <Text style={styles.navButtonText}>Badge</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Badges', { tab: 'stats' })}
        >
          <Text style={styles.navButtonText}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonActive]}
        >
          <Text style={[styles.navButtonText, styles.navButtonTextActive]}>Quests</Text>
          <View style={styles.navIndicator} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginLeft: 6,
  },
  questPath: {
    flex: 1,
  },
  questPathContent: {
    paddingVertical: 40,
  },
  pathContainer: {
    position: 'relative',
  },
  questNode: {
    position: 'absolute',
    alignItems: 'center',
  },
  connectionLine: {
    position: 'absolute',
    width: 100,
    height: 2,
    backgroundColor: colors.border,
    top: 50,
    left: 35,
    transformOrigin: 'left center',
  },
  questButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    boxShadow: `0 4px 6px ${colors.shadow.dark}40`,
  },
  questCompleted: {
    backgroundColor: colors.primary,
  },
  questLocked: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  questChest: {
    backgroundColor: colors.warning,
  },
  questBoss: {
    backgroundColor: colors.error,
  },
  startBadge: {
    position: 'absolute',
    top: -25,
    backgroundColor: colors.text.inverse,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    boxShadow: `0 2px 4px ${colors.shadow.dark}20`,
  },
  startText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  questIcon: {
    fontSize: 36,
  },
  lockOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonActive: {
    position: 'relative',
  },
  navButtonText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  navButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  navIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 40,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

export default QuestsScreen;