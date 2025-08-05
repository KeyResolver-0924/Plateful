import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import Button from '../../../components/common/Button';
import { colors } from '../../../constants/colors';
import { getAllFoods } from '../../../db/foods';
const { width } = Dimensions.get('window');

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

const MealTrackingScreen = ({ navigation }: { navigation: NavigationProps }) => {
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const mealTypes = [
    { id: 'breakfast', name: 'Break Fast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'dessert', name: 'Dessert' },
    { id: 'snack', name: 'Snack' }
  ];

  // Get all foods from database
  const foods = getAllFoods();

  const FoodItem = ({ food, index }: { food: any, index: number }) => {
    const isSelected = selectedFoods.includes(food.id);
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
      
      if (isSelected) {
        setSelectedFoods(selectedFoods.filter(id => id !== food.id));
      } else {
        setSelectedFoods([...selectedFoods, food.id]);
      }
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).springify()}
        style={animatedStyle}
      >
        <TouchableOpacity
          style={[
            styles.foodItem,
            isSelected && styles.foodItemSelected
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={styles.foodImageContainer}>
            <Image 
              source={food.icon} 
              style={styles.foodImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.foodName}>{food.name}</Text>
          {isSelected && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleNext = () => {
    if (selectedFoods.length > 0) {
      setShowPairingModal(true);
    }
  };

  const handlePairing = () => {
    setShowPairingModal(false);
    setShowReportModal(true);
  };

  const handleContinueToReports = () => {
    setShowReportModal(false);
    navigation.navigate('MealHistory');
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
          style={styles.modal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSuccessModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.modalIcon}>
            <Text style={styles.modalEmoji}>📋</Text>
          </View>

          <Text style={styles.modalTitle}>Task Completed successfully</Text>

          <Button
            title="Continue"
            onPress={() => setShowSuccessModal(false)}
            style={styles.modalButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );

  const PairingModal = () => (
    <Modal
      visible={showPairingModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={FadeIn.springify()}
          style={styles.modal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPairingModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.caloriesText}>65 Calories</Text>

          <View style={styles.pairingImage}>
            <Image source={require('../../../assets/images/logo/1.png')} style={{width: 180, height: 170}} />
          </View>

          <Text style={styles.modalTitle}>Time To Eat</Text>

          <Button
            title="Pairing"
            onPress={handlePairing}
            style={styles.modalButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );

  const ReportModal = () => (
    <Modal
      visible={showReportModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={FadeIn.springify()}
          style={styles.modal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowReportModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Time To Eat</Text>

          <View style={styles.plateImage}>
            <Image source={require('../../../assets/images/logo/platefull-logo.png')} style={{width: 180, height: 170}} />
          </View>

          <Button
            title="Continue to Reports"
            onPress={handleContinueToReports}
            style={styles.modalButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Meal</Text>
        
        <View style={styles.headerImage}>
          <Image source={require('../../../assets/images/characters/meal_fruit_logo.png')} style={styles.headerImage1} />
        </View>
        <Text style={styles.title}>Which Meal Are You Eating</Text>
        <Text style={styles.subtitle}>Select Meal Type</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor={colors.text.secondary}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mealTypes}
          contentContainerStyle={styles.mealTypesContent}
        >
          {mealTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.mealTypeButton,
                selectedMealType === type.id && styles.mealTypeButtonActive
              ]}
              onPress={() => setSelectedMealType(type.id)}
            >
              <Text style={[
                styles.mealTypeText,
                selectedMealType === type.id && styles.mealTypeTextActive
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Select Food You're Eating</Text>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.foodGrid}>
            {foods.map((food, index) => (
              <FoodItem key={food.id} food={food} index={index} />
            ))}
          </View>
        </ScrollView>

        {selectedFoods.length > 0 && (
          <Animated.View 
            entering={FadeIn.springify()}
            style={styles.footer}
          >
            <Button
              title={`Continue with ${selectedFoods.length} items`}
              onPress={handleNext}
              style={styles.continueButton}
            />
          </Animated.View>
        )}
      </View>

      <SuccessModal />
      <PairingModal />
      <ReportModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 25,
    width: 40,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text.inverse,
    marginBottom: 20,
  },
  headerImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage1: {
    width: 150,
    height: 140,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  mealTypes: {
    marginBottom:10,
  },
  mealTypesContent: {
    paddingRight: 24,
  },
  mealTypeButton: {
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    paddingBottom: 23,
    marginBottom: 20,
  },
  mealTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  mealTypeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  mealTypeTextActive: {
    color: colors.text.inverse,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  foodItemSelected: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
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
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    width: '100%',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
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
  modalIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalEmoji: {
    fontSize: 64,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 20,
  },
  pairingImage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  plateImage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default MealTrackingScreen;