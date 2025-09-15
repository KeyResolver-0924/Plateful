import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Input from '../../components/common/Input';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { config } from '../../constants/config';
import { useUserStore } from '../../stores/userStore';
import { cameraService } from '../../utils/cameraService';
import MessageHandler from '../../utils/messageHandler';
import { shadowPresets } from '../../utils/shadowUtils';

const { width } = Dimensions.get('window');
const Base_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Types
interface Food {
  id: string;
  name: string;
  image: any;
}

interface ProfileData {
  childName: string;
  avatar?: string;
  age: string;
  gender: string;
  restrictions: string[];
  fruits: string[];
  vegetables: string[];
  proteins: string[];
  carbohydrates: string[];
  fats: string[];
  dairy: string[];
}

interface AvatarStepProps extends StepProps {
  isUploading?: boolean;
}

// Convert age string to number for backend
// const convertAgeToNumber = (ageString: string): number => {
//   const ageMatch = ageString.match(/(\d+)/);
//   return ageMatch ? parseInt(ageMatch[1], 10) : 0;
// };

const convertGenderToBackendFormat = (gender: string): 'male' | 'female' | 'other' => {
  switch (gender.toLowerCase()) {
    case 'boy':
      return 'male';
    case 'girl':
      return 'female';
    default:
      return 'other';
  }
};

interface StepProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
}

interface FoodSelectionStepProps extends StepProps {
  type: 'fruits' | 'vegetables' | 'proteins' | 'carbohydrates' | 'fats' | 'dairy';
  foods: Food[];
}

