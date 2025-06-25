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
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { getFoodsByCategory } from '../../constants/foods';

const { width } = Dimensions.get('window');

const FoodSelectionScreen = ({ route, navigation }) => {
  const { category, step, onComplete } = route.params;
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Get food data from database based on category
  const getCategoryData = (cat) => {
    const foods = getFoodsByCategory(cat);
    const titles = {
      fats: 'What Fats have been Introduced?',
      dairy: 'What Dairy Has been Introduced?',
      proteins: 'What Proteins are out of scope for your Child?'
    };
    
    return {
      title: titles[cat] || 'Select Foods',
      items: foods
    };
  };
  
  const categoryData = getCategoryData(category);

  const toggleItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleNext = () => {
    // Save selected items
    onComplete({ [category]: selectedItems });
    
    // Navigate to next step
    if (category === 'fats') {
      navigation.navigate('FoodSelection', {
        category: 'dairy',
        step: step + 1,
        onComplete
      });
    } else if (category === 'dairy') {
      navigation.navigate('FoodSelection', {
        category: 'proteins',
        step: step + 1,
        onComplete
      });
    } else {
      navigation.navigate('ProfileComplete');
    }
  };

  const FoodItem = ({ item, index }) => {
    const isSelected = selectedItems.includes(item.id);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePress = () => {
      scale.value = withSpring(0.9, {}, () => {
        scale.value = withSpring(1);
      });
      toggleItem(item.id);
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={animatedStyle}
      >
        <TouchableOpacity
          style={[styles.foodItem, isSelected && styles.foodItemSelected]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View style={styles.addButton}>
            <Ionicons 
              name={isSelected ? "checkmark-circle" : "add-circle"} 
              size={24} 
              color={isSelected ? colors.success : colors.primary} 
            />
          </View>
          
          <View style={styles.foodImageContainer}>
            <Image 
              source={item.image} 
              style={styles.foodImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.foodName}>{item.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(step / 10) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{step}/10</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>Let's Learn About Your Family!</Text>
        <Text style={styles.title}>{categoryData.title}</Text>

        <View style={styles.foodGrid}>
          {categoryData.items.map((item, index) => (
            <FoodItem key={item.id} item={item} index={index} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.previousText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Ionicons name="arrow-forward" size={24} color={colors.text.inverse} />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodItem: {
    width: (width - 72) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  foodItemSelected: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  addButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  foodImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  previousText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default FoodSelectionScreen;