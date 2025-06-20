import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
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
import Button from '../../components/common/Button';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { getFoodById } from '../../db/foods';

const { width, height } = Dimensions.get('window');

const LearningModuleScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('food');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFoodDetail, setShowFoodDetail] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const modules = [
    {
      id: 'quiz',
      title: 'My Quizes',
      icon: '📝',
      description: 'Lorem ipsum dolor sit amet consectetur.',
      action: 'View Quiz'
    },
    {
      id: 'rewards',
      title: 'Rewards',
      icon: '🏆',
      description: 'Lorem ipsum dolor sit amet consectetur.',
      action: 'View Rewards'
    }
  ];

  const videos = [
    {
      id: 'fruits',
      title: 'Fruits',
      duration: '10 Min',
      thumbnail: '🍓',
      color: '#FF6B6B'
    },
    {
      id: 'dairy',
      title: 'Dairy',
      duration: '8 Min',
      thumbnail: '🥛',
      color: '#4ECDC4'
    }
  ];

  // Get tomato from database
  const foods = [getFoodById('tomato')].filter(Boolean);

  const handleModulePress = (moduleId) => {
    if (moduleId === 'quiz') {
      if (navigation) {
        navigation.navigate('Quiz');
      }
    } else if (moduleId === 'rewards') {
      setShowSuccessModal(true);
    }
  };

  const handleFoodPress = (food) => {
    setSelectedFood(food);
    setShowFoodDetail(true);
  };

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={FadeIn.springify()}
          style={styles.successModal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSuccessModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>📋</Text>
          </View>

          <Text style={styles.successTitle}>Task Completed successfully</Text>

          <Button
            title="Continue"
            onPress={() => setShowSuccessModal(false)}
            style={styles.continueButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );

  const FoodDetailModal = () => (
    <Modal
      visible={showFoodDetail}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={FadeIn.springify()}
          style={styles.foodDetailModal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFoodDetail(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          {selectedFood && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.foodDetailHeader}>
                <Image 
                  source={selectedFood.image} 
                  style={styles.foodDetailImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.foodDetailTitle}>
                🌱 What Is A {selectedFood.name}?
              </Text>
              <Text style={styles.foodDetailText}>
                A {selectedFood.name.toLowerCase()} is a round, juicy {selectedFood.category.slice(0, -1)} that many people
                think is a vegetable. Surprise! It's actually a {selectedFood.category.slice(0, -1)}
                because it has seeds inside. {selectedFood.name}es can be red,
                yellow, orange—even purple!
              </Text>

              <Text style={styles.foodDetailTitle}>
                🥄 What's Inside A {selectedFood.name}?
              </Text>
              <Text style={styles.foodDetailText}>
                {selectedFood.name}es are not just yummy—they're healthy too!
                Here's what you'll find inside a medium {selectedFood.name.toLowerCase()} (about
                the size of your fist):
              </Text>
              <Text style={styles.bulletPoint}>
                • Carbohydrates: {selectedFood.nutrients.carbs} grams
              </Text>
              <Text style={styles.bulletPoint}>
                • Protein: {selectedFood.nutrients.protein} grams
              </Text>
              <Text style={styles.bulletPoint}>
                • Fat: {selectedFood.nutrients.fiber} grams
              </Text>
              <Text style={styles.foodDetailText}>
                They're also full of water, so they keep you cool and
                refreshed!
              </Text>

              <Text style={styles.foodDetailTitle}>
                ✅ Where Do These Nutrients Come From?
              </Text>
              <Text style={styles.foodDetailText}>
                Let's break it down:
                {'\n'}• Carbohydrates come from the sugar and fiber
                inside the {selectedFood.name.toLowerCase()}. Plants make sugar from
                sunlight in a process called photosynthesis! 🌞
                {'\n'}• Protein comes from tiny building blocks called
                amino acids that the {selectedFood.name.toLowerCase()} plant makes as it
                grows.
                {'\n'}• Fat is very low in {selectedFood.name.toLowerCase()}es but comes from the
                natural oils in the seeds.
              </Text>

              <Text style={styles.foodDetailTitle}>
                🌱 How Are {selectedFood.name}es Grown?
              </Text>
              <Text style={styles.foodDetailText}>
                {selectedFood.name}es grow from tiny seeds. Here's how they
                grow:
                {'\n'}1. Plant the Seed - You put a small {selectedFood.name.toLowerCase()} seed into
                the soil.
                {'\n'}2. Water and Sun - The seed needs water and sunlight
                to grow.
                {'\n'}3. Sprout - A tiny plant comes out of the soil.
                {'\n'}4. Grow - The plant gets bigger and makes flowers.
                {'\n'}5. Fruit - The flowers turn into {selectedFood.name.toLowerCase()}es!
              </Text>

              <Text style={styles.foodDetailTitle}>
                🎉 Fun Fact!
              </Text>
              <Text style={styles.foodDetailText}>
                {selectedFood.name}es are actually fruits! Even though we
                often eat them like vegetables, they have seeds inside,
                which makes them fruits. They're also related to
                potatoes, peppers, and eggplants!
              </Text>
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
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
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
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
            style={[styles.tab, activeTab === 'food' && styles.tabActive]}
            onPress={() => setActiveTab('food')}
          >
            <Text style={[styles.tabText, activeTab === 'food' && styles.tabTextActive]}>
              Food
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
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
        {activeTab === 'learning' && (
          <>
            <Text style={styles.sectionTitle}>Learning Module</Text>
            <Text style={styles.sectionSubtitle}>
              Let's Explore What Your Child's Learning!
            </Text>

            <View style={styles.modulesGrid}>
              {modules.map((module, index) => (
                <Animated.View
                  key={module.id}
                  entering={FadeInUp.delay(index * 100).springify()}
                >
                  <TouchableOpacity
                    style={styles.moduleCard}
                    onPress={() => handleModulePress(module.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.moduleIcon}>
                      <Text style={styles.moduleEmoji}>{module.icon}</Text>
                    </View>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                    <Text style={styles.moduleDescription}>{module.description}</Text>
                    <Button
                      title={module.action}
                      onPress={() => handleModulePress(module.id)}
                      style={styles.moduleButton}
                    />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <View style={styles.videoSection}>
              {videos.map((video, index) => (
                <TouchableOpacity
                  key={video.id}
                  style={[styles.videoCard, { backgroundColor: video.color }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <View style={styles.videoThumbnail}>
                    <Text style={styles.videoEmoji}>{video.thumbnail}</Text>
                    <TouchableOpacity style={styles.playButton}>
                      <Ionicons name="play" size={32} color={colors.text.inverse} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.durationBar}>
                    <Text style={styles.durationText}>{video.duration}</Text>
                    <View style={styles.progressBar}>
                      <View style={styles.progressFill} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeTab === 'food' && (
          <>
            <Text style={styles.sectionTitle}>Learn About Foods</Text>
            <View style={styles.foodsGrid}>
              {foods.map((food, index) => (
                <TouchableOpacity
                  key={food.id}
                  style={styles.foodCard}
                  onPress={() => handleFoodPress(food)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.foodEmoji}>{food.image}</Text>
                  <Text style={styles.foodName}>{food.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <SuccessModal />
      <FoodDetailModal />
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  modulesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moduleCard: {
    width: (width - 56) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  moduleIcon: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleEmoji: {
    fontSize: 48,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  moduleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  videoSection: {
    marginBottom: 24,
  },
  videoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 12,
  },
  videoThumbnail: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoEmoji: {
    fontSize: 64,
    position: 'absolute',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBar: {
    marginTop: 12,
  },
  durationText: {
    fontSize: 14,
    color: colors.text.inverse,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    width: '30%',
    backgroundColor: colors.text.inverse,
    borderRadius: 2,
  },
  foodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodCard: {
    width: (width - 72) / 3,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 32,
    width: width - 48,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 64,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24,
  },
  continueButton: {
    width: '100%',
  },
  foodDetailModal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 24,
    width: width - 32,
    maxHeight: height * 0.8,
  },
  foodDetailHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  foodDetailImage: {
    width: 100,
    height: 100,
  },
  foodDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  foodDetailText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 16,
    marginBottom: 8,
  },
});

export default LearningModuleScreen;