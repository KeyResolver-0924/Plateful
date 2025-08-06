import { Ionicons } from '@expo/vector-icons';
import React from 'react';
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
import { colors } from '../../../constants/colors';

const { width, height } = Dimensions.get('window');

interface FoodDetailModalProps {
  visible: boolean;
  onClose: () => void;
  foodData: any;
}

const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  visible,
  onClose,
  foodData
}) => {
  if (!foodData) return null;

  const getFoodImage = (foodName: string) => {
    const imageMap: { [key: string]: any } = {
      // Fruits
      apple: require('../../../assets/images/foods/apple.png'),
      pear: require('../../../assets/images/foods/pear.png'),
      banana: require('../../../assets/images/foods/banana.png'),
      orange: require('../../../assets/images/foods/orange.png'),
      pineapple: require('../../../assets/images/foods/pineapple.png'),
      strawberry: require('../../../assets/images/foods/strawberry.png'),
      grapes: require('../../../assets/images/foods/grapes.png'),
      watermelon: require('../../../assets/images/foods/watermelon.png'),
      mango: require('../../../assets/images/foods/mango.png'),
      peach: require('../../../assets/images/foods/peach.png'),
      apricot: require('../../../assets/images/foods/apricot.png'),
      
      // Vegetables
      carrots: require('../../../assets/images/foods/carrot.png'),
      broccoli: require('../../../assets/images/foods/broccoli.png'),
      sweet_potato: require('../../../assets/images/foods/sweetpotato.png'),
      peas: require('../../../assets/images/foods/peas.png'),
      corn: require('../../../assets/images/foods/maize .png'),
      cucumber: require('../../../assets/images/foods/cucumber.png'),
      bell_peppers: require('../../../assets/images/foods/bellpepper.png'),
      spinach: require('../../../assets/images/foods/spinach.png'),
      tomato: require('../../../assets/images/foods/tomato.png'),
      cabbage: require('../../../assets/images/foods/cabbage.png'),
      
      // Proteins
      chicken: require('../../../assets/images/foods/chicken.png'),
      fish: require('../../../assets/images/foods/fish.png'),
      egg: require('../../../assets/images/foods/egg.png'),
      beans: require('../../../assets/images/foods/beans.png'),
      lentils: require('../../../assets/images/foods/lentils.png'),
      tofu: require('../../../assets/images/foods/tofu.png'),
      lean_beef: require('../../../assets/images/foods/beef.png'),
      turkey: require('../../../assets/images/foods/turkey.png'),
      nuts: require('../../../assets/images/foods/nuts.png'),
    };
    
    const foodKey = foodData.name.toLowerCase().replace(/\s+/g, '_');
    return imageMap[foodKey] || require('../../../assets/images/foods/apple.png');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <View style={styles.foodCharacter}>
                <Image 
                  source={getFoodImage(foodData.name)} 
                  style={styles.foodImage}
                />
              </View>
              <Text style={styles.modalTitle}>Learn {foodData.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalBody} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* What Is This Food? */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Image source={getFoodImage(foodData.name)} style={styles.sectionIcon}/>
                <Text style={styles.sectionTitle}>What Is {foodData.name}?</Text>
              </View>
              <Text style={styles.sectionText}>
                {foodData.description}
              </Text>
            </View>

            {/* What's Inside? */}
            {foodData.nutrition_per_medium && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Image source={getFoodImage(foodData.name)} style={styles.sectionIcon}/>
                  <Text style={styles.sectionTitle}>What's Inside {foodData.name}?</Text>
                </View>
                <Text style={styles.sectionText}>
                  {foodData.nutrition_per_medium.carbohydrates && (
                    <Text>🥖 Carbohydrates: {foodData.nutrition_per_medium.carbohydrates.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_medium.protein && (
                    <Text>💪 Protein: {foodData.nutrition_per_medium.protein.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_medium.fat && (
                    <Text>🧈 Fat: {foodData.nutrition_per_medium.fat.split(' - ')[0]}{'\n'}</Text>
                  )}
                </Text>
              </View>
            )}

            {/* Nutrition per cup for some foods */}
            {foodData.nutrition_per_cup && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Image source={getFoodImage(foodData.name)} style={styles.sectionIcon}/>
                  <Text style={styles.sectionTitle}>What's Inside {foodData.name}?</Text>
                </View>
                <Text style={styles.sectionText}>
                  {foodData.nutrition_per_cup.carbohydrates && (
                    <Text>🥖 Carbohydrates: {foodData.nutrition_per_cup.carbohydrates.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_cup.protein && (
                    <Text>💪 Protein: {foodData.nutrition_per_cup.protein.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_cup.fat && (
                    <Text>🧈 Fat: {foodData.nutrition_per_cup.fat.split(' - ')[0]}{'\n'}</Text>
                  )}
                </Text>
              </View>
            )}

            {/* Nutrition per 3oz for proteins */}
            {foodData.nutrition_per_3oz && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Image source={getFoodImage(foodData.name)} style={styles.sectionIcon}/>
                  <Text style={styles.sectionTitle}>What's Inside {foodData.name}?</Text>
                </View>
                <Text style={styles.sectionText}>
                  {foodData.nutrition_per_3oz.carbohydrates && (
                    <Text>🥖 Carbohydrates: {foodData.nutrition_per_3oz.carbohydrates.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_3oz.protein && (
                    <Text>💪 Protein: {foodData.nutrition_per_3oz.protein.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_3oz.fat && (
                    <Text>🧈 Fat: {foodData.nutrition_per_3oz.fat.split(' - ')[0]}{'\n'}</Text>
                  )}
                </Text>
              </View>
            )}

            {/* Nutrition per large egg */}
            {foodData.nutrition_per_large_egg && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Image source={getFoodImage(foodData.name)} style={styles.sectionIcon}/>
                  <Text style={styles.sectionTitle}>What's Inside {foodData.name}?</Text>
                </View>
                <Text style={styles.sectionText}>
                  {foodData.nutrition_per_large_egg.carbohydrates && (
                    <Text>🥖 Carbohydrates: {foodData.nutrition_per_large_egg.carbohydrates.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_large_egg.protein && (
                    <Text>💪 Protein: {foodData.nutrition_per_large_egg.protein.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_large_egg.fat && (
                    <Text>🧈 Fat: {foodData.nutrition_per_large_egg.fat.split(' - ')[0]}{'\n'}</Text>
                  )}
                </Text>
              </View>
            )}

            {/* Nutrition per ounce for nuts */}
            {foodData.nutrition_per_ounce && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Image source={getFoodImage(foodData.name)} style={styles.sectionIcon}/>
                  <Text style={styles.sectionTitle}>What's Inside {foodData.name}?</Text>
                </View>
                <Text style={styles.sectionText}>
                  {foodData.nutrition_per_ounce.carbohydrates && (
                    <Text>🥖 Carbohydrates: {foodData.nutrition_per_ounce.carbohydrates.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_ounce.protein && (
                    <Text>💪 Protein: {foodData.nutrition_per_ounce.protein.split(' - ')[0]}{'\n'}</Text>
                  )}
                  {foodData.nutrition_per_ounce.fat && (
                    <Text>🧈 Fat: {foodData.nutrition_per_ounce.fat.split(' - ')[0]}{'\n'}</Text>
                  )}
                </Text>
              </View>
            )}

            {/* Where Do These Nutrients Come From? */}
            {foodData.nutrient_sources && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIconText}>🌱</Text>
                  <Text style={styles.sectionTitle}>Where Do These Nutrients Come From?</Text>
                </View>
                <View style={styles.nutritionList}>
                  {foodData.nutrient_sources.carbohydrates && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>🥖 Carbohydrates</Text>
                      <Text style={styles.nutritionDescription}>{foodData.nutrient_sources.carbohydrates}</Text>
                    </View>
                  )}
                  {foodData.nutrient_sources.protein && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>💪 Protein</Text>
                      <Text style={styles.nutritionDescription}>{foodData.nutrient_sources.protein}</Text>
                    </View>
                  )}
                  {foodData.nutrient_sources.fat && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>🧈 Fat</Text>
                      <Text style={styles.nutritionDescription}>{foodData.nutrient_sources.fat}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* How Is It Grown/Produced? */}
            {foodData.how_grown && foodData.how_grown.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIconText}>🌱</Text>
                  <Text style={styles.sectionTitle}>How Is It Grown?</Text>
                </View>
                <Text style={styles.sectionText}>
                  {foodData.name} grows in {foodData.how_grown.length} steps:
                </Text>
                <View style={styles.stepsList}>
                  {foodData.how_grown.map((step: string, index: number) => (
                    <View key={index} style={styles.stepItem}>
                      <Text style={styles.stepNumber}>{index + 1}.</Text>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* How Is It Produced? (for proteins) */}
            {foodData.how_produced && foodData.how_produced.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIconText}>🌱</Text>
                  <Text style={styles.sectionTitle}>How Is It Produced?</Text>
                </View>
                <Text style={styles.sectionText}>
                  {foodData.name} is produced in {foodData.how_produced.length} steps:
                </Text>
                <View style={styles.stepsList}>
                  {foodData.how_produced.map((step: string, index: number) => (
                    <View key={index} style={styles.stepItem}>
                      <Text style={styles.stepNumber}>{index + 1}.</Text>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* How Can You Eat It? */}
            {foodData.how_to_eat && foodData.how_to_eat.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIconText}>🍴</Text>
                  <Text style={styles.sectionTitle}>How Can You Eat {foodData.name}?</Text>
                </View>
                <View style={styles.eatingList}>
                  {foodData.how_to_eat.map((way: string, index: number) => (
                    <Text key={index} style={styles.eatingItem}>• {way}</Text>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    width: width * 0.95,
    maxHeight: height * 0.9,
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  foodCharacter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  sectionIconText: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
  },
  nutritionList: {
    marginBottom: 12,
  },
  nutritionItem: {
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  nutritionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 20,
    lineHeight: 20,
  },
  stepsList: {
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
    minWidth: 20,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
    flex: 1,
  },
  eatingList: {
    marginBottom: 12,
  },
  eatingItem: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
    marginBottom: 4,
  },
});

export default FoodDetailModal;
