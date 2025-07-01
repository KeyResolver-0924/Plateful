import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { config } from '../../constants/config';

const { width } = Dimensions.get('window');

// Food data
const foodData = {
  fruits: [
    { id: 'apple', name: 'Apple', image: require('../../assets/images/foods/apple.png') },
    { id: 'banana', name: 'Banana', image: require('../../assets/images/foods/banana.png') },
    { id: 'orange', name: 'Orange', image: require('../../assets/images/foods/orange.png') },
    { id: 'strawberry', name: 'Strawberry', image: require('../../assets/images/foods/strawberry.png') },
    { id: 'grapes', name: 'Grapes', image: require('../../assets/images/foods/grapes.png') },
    { id: 'watermelon', name: 'Watermelon', image: require('../../assets/images/foods/watermelon.png') },
    { id: 'mango', name: 'Mango', image: require('../../assets/images/foods/mango.png') },
    { id: 'pear', name: 'Pear', image: require('../../assets/images/foods/pear.png') },
    { id: 'peach', name: 'Peach', image: require('../../assets/images/foods/peach.png') },
  ],
  vegetables: [
    { id: 'carrot', name: 'Carrots', image: require('../../assets/images/foods/carrot.png') },
    { id: 'broccoli', name: 'Broccoli', image: require('../../assets/images/foods/broccoli.png') },
    { id: 'sweetpotato', name: 'Sweet Potatoes', image: require('../../assets/images/foods/sweetpotato.png') },
    { id: 'peas', name: 'Peas', image: require('../../assets/images/foods/peas.png') },
    { id: 'corn', name: 'Corn', image: require('../../assets/images/foods/corn.png') },
    { id: 'cucumber', name: 'Cucumber', image: require('../../assets/images/foods/cucumber.png') },
    { id: 'bellpepper', name: 'Bell Peppers', image: require('../../assets/images/foods/bellpepper.png') },
    { id: 'spinach', name: 'Spinach', image: require('../../assets/images/foods/spinach.png') },
    { id: 'tomato', name: 'Tomatoes', image: require('../../assets/images/foods/tomato.png') },
  ],
  proteins: [
    { id: 'chicken', name: 'Chicken', image: require('../../assets/images/foods/chicken.png') },
    { id: 'fish', name: 'Fish', image: require('../../assets/images/foods/fish.png') },
    { id: 'eggs', name: 'Eggs', image: require('../../assets/images/foods/eggs.png') },
    { id: 'beans', name: 'Beans', image: require('../../assets/images/foods/beans.png') },
    { id: 'lentils', name: 'Lentils', image: require('../../assets/images/foods/lentils.png') },
    { id: 'tofu', name: 'Tofu', image: require('../../assets/images/foods/tofu.png') },
    { id: 'beef', name: 'Lean Beef', image: require('../../assets/images/foods/beef.png') },
    { id: 'turkey', name: 'Turkey', image: require('../../assets/images/foods/turkey.png') },
    { id: 'nuts', name: 'Nuts', image: require('../../assets/images/foods/nuts.png') },
  ]
};

const ProfileSetupScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    childName: '',
    age: '',
    gender: '',
    restrictions: [],
    fruits: [],
    vegetables: [],
    proteins: []
  });
  
  const progress = useSharedValue(0);
  
  const steps = [
    'childName',
    'age',
    'gender',
    'restrictions',
    'fruits',
    'vegetables',
    'proteins'
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      progress.value = withSpring((currentStep + 1) / steps.length);
    } else {
      // Complete setup
      if (router && router.replace) {
        router.replace('/(tabs)');
      } else {
        console.error('Router is not available');
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      progress.value = withSpring((currentStep - 1) / steps.length);
    }
  };
  
  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });
  
  const renderStepContent = () => {
    switch (steps[currentStep]) {
      case 'childName':
        return <ChildNameStep profileData={profileData} setProfileData={setProfileData} />;
      case 'age':
        return <AgeStep profileData={profileData} setProfileData={setProfileData} />;
      case 'gender':
        return <GenderStep profileData={profileData} setProfileData={setProfileData} />;
      case 'restrictions':
        return <RestrictionsStep profileData={profileData} setProfileData={setProfileData} />;
      case 'fruits':
        return <FoodSelectionStep 
          type="fruits" 
          profileData={profileData} 
          setProfileData={setProfileData}
          foods={foodData.fruits}
        />;
      case 'vegetables':
        return <FoodSelectionStep 
          type="vegetables" 
          profileData={profileData} 
          setProfileData={setProfileData}
          foods={foodData.vegetables}
        />;
      case 'proteins':
        return <FoodSelectionStep 
          type="proteins" 
          profileData={profileData} 
          setProfileData={setProfileData}
          foods={foodData.proteins}
        />;
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Image 
          source={require('../../assets/images/logo/platefull-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Welcome to PLATEFULL</Text>
        <Text style={styles.subtitleText}>Let's get started.</Text>
      </LinearGradient>
      
      <View style={styles.contentContainer}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
          </View>
          <Text style={styles.stepIndicator}>
            {currentStep + 1}/{steps.length}
          </Text>
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            {renderStepContent()}
          </Animated.View>
        </ScrollView>
        
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity onPress={handlePrevious} style={styles.previousButton}>
              <Text style={styles.previousText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <Button
            title={currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
            onPress={handleNext}
            style={styles.nextButton}
            icon={
              currentStep < steps.length - 1 ? 
              <Ionicons name="arrow-forward" size={20} color={colors.text.inverse} /> : 
              null
            }
          />
        </View>
      </View>
    </View>
  );
};

// Step Components
const ChildNameStep = ({ profileData, setProfileData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let's Learn About Your Family!</Text>
    <Text style={styles.stepQuestion}>What's your child name?</Text>
    
    <Input
      value={profileData.childName}
      onChangeText={(text) => setProfileData({ ...profileData, childName: text })}
      placeholder="Johnny"
      icon={<Ionicons name="person-outline" />}
      style={styles.input}
    />
  </View>
);

const AgeStep = ({ profileData, setProfileData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let's Learn About Your Family!</Text>
    <Text style={styles.stepQuestion}>How old is your child?</Text>
    
    <TouchableOpacity style={styles.dropdown}>
      <Text style={styles.dropdownText}>
        {profileData.age || 'Select Age'}
      </Text>
      <Ionicons name="chevron-down" size={24} color={colors.text.secondary} />
    </TouchableOpacity>
    
    <View style={styles.ageOptions}>
      {config.ageRanges.map((age) => (
        <TouchableOpacity
          key={age.value}
          style={[
            styles.ageOption,
            profileData.age === age.label && styles.ageOptionSelected
          ]}
          onPress={() => setProfileData({ ...profileData, age: age.label })}
        >
          <Text style={[
            styles.ageOptionText,
            profileData.age === age.label && styles.ageOptionTextSelected
          ]}>
            {age.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const GenderStep = ({ profileData, setProfileData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let's Learn About Your Family!</Text>
    <Text style={styles.stepQuestion}>Tell Us About Your Child Gender?</Text>
    
    <View style={styles.genderContainer}>
      <TouchableOpacity
        style={[
          styles.genderOption,
          profileData.gender === 'girl' && styles.genderOptionSelected
        ]}
        onPress={() => setProfileData({ ...profileData, gender: 'girl' })}
      >
        <Image 
          source={require('../../assets/images/avatars/girl.png')}
          style={styles.genderAvatar}
        />
        <Text style={styles.genderText}>Girl</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.genderOption,
          profileData.gender === 'boy' && styles.genderOptionSelected
        ]}
        onPress={() => setProfileData({ ...profileData, gender: 'boy' })}
      >
        <Image 
          source={require('../../assets/images/avatars/boy.png')}
          style={styles.genderAvatar}
        />
        <Text style={styles.genderText}>Boy</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RestrictionsStep = ({ profileData, setProfileData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let's Learn About Your Family!</Text>
    <Text style={styles.stepQuestion}>
      Does your child have allergies or dietary restrictions?
    </Text>
    
    <TouchableOpacity style={styles.dropdown}>
      <Text style={styles.dropdownText}>
        {profileData.restrictions.length > 0 
          ? `${profileData.restrictions.length} selected`
          : 'Select your Restrictions'
        }
      </Text>
      <Ionicons name="chevron-down" size={24} color={colors.text.secondary} />
    </TouchableOpacity>
    
    <View style={styles.restrictionOptions}>
      {config.dietaryRestrictions.map((restriction) => (
        <TouchableOpacity
          key={restriction.value}
          style={[
            styles.restrictionOption,
            profileData.restrictions.includes(restriction.value) && 
            styles.restrictionOptionSelected
          ]}
          onPress={() => {
            const current = profileData.restrictions;
            const updated = current.includes(restriction.value)
              ? current.filter(r => r !== restriction.value)
              : [...current, restriction.value];
            setProfileData({ ...profileData, restrictions: updated });
          }}
        >
          <Text style={[
            styles.restrictionOptionText,
            profileData.restrictions.includes(restriction.value) && 
            styles.restrictionOptionTextSelected
          ]}>
            {restriction.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const FoodSelectionStep = ({ type, profileData, setProfileData, foods }) => {
  const handleFoodToggle = (foodId) => {
    const current = profileData[type] || [];
    const updated = current.includes(foodId)
      ? current.filter(f => f !== foodId)
      : [...current, foodId];
    setProfileData({ ...profileData, [type]: updated });
  };
  
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Let's Learn About Your Family!</Text>
      <Text style={styles.stepQuestion}>
        What {type.charAt(0).toUpperCase() + type.slice(1)} have been Introduced?
      </Text>
      
      <View style={styles.foodGrid}>
        {foods.map((food) => (
          <TouchableOpacity
            key={food.id}
            style={styles.foodItem}
            onPress={() => handleFoodToggle(food.id)}
          >
            <View style={[
              styles.foodImageContainer,
              profileData[type]?.includes(food.id) && styles.foodImageSelected
            ]}>
              <Image source={food.image} style={styles.foodImage} />
              <View style={styles.addButton}>
                <Ionicons 
                  name={profileData[type]?.includes(food.id) ? "checkmark" : "add"} 
                  size={20} 
                  color={colors.text.inverse} 
                />
              </View>
            </View>
            <Text style={styles.foodName}>{food.name}</Text>
          </TouchableOpacity>
        ))}
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
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  mascot: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 20,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  stepQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 32,
  },
  input: {
    marginTop: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  ageOptions: {
    marginTop: 16,
  },
  ageOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  ageOptionSelected: {
    backgroundColor: colors.primary,
  },
  ageOptionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  ageOptionTextSelected: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
  },
  genderOption: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    width: (width - 72) / 2,
  },
  genderOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  genderAvatar: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  genderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  restrictionOptions: {
    marginTop: 16,
  },
  restrictionOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restrictionOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  restrictionOptionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  restrictionOptionTextSelected: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  foodItem: {
    width: (width - 72) / 3,
    alignItems: 'center',
    marginBottom: 24,
  },
  foodImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  foodImageSelected: {
    backgroundColor: colors.primaryLight + '30',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  foodImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  addButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 14,
    color: colors.text.primary,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  previousButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  previousText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    marginLeft: 16,
  },
});

export default ProfileSetupScreen;