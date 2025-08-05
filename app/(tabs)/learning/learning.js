import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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
import Button from '../../../components/common/Button';
import HeaderProfile from '../../../components/common/HeaderProfile';
import { colors } from '../../../constants/colors';

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
      icon: require('../../../assets/images/characters/zicon (40).png'),
      description: 'Lorem ipsum dolor sit amet consectetur.',
      action: 'View Quiz'
    },
    {
      id: 'rewards',
      title: 'Rewards',
      icon: require('../../../assets/images/characters/zicon (24).png'),
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
            <Image source={require('../../../assets/images/characters/zicon (26).png')} style={styles.successEmoji} />
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
                think is a vegetable. Surprise! It&apos;s actually a {selectedFood.category.slice(0, -1)}
                because it has seeds inside. {selectedFood.name}es can be red,
                yellow, orange—even purple!
              </Text>

              <Text style={styles.foodDetailTitle}>
                🥄 What&apos;s Inside A {selectedFood.name}?
              </Text>
              <Text style={styles.foodDetailText}>
                {selectedFood.name}es are not just yummy—they&apos;re healthy too!
                Here&apos;s what you&apos;ll find inside a medium {selectedFood.name.toLowerCase()} (about
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
                They&apos;re also full of water, so they keep you cool and
                refreshed!
              </Text>

              <Text style={styles.foodDetailTitle}>
                ✅ Where Do These Nutrients Come From?
              </Text>
              <Text style={styles.foodDetailText}>
                Let&apos;s break it down:
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
                {selectedFood.name}es grow from tiny seeds. Here&apos;s how they
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
                which makes them fruits. They&apos;re also related to
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
      <View style={styles.header}>
        <HeaderProfile />
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'food' && styles.tabActive]}
            onPress={() => setActiveTab('food')}
          >
            <Text style={[styles.tabText, activeTab === 'food' && styles.tabTextActive]}>
              Quests
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
              Let&apos;s Explore What Your Child&apos;s Learning!
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
                      <Image source={module.icon} style={styles.moduleEmoji} />
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
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeTab === 'food' && (
          <>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flexDirection: 'column', gap: 40 }}>
              <View>
                <Text style={styles.quizText}>Start</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../assets/images/characters/zicon (14).png')} style={{ width: 90, height: 80}} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../assets/images/characters/box.png')} style={styles.quizBox1} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../assets/images/characters/star-grey.png')} style={styles.quizBox2} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../assets/images/characters/zicon (21).png')} style={styles.quizBox3} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../assets/images/characters/zicon (22).png')} style={styles.quizBox4} />
              </View>
            </ScrollView>
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
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontSize: 17,
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
    backgroundColor: colors.background2,
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
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.green,
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  moduleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
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
  foodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    width: 120,
    height: 120,
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
  quizText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  quizBox1: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: -170,
    width: 90,
    height: 90,
  },
  quizBox2: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: -90,
    width: 90,
    height: 80,
  },
  quizBox3: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    width: 90,
    height: 80,
  },
  quizBox4: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 150,
    width: 90,
    height: 80,
  },
});

export default LearningModuleScreen;