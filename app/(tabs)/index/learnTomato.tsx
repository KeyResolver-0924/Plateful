import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../../../constants/colors';
const { width } = Dimensions.get('window');

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

const LearnScreen = ({ navigation }: { navigation: NavigationProps }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Learn</Text>
        
        <View style={styles.tomatoCharacter}>
          <Image 
            source={require('../../../assets/images/foods/tomato (2).png')} 
            style={styles.tomatoImage}
          />
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* What Is A Tomato? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={require('../../../assets/images/foods/tomato (2).png')} style={{width: 30, height: 30, marginRight: 10}}/>
              <Text style={styles.sectionTitle}>What Is A Tomato?</Text>
            </View>
            <Text style={styles.sectionText}>
              A tomato is actually a fruit, not a vegetable! It has seeds inside, which makes it a fruit. 
              Tomatoes come in many colors like red, yellow, orange, and even purple!
            </Text>
          </View>

          {/* What's Inside A Tomato? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={require('../../../assets/images/foods/tomato.png')} style={{width: 40, height: 40, marginRight: 10}}/>
              <Text style={styles.sectionTitle}>What's Inside A Tomato?</Text>
            </View>
            <Text style={styles.sectionText}>
              A medium tomato (about the size of your fist) contains:
            </Text>
            <View style={styles.nutritionList}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>🥖 Carbohydrates: 5 grams</Text>
                <Text style={styles.nutritionDescription}>Provides energy</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>💪 Protein: 1 gram</Text>
                <Text style={styles.nutritionDescription}>Builds muscles</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>🧈 Fat: 0.2 grams</Text>
                <Text style={styles.nutritionDescription}>Very low fat, making them light and healthy</Text>
              </View>
            </View>
            <Text style={styles.sectionText}>
              Tomatoes are also full of water for cooling and refreshment!
            </Text>
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
                <Text style={styles.nutritionDescription}>From sugar and fiber inside the tomato; plants make sugar via photosynthesis 😊</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>💪 Protein</Text>
                <Text style={styles.nutritionDescription}>From amino acids made by the tomato plant</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>🧈 Fat</Text>
                <Text style={styles.nutritionDescription}>From natural oils in the seeds</Text>
              </View>
            </View>
          </View>

          {/* How Are Tomatoes Grown? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🌱</Text>
              <Text style={styles.sectionTitle}>How Are Tomatoes Grown?</Text>
            </View>
            <Text style={styles.sectionText}>
              Tomatoes grow from tiny seeds in five steps:
            </Text>
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>1.</Text>
                <Text style={styles.stepText}>Plant the Seed: Put a small seed into the soil</Text>
              </View>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>2.</Text>
                <Text style={styles.stepText}>Water It: Give it a little drink daily</Text>
              </View>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>3.</Text>
                <Text style={styles.stepText}>Sunlight Time: Tomatoes need lots of sun</Text>
              </View>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>4.</Text>
                <Text style={styles.stepText}>Grow the Plant: Sprout, then leaves, then flowers</Text>
              </View>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>5.</Text>
                <Text style={styles.stepText}>Watch the Fruit Grow: After the flower, a green tomato grows and slowly turns red (or yellow or orange) when ripe</Text>
              </View>
            </View>
            <Text style={styles.sectionText}>
              Farmers and gardeners care for tomato plants to help them grow big and healthy!
            </Text>
          </View>

          {/* How Can You Eat Tomatoes? */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🍴</Text>
              <Text style={styles.sectionTitle}>How Can You Eat Tomatoes?</Text>
            </View>
            <View style={styles.eatingList}>
              <Text style={styles.eatingItem}>• In a salad</Text>
              <Text style={styles.eatingItem}>• On a sandwich</Text>
              <Text style={styles.eatingItem}>• As ketchup</Text>
              <Text style={styles.eatingItem}>• In soup</Text>
              <Text style={styles.eatingItem}>• From just like an apple!</Text>
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

export default LearnScreen;