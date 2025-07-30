import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import Button from '../../components/common/Button';
import { colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface OnboardingData {
  id: number;
  character: any;
  title: string;
  description: string;
  characterStyle: {
    width: number;
    height: number;
  };
}

interface PaginationDotProps {
  index: number;
  scrollX: SharedValue<number>;
}

interface OnboardingItemProps {
  item: OnboardingData;
  index: number;
}

const onboardingData: OnboardingData[] = [
  {
    id: 1,
    character: require('../../assets/images/characters/carrot.png'),
    title: 'Welcome to PLATEFUL!\nNourishing Little Ones',
    description: 'Track your child\'s nutrition journey with fun, interactive features designed to make healthy eating exciting.',
    characterStyle: { width: 360, height: 480 }
  },
  {
    id: 2,
    character: require('../../assets/images/characters/strawberry.png'),
    title: 'Smart Food Tracking\nMade Simple',
    description: 'Log meals, track nutrition, and discover healthy food choices with our intuitive interface.',
    characterStyle: { width: 360, height: 480 }
  },
  {
    id: 3,
    character: require('../../assets/images/characters/garlic.png'),
    title: 'Gamified Learning\n& Rewards',
    description: 'Earn badges, complete challenges, and make nutrition education fun for your little ones.',
    characterStyle: { width: 360, height: 480 }
  }
];

// Separate component to fix hook violation
const PaginationDot: React.FC<PaginationDotProps> = ({ index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  
  const dotAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1.2, 0.8],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
      opacity
    };
  });
  
  return (
    <Animated.View
      style={[
        {
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.primary,
          marginHorizontal: 6,
        },
        dotAnimatedStyle
      ]}
    />
  );
};

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  
  // Optimized animation values
  const fadeOpacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const spinnerRotation = useSharedValue(0);
  const contentScale = useSharedValue(1);
  const boundarySpinnerProgress = useSharedValue(0);
  const isHovering = useSharedValue(false);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  
  const handleComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      if (router && router.replace) {
        router.replace('/auth/sign-in');
      }
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      if (router && router.replace) {
        router.replace('/auth/sign-in');
      }
    }
  }, []);
  
  const animateTransition = useCallback((nextIndex: number) => {
    console.log('animateTransition called with nextIndex:', nextIndex);
    
    setIsLoading(true);
    setIsTransitioning(true);
    
    // Start loading animation
    fadeOpacity.value = withTiming(0.5, { duration: 300 });
    buttonScale.value = withSpring(0.95);
    
    // Spinner animation
    spinnerRotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false
    );
    
    // Simulate transition delay
    setTimeout(() => {
      if (nextIndex < onboardingData.length) {
        scrollRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true
        });
        setCurrentIndex(nextIndex);
      } else {
        handleComplete();
      }
      
      // Reset animations
      fadeOpacity.value = withTiming(1, { duration: 300 });
      buttonScale.value = withSpring(1);
      spinnerRotation.value = 0;
      setIsLoading(false);
      setIsTransitioning(false);
    }, 1500);
  }, [fadeOpacity, buttonScale, spinnerRotation, handleComplete]);
  
  const handleNext = useCallback(async () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      animateTransition(nextIndex);
    } else {
      try {
        await AsyncStorage.setItem('onboardingComplete', 'true');
        if (router && router.replace) {
          router.replace('/auth/sign-in');
        }
      } catch (error) {
        console.error('Error saving onboarding completion:', error);
        if (router && router.replace) {
          router.replace('/auth/sign-in');
        }
      }
    }
  }, [currentIndex, animateTransition]);
  
  const handleSkip = useCallback(async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      if (router && router.replace) {
        router.replace('/auth/sign-in');
      }
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      if (router && router.replace) {
        router.replace('/auth/sign-in');
      }
    }
  }, []);
  
  const handleButtonPressIn = useCallback(() => {
    buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 100 });
  }, [buttonScale]);
  
  const handleButtonPressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, [buttonScale]);
  
  const handleButtonHoverIn = useCallback(() => {
    isHovering.value = true;
    boundarySpinnerProgress.value = withTiming(1, { duration: 300 });
  }, [isHovering, boundarySpinnerProgress]);
  
  const handleButtonHoverOut = useCallback(() => {
    isHovering.value = false;
    boundarySpinnerProgress.value = withTiming(0, { duration: 300 });
  }, [isHovering, boundarySpinnerProgress]);
  
  // Optimized animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));
  
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ scale: contentScale.value }]
  }));
  
  const spinnerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinnerRotation.value}deg` }]
  }));
  
  const boundarySpinnerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      boundarySpinnerProgress.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    )
  }));
  
  const BoundarySpinner = () => (
    <Animated.View style={[styles.boundarySpinner, boundarySpinnerAnimatedStyle]}>
      <Animated.View style={[styles.spinner, spinnerAnimatedStyle]}>
        <Ionicons name="refresh" size={20} color={colors.primary} />
      </Animated.View>
    </Animated.View>
  );
  
  const OnboardingItem: React.FC<OnboardingItemProps> = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.characterContainer}>
          <Image 
            source={item.character} 
            style={[styles.character, item.characterStyle]}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };
  
  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <PaginationDot key={index} index={index} scrollX={scrollX} />
        ))}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>PLATEFUL</Text>
        <Text style={styles.headerSubtitle}>Nourishing Little Ones</Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {onboardingData.map((item, index) => (
            <OnboardingItem key={item.id} item={item} index={index} />
          ))}
        </Animated.ScrollView>
        
        <Pagination />
        
        <Animated.View style={[styles.buttonContainer, contentAnimatedStyle]}>
          <Button
            title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            loading={isLoading}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            style={buttonAnimatedStyle}
          />
          
          {currentIndex < onboardingData.length - 1 && (
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              onPressIn={handleButtonHoverIn}
              onPressOut={handleButtonHoverOut}
            >
              <Text style={styles.skipText}>Skip</Text>
              <BoundarySpinner />
            </TouchableOpacity>
          )}
        </Animated.View>
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
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  itemContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  characterContainer: {
    marginBottom: 40,
  },
  character: {
    resizeMode: 'contain',
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginRight: 8,
  },
  boundarySpinner: {
    position: 'absolute',
    right: 0,
  },
  spinner: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingScreen;