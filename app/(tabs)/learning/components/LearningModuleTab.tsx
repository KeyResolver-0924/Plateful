import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInUp,
  SlideInUp
} from 'react-native-reanimated';
import Button from '../../../../components/common/Button';
import { colors } from '../../../../constants/colors';

const { width } = Dimensions.get('window');

interface NavigationProp {
  navigate: (screen: string) => void;
}

interface LearningModuleTabProps {
  navigation?: NavigationProp;
}

interface Module {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  description: string;
  action: string;
  color: string;
  gradient: string[];
  progress?: number;
  isUnlocked: boolean;
}

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  color: string;
  category: string;
  isPremium: boolean;
}

const LearningModuleTab: React.FC<LearningModuleTabProps> = ({ navigation }) => {
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // Enhanced modules with better visual design
  const modules: Module[] = [
    {
      id: 'quiz',
      title: 'Food Quest',
      icon: require('../../../../assets/images/characters/zicon (40).png'),
      description: 'Embark on an exciting journey through food knowledge with interactive quizzes and challenges.',
      action: 'Start Quest',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#45A049'],
      progress: 75,
      isUnlocked: true
    },
    {
      id: 'rewards',
      title: 'Achievement Hall',
      icon: require('../../../../assets/images/characters/zicon (24).png'),
      description: 'Celebrate your accomplishments and collect badges for your food knowledge mastery.',
      action: 'View Achievements',
      color: '#FF9800',
      gradient: ['#FF9800', '#F57C00'],
      progress: 60,
      isUnlocked: true
    },
    {
      id: 'learning',
      title: 'Knowledge Library',
      icon: require('../../../../assets/images/characters/learn.png'),
      description: 'Access comprehensive learning materials and educational content about healthy eating.',
      action: 'Explore Library',
      color: '#2196F3',
      gradient: ['#2196F3', '#1976D2'],
      progress: 30,
      isUnlocked: false
    },
    {
      id: 'challenges',
      title: 'Daily Challenges',
      icon: require('../../../../assets/images/characters/fire.png'),
      description: 'Take on daily food challenges to keep your knowledge fresh and earn bonus rewards.',
      action: 'View Challenges',
      color: '#E91E63',
      gradient: ['#E91E63', '#C2185B'],
      progress: 0,
      isUnlocked: false
    }
  ];

  // Enhanced video content
  const videos: Video[] = [
    {
      id: 'fruits',
      title: 'Fruits & Berries',
      duration: '10 Min',
      thumbnail: '🍓',
      color: '#FF6B6B',
      category: 'Nutrition Basics',
      isPremium: false
    },
    {
      id: 'dairy',
      title: 'Dairy & Alternatives',
      duration: '8 Min',
      thumbnail: '🥛',
      color: '#4ECDC4',
      category: 'Essential Nutrients',
      isPremium: false
    },
    {
      id: 'proteins',
      title: 'Protein Power',
      duration: '12 Min',
      thumbnail: '🥩',
      color: '#45B7D1',
      category: 'Building Blocks',
      isPremium: true
    },
    {
      id: 'vegetables',
      title: 'Veggie Variety',
      duration: '15 Min',
      thumbnail: '🥦',
      color: '#96CEB4',
      category: 'Health & Wellness',
      isPremium: false
    }
  ];

  const handleModulePress = (module: Module): void => {
    if (!module.isUnlocked) {
      // Show locked modal or upgrade prompt
      return;
    }

    if (module.id === 'quiz') {
      if (navigation) {
        navigation.navigate('Quiz');
      }
    } else if (module.id === 'rewards') {
      setSelectedModule(module);
      setShowSuccessModal(true);
    } else {
      // Handle other modules
      setSelectedModule(module);
      setShowSuccessModal(true);
    }
  };

  const SuccessModal: React.FC = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={SlideInUp.springify()}
          style={styles.successModal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSuccessModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.successIcon}>
            <Image 
              source={selectedModule?.icon || require('../../../../assets/images/characters/zicon (26).png')} 
              style={styles.successEmoji} 
            />
          </View>

          <Text style={styles.successTitle}>
            {selectedModule?.title || 'Module'} Unlocked!
          </Text>
          
          <Text style={styles.successDescription}>
            {selectedModule?.description || 'You\'ve successfully unlocked this learning module. Start exploring now!'}
          </Text>

          <Button
            title="Continue Learning"
            onPress={() => setShowSuccessModal(false)}
            style={styles.continueButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );

  const renderProgressBar = (progress: number, color: string) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { 
              width: `${progress}%`,
              backgroundColor: color
            }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{progress}% Complete</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
        <Text style={styles.sectionTitle}>Learning Hub</Text>
        <Text style={styles.sectionSubtitle}>
          Discover, Learn, and Master Food Knowledge! 🍎🥦
        </Text>
      </Animated.View>

      <View style={styles.modulesGrid}>
        {modules.map((module: Module, index: number) => (
          <Animated.View
            key={module.id}
            entering={FadeInUp.delay(index * 150).springify()}
            style={styles.moduleCardContainer}
          >
            <TouchableOpacity
              style={[
                styles.moduleCard,
                { borderColor: module.color },
                !module.isUnlocked && styles.lockedModuleCard
              ]}
              onPress={() => handleModulePress(module)}
              activeOpacity={0.8}
              disabled={!module.isUnlocked}
            >
              <View style={styles.moduleHeader}>
                <View style={[styles.moduleIcon, { backgroundColor: module.color + '20' }]}>
                  <Image source={module.icon} style={styles.moduleEmoji} />
                </View>
                {!module.isUnlocked && (
                  <View style={styles.lockIcon}>
                    <Ionicons name="lock-closed" size={16} color="#666" />
                  </View>
                )}
              </View>
              
              <Text style={[
                styles.moduleTitle,
                !module.isUnlocked && styles.lockedModuleTitle
              ]}>
                {module.title}
              </Text>
              
              <Text style={[
                styles.moduleDescription,
                !module.isUnlocked && styles.lockedModuleDescription
              ]}>
                {module.description}
              </Text>
              
              {module.isUnlocked && module.progress !== undefined && (
                renderProgressBar(module.progress, module.color)
              )}
              
                              <Button
                  title={module.isUnlocked ? module.action : 'Locked'}
                  onPress={() => handleModulePress(module)}
                  style={module.isUnlocked ? styles.moduleButton : [styles.moduleButton, styles.lockedModuleButton] as any}
                  disabled={!module.isUnlocked}
                />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.videoSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.videoSectionTitle}>Learning Videos</Text>
          <Text style={styles.videoSectionSubtitle}>Watch and learn from expert content</Text>
        </View>
        
        {videos.map((video: Video, index: number) => (
          <Animated.View
            key={video.id}
            entering={FadeInLeft.delay(700 + index * 100).springify()}
          >
            <TouchableOpacity
              style={[styles.videoCard, { backgroundColor: video.color }]}
              activeOpacity={0.8}
            >
              <View style={styles.videoContent}>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoCategory}>{video.category}</Text>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <View style={styles.videoMeta}>
                    <View style={styles.durationBadge}>
                      <Ionicons name="time-outline" size={14} color="white" />
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>
                    {video.isPremium && (
                      <View style={styles.premiumBadge}>
                        <Ionicons name="diamond" size={14} color="#FFD700" />
                        <Text style={styles.premiumText}>Premium</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.videoThumbnail}>
                  <Text style={styles.videoEmoji}>{video.thumbnail}</Text>
                  <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="play" size={32} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>

      <SuccessModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  moduleCardContainer: {
    width: (width - 56) / 2,
    marginBottom: 16,
  },
  moduleCard: {
    backgroundColor: colors.background2,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 200,
  },
  lockedModuleCard: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  moduleHeader: {
    position: 'relative',
    marginBottom: 16,
  },
  moduleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleEmoji: {
    width: 48,
    height: 48,
  },
  lockIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedModuleTitle: {
    color: '#999',
  },
  moduleDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  lockedModuleDescription: {
    color: '#bbb',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  moduleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 100,
  },
  lockedModuleButton: {
    backgroundColor: '#ddd',
    opacity: 0.7,
  },
  videoSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  videoSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  videoSectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  videoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  videoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoInfo: {
    flex: 1,
    marginRight: 20,
  },
  videoCategory: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    lineHeight: 24,
  },
  videoMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  videoThumbnail: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoEmoji: {
    fontSize: 48,
    position: 'absolute',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 32,
    width: width - 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  successIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    width: 80,
    height: 80,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  continueButton: {
    width: '100%',
    paddingVertical: 12,
  },
});

export default LearningModuleTab;
