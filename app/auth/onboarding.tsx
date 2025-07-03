import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
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
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';

// import Constants from 'expo-constants';
import { firebaseConfig } from '../../utils/firebaseConfig';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: number;
  character: any;
  title: string;
  description: string;
  characterStyle: { width: number; height: number };
}

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    character: require('../../assets/images/characters/carrot.png'),
    title: 'Empowering You to Take Control\nof Your Kids Health',
    description: 'Lorem ipsum dolor sit amet consectetur.\nPorttitor egestas venenatis at nibh urna.',
    characterStyle: { width: 360, height: 480 }
  },
  {
    id: 2,
    character: require('../../assets/images/characters/strawberry.png'),
    title: 'Empowering You to Take Control\nof Your Kids Health',
    description: 'Lorem ipsum dolor sit amet consectetur.\nPorttitor egestas venenatis at nibh urna.',
    characterStyle: { width: 360, height: 480 }
  },
  {
    id: 3,
    character: require('../../assets/images/characters/garlic.png'),
    title: 'Empowering You to Take Control\nof Your Kids Health',
    description: 'Lorem ipsum dolor sit amet consectetur.\nPorttitor egestas venenatis at nibh urna.',
    characterStyle: { width: 360, height: 480 }
  }
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<any>(null);
  
  // Animation values for transitions
  const fadeOpacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const spinnerRotation = useSharedValue(0);
  const contentScale = useSharedValue(1);
  const titleFontSize = useSharedValue(24);
  const boundarySpinnerProgress = useSharedValue(0);
  const isHovering = useSharedValue(false);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  
  const animateTransition = (nextIndex: number): void => {
    console.log('animateTransition called with nextIndex:', nextIndex);
    // Start loading animation
    console.log(firebaseConfig.apiKey, "This is the API key ofor firebase");
    setIsLoading(true);
    setIsTransitioning(true);
    spinnerRotation.value = withRepeat(
      withSequence(
        withTiming(360, { duration: 1000 })
      ),
      -1,
      false
    );
    
    // Dynamic transition effects
    contentScale.value = withTiming(0.8, { duration: 200 }, () => {
      fadeOpacity.value = withTiming(0.2, { duration: 300 }, () => {
        // After fade out, scroll to next item
        runOnJS(() => {
          console.log('Scrolling to index:', nextIndex, 'at position:', nextIndex * width);
          scrollRef.current?.scrollTo({
            x: nextIndex * width,
            animated: true
          });
          console.log('Setting currentIndex to:', nextIndex);
          setCurrentIndex(nextIndex);
          
          // Animate font size
          titleFontSize.value = withTiming(28, { duration: 200 }, () => {
            titleFontSize.value = withTiming(28, { duration: 200 });
          });
          
          // Fade in and scale up new content
          fadeOpacity.value = withTiming(1, { duration: 400 }, () => {
            contentScale.value = withTiming(1, { duration: 300 }, () => {
              runOnJS(() => {
                console.log('Animation completed, setting loading to false');
                setIsLoading(false);
                setIsTransitioning(false);
                spinnerRotation.value = 0;
              });
            });
          });
        })();
      });
    });
  };
  
  const handleNext = (): void => {
    console.log('handleNext called, currentIndex:', currentIndex, 'total items:', onboardingData.length);
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log('Transitioning to index:', nextIndex);
      animateTransition(nextIndex);
    } else {
      console.log('Navigating to sign-in');
      if (router && router.replace) {
        router.replace('/auth/sign-in');
      } else {
        console.error('Router is not available');
      }
    }
  };
  
  const handleSkip = (): void => {
    if (router && router.replace) {
      router.replace('/auth/sign-in');
    } else {
      console.error('Router is not available');
    }
  };
  
  // Button press animations
  const handleButtonPressIn = (): void => {
    setIsButtonPressed(true);
    buttonScale.value = withTiming(0.95, { duration: 150 });
  };
  
  const handleButtonPressOut = (): void => {
    setIsButtonPressed(false);
    buttonScale.value = withTiming(1, { duration: 150 });
  };
  
  const handleButtonHoverIn = (): void => {
    isHovering.value = true;
    boundarySpinnerProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  };
  
  const handleButtonHoverOut = (): void => {
    isHovering.value = false;
    boundarySpinnerProgress.value = withTiming(0, { duration: 200 });
  };
  
  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const spinnerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spinnerRotation.value}deg` }],
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeOpacity.value,
      transform: [{ scale: contentScale.value }],
    };
  });
  
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      fontSize: titleFontSize.value,
    };
  });
  
  const BoundarySpinner = () => {
    const boundarySpinnerStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${boundarySpinnerProgress.value * 360}deg` }],
      };
    });
    
    return (
      <Animated.View style={[styles.boundarySpinner, boundarySpinnerStyle]}>
        <Ionicons name="refresh" size={20} color={colors.primary} />
      </Animated.View>
    );
  };
  
  const OnboardingItem = ({ item, index }: { item: OnboardingItem; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const imageAnimatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );
      
      return {
        transform: [{ scale }],
        opacity,
      };
    });
    
    const titleAnimatedStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [50, 0, 50],
        Extrapolate.CLAMP
      );
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );
      
      return {
        transform: [{ translateY }],
        opacity,
      };
    });
    
    const descriptionAnimatedStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [30, 0, 30],
        Extrapolate.CLAMP
      );
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );
      
      return {
        transform: [{ translateY }],
        opacity,
      };
    });
    
    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
          <Image source={item.character} style={[styles.character, item.characterStyle]} />
        </Animated.View>
        
        <Animated.View style={[styles.textContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>{item.title}</Text>
        </Animated.View>
        
        <Animated.View style={[styles.descriptionContainer, descriptionAnimatedStyle]}>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };
  
  const Pagination = () => {
    return (
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => {
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
              opacity,
            };
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
                dotAnimatedStyle,
              ]}
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.background}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
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
          
          <View style={styles.buttonContainer}>
            <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle]}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  isButtonPressed && styles.nextButtonPressed,
                  isLoading && styles.nextButtonLoading,
                ]}
                onPress={handleNext}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
                disabled={isLoading || isTransitioning}
              >
                {isLoading ? (
                  <Animated.View style={[styles.spinner, spinnerAnimatedStyle]}>
                    <Ionicons name="refresh" size={24} color={colors.text.inverse} />
                  </Animated.View>
                ) : (
                  <>
                    <Text style={styles.nextButtonText}>
                      {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    <Ionicons name="arrow-forward" size={24} color={colors.text.inverse} />
                  </>
                )}
                <BoundarySpinner />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    marginBottom: 40,
  },
  character: {
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
    textAlign: 'center',
    lineHeight: 36,
  },
  descriptionContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  description: {
    fontSize: 16,
    color: colors.text.inverse,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.inverse,
    marginHorizontal: 4,
    opacity: 0.4,
  },
  activeDot: {
    opacity: 1,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  buttonWrapper: {
    position: 'relative',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text.inverse,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  nextButtonLoading: {
    opacity: 0.8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  spinner: {
    marginRight: 8,
  },
  boundarySpinner: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingScreen; 