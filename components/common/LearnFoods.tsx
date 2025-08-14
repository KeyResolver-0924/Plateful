import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';

export interface FoodData {
  description: string;
  nutrition_per_medium: {
    carbohydrates: string;
    protein: string;
    fat: string;
  };
  nutrient_sources: {
    carbohydrates: string;
    protein: string;
    fat: string;
  };
  how_grown: string[];
  how_to_eat: string[];
}

interface LearnFoodsProps {
  imageSource: ImageSourcePropType;
  data: FoodData;
  onBack?: () => void;
}

const LearnFoods: React.FC<LearnFoodsProps> = ({ imageSource, data, onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => (onBack ? onBack() : router.back())}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Learn</Text>
        
        <View style={styles.tomatoCharacter}>
          <Image source={imageSource} style={styles.tomatoImage} />
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* What Is It? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={imageSource} style={{ width: 30, height: 30, marginRight: 10 }} />
              <Text style={styles.sectionTitle}>What Is It?</Text>
            </View>
            <Text style={styles.sectionText}>{data.description}</Text>
          </View>

          {/* What's Inside? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={imageSource} style={{ width: 40, height: 40, marginRight: 10 }} />
              <Text style={styles.sectionTitle}>What's Inside?</Text>
            </View>
            <Text style={styles.sectionText}>Per medium serving, it contains:</Text>
            <View style={styles.nutritionList}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>🥖 Carbohydrates: {data.nutrition_per_medium.carbohydrates}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>💪 Protein: {data.nutrition_per_medium.protein}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>🧈 Fat: {data.nutrition_per_medium.fat}</Text>
              </View>
            </View>
          </View>

          {/* Where Do These Nutrients Come From? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🌱</Text>
              <Text style={styles.sectionTitle}>Where Do These Nutrients Come From?</Text>
            </View>
            <View style={styles.nutritionList}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>🥖 Carbohydrates</Text>
                <Text style={styles.nutritionDescription}>{data.nutrient_sources.carbohydrates}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>💪 Protein</Text>
                <Text style={styles.nutritionDescription}>{data.nutrient_sources.protein}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>🧈 Fat</Text>
                <Text style={styles.nutritionDescription}>{data.nutrient_sources.fat}</Text>
              </View>
            </View>
          </View>

          {/* How Is It Grown? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🌱</Text>
              <Text style={styles.sectionTitle}>How Is It Grown?</Text>
            </View>
            <Text style={styles.sectionText}>Typical growth steps:</Text>
            <View style={styles.stepsList}>
              {data.how_grown.map((step, index) => (
                <View key={`grow-step-${index}`} style={styles.stepItem}>
                  <Text style={styles.stepNumber}>{index + 1}.</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* How Can You Eat It? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🍴</Text>
              <Text style={styles.sectionTitle}>How Can You Eat It?</Text>
            </View>
            <View style={styles.eatingList}>
              {data.how_to_eat.map((way, index) => (
                <Text key={`eat-${index}`} style={styles.eatingItem}>• {way}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,// Orange background like in the image
  },
  header: {
    paddingTop: 23,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
    marginBottom: 20,
  },
  tomatoCharacter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  tomatoImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
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
    color: '#333',
  },
  nutritionDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 20,
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
    color: '#FF6B35',
    marginRight: 8,
    minWidth: 20,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    flex: 1,
  },
  eatingList: {
    marginBottom: 12,
  },
  eatingItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 4,
  },
});

export default LearnFoods;