// Dropdown Component
interface DropdownProps {
  value: string | string[];
  placeholder: string;
  options: { label: string; value: string }[];
  onSelect: (value: string | string[]) => void;
  multiple?: boolean;
  maxHeight?: number;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  value, 
  placeholder, 
  options, 
  onSelect, 
  multiple = false,
  maxHeight = 200 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useSharedValue(0);
  const animatedOpacity = useSharedValue(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      animatedHeight.value = withTiming(maxHeight, { duration: 300 });
      animatedOpacity.value = withTiming(1, { duration: 200 });
    } else {
      animatedHeight.value = withTiming(0, { duration: 300 });
      animatedOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onSelect(newValues);
    } else {
      onSelect(optionValue);
      setIsOpen(false);
      animatedHeight.value = withTiming(0, { duration: 300 });
      animatedOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) return placeholder;
      if (values.length === 1) {
        const option = options.find(opt => opt.value === values[0]);
        return option?.label || placeholder;
      }
      return `${values.length} selected`;
    } else {
      if (!value) return placeholder;
      const option = options.find(opt => opt.value === value);
      return option?.label || placeholder;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: animatedOpacity.value,
  }));

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text style={styles.dropdownText}>
          {getDisplayText()}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={colors.text.secondary} 
        />
      </TouchableOpacity>
      
      <Animated.View style={[styles.dropdownOptions, animatedStyle]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {options.map((option) => {
            const isSelected = multiple 
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value;
            
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownOption,
                  isSelected && styles.dropdownOptionSelected
                ]}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  isSelected && styles.dropdownOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {isSelected && (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.text.inverse} 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

// Food data
const foodData = {
  fruits: [
    { id: 'apple', name: 'Apple', image: require(`${Base_URL}/assets/images/Food/Fruit/apple.png`) },
    { id: 'apricot', name: 'Apricot', image: require(`${Base_URL}/assets/images/Food/Fruit/apricot.png`) },
    {id : 'banana', name: 'Banana', image: require(`${Base_URL}/assets/images/Food/Fruit/banana.png`) },
    { id: 'blueberry', name: 'Blueberry', image: require(`${Base_URL}/assets/images/Food/Fruit/blueberry.png`) },
    { id: 'blackberry', name: 'Blackberry', image: require(`${Base_URL}/assets/images/Food/Fruit/blackberry.png`) },
    { id: 'cantaloupe', name: 'Cantaloupe', image: require(`${Base_URL}/assets/images/Food/Fruit/cantaloupe.png`) },
    { id: 'cherry', name: 'Cherry', image: require(`${Base_URL}/assets/images/Food/Fruit/cherry.png`) },
    { id: 'fig', name: 'Fig', image: require(`${Base_URL}/assets/images/Food/Fruit/fig.png`) },
    { id: 'grape', name: 'Grape', image: require(`${Base_URL}/assets/images/Food/Fruit/grape.png`) },
    { id: 'grapefruit', name: 'Grapefruit', image: require(`${Base_URL}/assets/images/Food/Fruit/grapefruit.png`) },
    { id: 'kiwi', name: 'Kiwi', image: require(`${Base_URL}/assets/images/Food/Fruit/kiwi.png`) },
    { id: 'lemon', name: 'Lemon', image: require(`${Base_URL}/assets/images/Food/Fruit/lemon.png`) },
    { id: 'lime', name: 'Lime', image: require(`${Base_URL}/assets/images/Food/Fruit/lime.png`) },
    { id: 'mango', name: 'Mango', image: require(`${Base_URL}/assets/images/Food/Fruit/mango.png`) },
    { id: 'nectarine', name: 'Nectarine', image: require(`${Base_URL}/assets/images/Food/Fruit/nectarine.png`) },
    { id: 'orange', name: 'Orange', image: require(`${Base_URL}/assets/images/Food/Fruit/orange.png`) },
    { id: 'papaya', name: 'Papaya', image: require(`${Base_URL}/assets/images/Food/Fruit/papaya.png`) },
    { id: 'peach', name: 'Peach', image: require(`${Base_URL}/assets/images/Food/Fruit/peach.png`) },
    { id: 'pomegranate', name: 'Pomegranate', image: require(`${Base_URL}/assets/images/Food/Fruit/pomegranate.png`) },
    { id: 'pear', name: 'Pear', image: require(`${Base_URL}/assets/images/Food/Fruit/pear.png`) },
    { id: 'plum', name: 'Plum', image: require(`${Base_URL}/assets/images/Food/Fruit/plum.png`) },
    { id: 'strawberry', name: 'Strawberry', image: require(`${Base_URL}/assets/images/Food/Fruit/strawberry.png`) },
    { id: 'tangerine', name: 'Tangerine', image: require(`${Base_URL}/assets/images/Food/Fruit/tangerine.png`) },
    { id: 'watermelon', name: 'Watermelon', image: require(`${Base_URL}/assets/images/Food/Fruit/watermelon.png`) }
  ],
  vegetables: [
    { id: 'asparagus', name: 'Asparagus', image: require(`${Base_URL}/assets/images/Food/Vegetable/asparagus.png`) },
    { id: 'beet', name: 'Beet', image: require(`${Base_URL}/assets/images/Food/Vegetable/beet.png`) },
    { id: 'broccoli', name: 'Broccoli', image: require(`${Base_URL}/assets/images/Food/Vegetable/broccoli.png`) },
    { id: 'bellpepper', name: 'Bell Pepper', image: require(`${Base_URL}/assets/images/Food/Vegetable/bellpepper.png`) },
    { id: 'cabbage', name: 'Cabbage', image: require(`${Base_URL}/assets/images/Food/Vegetable/cabbage.png`) },
    { id: 'carrot', name: 'Carrot', image: require(`${Base_URL}/assets/images/Food/Vegetable/carrot.png`) },
    { id: 'cauliflower', name: 'Cauliflower', image: require(`${Base_URL}/assets/images/Food/Vegetable/cauliflower.png`) },
    { id: 'cucumber', name: 'Cucumber', image: require(`${Base_URL}/assets/images/Food/Vegetable/cucumber.png`) },
    { id: 'eggplant', name: 'Eggplant', image: require(`${Base_URL}/assets/images/Food/Vegetable/eggplant.png`) },
    { id: 'garlic', name: 'Garlic', image: require(`${Base_URL}/assets/images/Food/Vegetable/garlic.png`) },
    { id: 'mushroom', name: 'Mushroom', image: require(`${Base_URL}/assets/images/Food/Vegetable/mushroom.png`) },
    { id: 'onion', name: 'Onion', image: require(`${Base_URL}/assets/images/Food/Vegetable/onion.png`) },
    { id: 'pumpkin', name: 'Pumpkin', image: require(`${Base_URL}/assets/images/Food/Vegetable/pumpkin.png`) },
    { id: 'pepper', name: 'Pepper', image: require(`${Base_URL}/assets/images/Food/Vegetable/pepper.png`) },
    { id: 'radish', name: 'Radish', image: require(`${Base_URL}/assets/images/Food/Vegetable/radish.png`) },
    { id: 'spinach', name: 'Spinach', image: require(`${Base_URL}/assets/images/Food/Vegetable/spinach.png`) },
    { id: 'tomato', name: 'Tomato', image: require(`${Base_URL}/assets/images/Food/Vegetable/tomato.png`) },
    { id: 'zucchini', name: 'Zucchini', image: require(`${Base_URL}/assets/images/Food/Vegetable/zucchini.png`) }
  ],
  proteins: [
    { id: 'avocado', name: 'Avocado', image: require(`${Base_URL}/assets/images/Food/Protein/avocado.png`) },
    { id: 'chicken', name: 'Chicken', image: require(`${Base_URL}/assets/images/Food/Protein/chicken.png`) },
    { id: 'egg', name: 'Egg', image: require(`${Base_URL}/assets/images/Food/Protein/egg.png`) },
    { id: 'fish', name: 'Fish', image: require(`${Base_URL}/assets/images/Food/Protein/fish.png`) },
    { id: 'bean', name: 'Bean', image: require(`${Base_URL}/assets/images/Food/Protein/bean.png`) },
    { id: 'tofu', name: 'Tofu', image: require(`${Base_URL}/assets/images/Food/Protein/tofu.png`) },
    { id: 'beef', name: 'Lean Beef', image: require(`${Base_URL}/assets/images/Food/Protein/beef.png`) },
  ],
  carbohydrates: [
    { id: 'rice', name: 'Rice', image: require(`${Base_URL}/assets/images/Food/Carbohydrate/rice.png`) },
    { id: 'oats', name: 'Oats', image: require(`${Base_URL}/assets/images/Food/Carbohydrate/oats.png`) },
    { id: 'quinoa', name: 'Quinoa', image: require(`${Base_URL}/assets/images/Food/Carbohydrate/quinoa.png`) },
    { id: 'corn', name: 'Corn', image: require(`${Base_URL}/assets/images/Food/Carbohydrate/corn.png`) },
    { id: 'pasta', name: 'Pasta', image: require(`${Base_URL}/assets/images/Food/Carbohydrate/pasta.png`) },
    { id: 'butternut', name: 'Butternut', image: require(`${Base_URL}/assets/images/Food/Carbohydrate/butternut.png`) },
    { id: 'sweetpotato', name: 'Sweet Potato', image: require(`${Base_URL}/assets/images/Food/Carbohydrate/sweetpotato.png`) },
    { id: 'potato', name: 'Potato', image: require(`${Base_URL}/assets/images/Food/Carbohydrate/potato.png`) },
  ],
  fats: [
    { id: 'chocolate', name: 'Chocolate', image: require(`${Base_URL}/assets/images/Food/Fats/chocolate.png`) },
    { id: 'coconut', name: 'Coconut', image: require(`${Base_URL}/assets/images/Food/Fats/coconut.png`) },
    { id: 'olive', name: 'Olive', image: require(`${Base_URL}/assets/images/Food/Fats/olive.png`) },
    { id: 'nut', name: 'Nut', image: require(`${Base_URL}/assets/images/Food/Fats/nut.png`) },
    { id: 'salmon', name: 'Salmon', image: require(`${Base_URL}/assets/images/Food/Fats/salmon.png`) },
  ],
  dairy: [
    { id: 'milk', name: 'Milk', image: require(`${Base_URL}/assets/images/Food/Dairy/milk.png`) },
    { id: 'cream', name: 'Cream', image: require(`${Base_URL}/assets/images/Food/Dairy/cream.png`) },
    { id: 'cottagecheese', name: 'Cottage Cheese', image: require(`${Base_URL}/assets/images/Food/Dairy/cottagecheese.png`) },
    { id: 'icecream', name: 'Ice Cream', image: require(`${Base_URL}/assets/images/Food/Dairy/icecream.png`) },
    { id: 'cheese', name: 'Cheese', image: require(`${Base_URL}/assets/images/Food/Dairy/cheese.png`) },
    { id: 'yogurt', name: 'Yogurt', image: require(`${Base_URL}/assets/images/Food/Dairy/yogurt.png`) },
  ],
};

const ProfileSetupScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    childName: '', 
    avatar: undefined, 
    age: '', 
    gender: '', 
    restrictions: [], 
    fruits: [], 
    vegetables: [], 
    proteins: [], 
    carbohydrates: [], 
    fats: [], 
    dairy: []
  });
  
  const progress = useSharedValue(0);
  
  // Get userStore functions
   const { addChild, 
    // isLoading, error, clearError 
   } = useUserStore();
  
  // Handle errors from the store
  useEffect(() => {
    // if (error) {
    //   Alert.alert('Error', error);
    //   clearError();
    // }
  }, []);
  
  const steps = [
    'childName',
    'avatar',
    'age',
    'gender',
    'restrictions',
    'fruits',
    'vegetables',
    'proteins',
    'carbohydrates',
    'fats',
    'dairy'
  ];
  
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      progress.value = withSpring((currentStep + 1) / steps.length);
    } else {
      await handleCreateChildProfile();
    }
  };
  
  const handleCreateChildProfile = async () => {
    try {
      if (!profileData.childName.trim()) {
        MessageHandler.showError('Please enter your child\'s name');
        return;
      }
      
      if (!profileData.avatar) {
        MessageHandler.showError('Please select an avatar for your child');
        return;
      }
      
      if (!profileData.age) {
        MessageHandler.showError('Please select your child\'s age');
        return;
      }
      
      if (!profileData.gender) {
        MessageHandler.showError('Please select your child\'s gender');
        return;
      }
      
      console.log('Child data1:', profileData);
      // Prepare child data for backend
      const childData = {
        name: profileData.childName.trim(),
        avatar: profileData.avatar, // This can be 'boy', 'girl', or a custom image URI
        ageRange: profileData.age.trim(),
        gender: convertGenderToBackendFormat(profileData.gender),
        allergies: profileData.restrictions,
        vegetables: profileData.vegetables,
        fruits: profileData.fruits,
        proteins: profileData.proteins,
        carbohydrates: profileData.carbohydrates,
        fats: profileData.fats,
        dairy: profileData.dairy,
      };

      console.log('Child data2:', childData);
      
      // Create child profile using userStore
      const result = await addChild(childData);
      
      // Navigate to success page after successful creation
      router.replace('/(tabs)' as any);
      // MessageHandler.showSuccess('Child profile created successfully!', 'Success', () => {
      // });
      
    } catch (error) {
      console.error('Error creating child profile:', error);
      MessageHandler.showError('Failed to create child profile. Please try again.');
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
      case 'avatar':
        return <AvatarStep profileData={profileData} setProfileData={setProfileData} isUploading={isAvatarUploading} />;
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
      case 'carbohydrates':
        return <FoodSelectionStep 
          type="carbohydrates" 
          profileData={profileData} 
          setProfileData={setProfileData}
          foods={foodData.carbohydrates}
        />;
      case 'fats':
        return <FoodSelectionStep 
          type="fats" 
          profileData={profileData} 
          setProfileData={setProfileData}
          foods={foodData.fats}
        />;
      case 'dairy':
        return <FoodSelectionStep 
          type="dairy" 
          profileData={profileData} 
          setProfileData={setProfileData}
          foods={foodData.dairy}
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
          source={require(`${Base_URL}/assets/images/logo/platefull-mascot.png`)}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Welcome to PLATEFUL</Text>
        <Text style={styles.subtitleText}>Let&apos;s get started.</Text>
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
        
        <View style={styles.bottomContainer}>
          {currentStep > 0 ? (
            // Show both Back and Next buttons
            <View style={styles.buttonRow}>
              <Animated.View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.backButton]}
                  onPress={handlePrevious}
                  // disabled={isLoading}
                >
                  <Text style={styles.backButtonText}>
                    <Ionicons name="arrow-back" size={25} color="white" />
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.nextButton]}
                  onPress={handleNext}
                  // disabled={isLoading}
                >
                  <Text style={styles.nextButtonText}>
                    {currentStep === steps.length - 1 
                      ? ("Complete!") 
                      : <Ionicons name="arrow-forward" size={25} color="white" />
                    }
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          ) : (
            // Show only Next button on first screen
            <Animated.View>
              <TouchableOpacity
                style={[styles.singleNextButton]}
                onPress={handleNext}
                // disabled={isLoading}
              >
                <Text style={styles.nextButtonText}>
                  {"Next"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};

// Step Components
const ChildNameStep: React.FC<StepProps> = ({ profileData, setProfileData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let&apos;s Learn About Your Family!</Text>
    <Text style={styles.stepQuestion}>What&apos;s your child name?</Text>
    
    <Input
      value={profileData.childName}
      onChangeText={(text) => setProfileData({ ...profileData, childName: text })}
      placeholder="Johnny"
      icon={<Ionicons name="person-outline" />}
      style={styles.input}
    />
  </View>
);

const AvatarStep: React.FC<AvatarStepProps> = ({ profileData, setProfileData, isUploading = false }) => {
  const handleCustomAvatarUpload = async () => {
    try {
      const imageUri = await cameraService.pickFromGallery();
      if (imageUri) {
        setProfileData({ ...profileData, avatar: imageUri });
        MessageHandler.showSuccess('Custom avatar uploaded successfully!');
      } else {
        MessageHandler.showInfo('No image selected');
      }
    } catch (error) {
      console.error('Gallery picker error:', error);
      MessageHandler.showError('Failed to upload custom avatar. Please check permissions and try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const imageUri = await cameraService.takePicture();
      if (imageUri) {
        setProfileData({ ...profileData, avatar: imageUri });
        MessageHandler.showSuccess('Photo taken successfully!');
      } else {
        MessageHandler.showInfo('No photo taken');
      }
    } catch (error) {
      console.error('Camera error:', error);
      MessageHandler.showError('Failed to take photo. Please check camera permissions and try again.');
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Let&apos;s Learn About Your Family!</Text>
      <Text style={styles.stepQuestion}>Choose an Avatar for Your Child</Text>
    <Text style={styles.stepSubtitle}>
      Select from our predefined avatars or upload your own photo
    </Text>
      
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          style={[
            styles.avatarOption,
            profileData.avatar === 'boy' && styles.avatarOptionSelected
          ]}
          onPress={() => setProfileData({ ...profileData, avatar: 'boy' })}
        >
          <Image 
            source={require(`${Base_URL}/assets/images/avatars/boy.png`)}
            style={styles.avatarImage}
          />
          <Text style={styles.avatarText}>Boy</Text>
          {profileData.avatar === 'boy' && (
            <View style={styles.avatarCheckmark}>
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.avatarOption,
            profileData.avatar === 'girl' && styles.avatarOptionSelected
          ]}
          onPress={() => setProfileData({ ...profileData, avatar: 'girl' })}
        >
          <Image 
            source={require(`${Base_URL}/assets/images/avatars/girl.png`)}
            style={styles.avatarImage}
          />
          <Text style={styles.avatarText}>Girl</Text>
          {profileData.avatar === 'girl' && (
            <View style={styles.avatarCheckmark}>
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.customAvatarContainer}>
        <Text style={styles.customAvatarTitle}>Or Upload Your Own</Text>
        
        <View style={styles.customAvatarButtons}>
          <TouchableOpacity
            style={[styles.customAvatarButton, isUploading && styles.customAvatarButtonDisabled]}
            onPress={handleTakePhoto}
            disabled={isUploading}
          >
            <Ionicons name="camera" size={24} color={isUploading ? colors.text.secondary : colors.primary} />
            <Text style={[styles.customAvatarButtonText, isUploading && styles.customAvatarButtonTextDisabled]}>
              {isUploading ? 'Taking Photo...' : 'Take Photo'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.customAvatarButton, isUploading && styles.customAvatarButtonDisabled]}
            onPress={handleCustomAvatarUpload}
            disabled={isUploading}
          >
            <Ionicons name="images" size={24} color={isUploading ? colors.text.secondary : colors.primary} />
            <Text style={[styles.customAvatarButtonText, isUploading && styles.customAvatarButtonTextDisabled]}>
              {isUploading ? 'Uploading...' : 'Choose Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {profileData.avatar && profileData.avatar !== 'boy' && profileData.avatar !== 'girl' && (
          <View style={styles.customAvatarPreview}>
            <Text style={styles.customAvatarPreviewText}>Selected Image:</Text>
            <Image 
              source={{ uri: profileData.avatar }} 
              style={styles.customAvatarPreviewImage}
            />
            <View style={styles.customAvatarCheckmark}>
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            </View>
            <TouchableOpacity
              style={styles.removeAvatarButton}
              onPress={() => setProfileData({ ...profileData, avatar: undefined })}
            >
              <Ionicons name="close-circle" size={20} color={colors.error || '#FF6B6B'} />
              <Text style={styles.removeAvatarButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const AgeStep: React.FC<StepProps> = ({ profileData, setProfileData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let&apos;s Learn About Your Family!</Text>
    <Text style={styles.stepQuestion}>How old is your child?</Text>
    
    <Dropdown
      value={profileData.age}
      placeholder="Select Age"
      options={config.ageRanges}
      onSelect={(value) => setProfileData({ ...profileData, age: value as string })}
    />
  </View>
);

const GenderStep: React.FC<StepProps> = ({ profileData, setProfileData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let&apos;s Learn About Your Family!</Text>
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
          source={require(`${Base_URL}/assets/images/avatars/girl.png`)}
          style={styles.genderAvatar}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.genderOption,
          profileData.gender === 'boy' && styles.genderOptionSelected
        ]}
        onPress={() => setProfileData({ ...profileData, gender: 'boy' })}
      >
        <Image 
          source={require(`${Base_URL}/assets/images/avatars/boy.png`)}
          style={styles.genderAvatar}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const RestrictionsStep: React.FC<StepProps> = ({ profileData, setProfileData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let&apos;s Learn About Your Family!</Text>
    <Text style={styles.stepQuestion}>
      Does your child have allergies or dietary restrictions?
    </Text>
    
    <Dropdown
      value={profileData.restrictions}
      placeholder="Select your Restrictions"
      options={config.dietaryRestrictions}
      onSelect={(value) => setProfileData({ ...profileData, restrictions: value as string[] })}
      multiple={true}
      maxHeight={250}
    />
  </View>
);

const FoodSelectionStep: React.FC<FoodSelectionStepProps> = ({ type, profileData, setProfileData, foods }) => {
  const handleFoodToggle = (foodId: string) => {
    const current = profileData[type] || [];
    const updated = current.includes(foodId)
      ? current.filter((f: string) => f !== foodId)
      : [...current, foodId];
    setProfileData({ ...profileData, [type]: updated });
  };
  
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Let&apos;s Learn About Your Family!</Text>
      <Text style={styles.stepQuestion}>
        What {type.charAt(0).toUpperCase() + type.slice(1)} have been Introduced?
      </Text>
      
      <ScrollView 
        style={styles.foodGridScrollView}
        contentContainerStyle={styles.foodGrid}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {foods.map((food: Food) => (
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 50,
    alignItems: 'center',
  },
  mascot: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
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
    marginBottom: 16,
  },
  stepSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    marginTop: 8,
    marginBottom: 8,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
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
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1000,
    ...shadowPresets.medium,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 4,
    marginHorizontal: 8,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.primary,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  dropdownOptionTextSelected: {
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
    borderColor: colors.border,
    width: (width - 72) / 2,
  },
  genderOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
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
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    marginBottom: 16,
  },
  avatarOption: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderColor: colors.border,
    width: (width - 72) / 2,
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  avatarImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  customAvatarContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  customAvatarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 16,
  },
  customAvatarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  customAvatarButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    minWidth: 120,
  },
  customAvatarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  customAvatarButtonDisabled: {
    opacity: 0.6,
    borderColor: colors.text.secondary,
  },
  customAvatarButtonTextDisabled: {
    color: colors.text.secondary,
  },
  customAvatarPreview: {
    alignItems: 'center',
    marginTop: 16,
  },
  customAvatarPreviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
  },
  customAvatarPreviewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  customAvatarCheckmark: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  removeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.error || '#FF6B6B',
    marginTop: 12,
  },
  removeAvatarButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error || '#FF6B6B',
    marginLeft: 4,
  },
  foodGridScrollView: {
    maxHeight: 400,
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
    marginBottom: 12,
  },
  foodImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  foodImageSelected: {
    backgroundColor: colors.primary + '30',
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
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width - 64,
    gap: 70,
  },
  buttonContainer: {
    flex: 1,
  },
  singleNextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: width - 64,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...shadowPresets.medium,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...shadowPresets.medium,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadowPresets.medium,
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ProfileSetupScreen;