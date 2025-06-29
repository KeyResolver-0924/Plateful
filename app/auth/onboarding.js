import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
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
import Button from '../../components/common/Button';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const onboardingData = [
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
  const scrollRef = useRef(null);
  
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
  
  const animateTransition = (nextIndex) => {
    console.log('animateTransition called with nextIndex:', nextIndex);
    // Start loading animation
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
  
  const handleNext = () => {
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
  
  const handleSkip = () => {
    if (router && router.replace) {
      router.replace('/auth/sign-in');
    } else {
      console.error('Router is not available');
    }
  };
  
  // Button press animations
  const handleButtonPressIn = () => {
    setIsButtonPressed(true);
    buttonScale.value = withTiming(0.95, { duration: 150 });
  };
  
  const handleButtonPressOut = () => {
    setIsButtonPressed(false);
    buttonScale.value = withTiming(1, { duration: 150 });
  };
  
  const handleButtonHoverIn = () => {
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
  
  const handleButtonHoverOut = () => {
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
  
  const boundarySpinnerStyle = useAnimatedStyle(() => {
    const progress = boundarySpinnerProgress.value;
    return {
      opacity: isHovering.value ? 1 : 0,
      transform: [{ rotate: `${progress * 360}deg` }],
    };
  });
  
  const BoundarySpinner = () => {
    return (
      <Animated.View style={[styles.boundarySpinner, boundarySpinnerStyle]}>
        <Animated.View style={[styles.spinnerDot, { top: 0, left: '50%', marginLeft: -4 }]} />
        <Animated.View style={[styles.spinnerDot, { top: '50%', right: 0, marginTop: -4 }]} />
        <Animated.View style={[styles.spinnerDot, { bottom: 0, left: '50%', marginLeft: -4 }]} />
        <Animated.View style={[styles.spinnerDot, { top: '50%', left: 0, marginTop: -4 }]} />
      </Animated.View>
    );
  };
  
  const OnboardingItem = ({ item, index }) => {
    // Define the range for this specific item
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    //                  [previous page,      current page,   next page]
    
    const animatedStyle = useAnimatedStyle(() => {
      // Scale animation: items scale down when not in focus
      const scale = interpolate(
        scrollX.value,        // Current scroll position
        inputRange,           // When to trigger animation
        [0.2, 1, 0.2],       // Scale values: smaller -> normal -> smaller
        Extrapolate.CLAMP     // Don't go beyond 0.8-1 range
      );
      
      // Opacity animation: items fade when not in focus
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.1, 1, 0.1],       // Opacity values: faded -> full -> faded
        Extrapolate.CLAMP
      );
      
      return {
        transform: [{ scale }],
        opacity,
      };
    });
    
    // Only apply transition animations to the current item
    const transitionStyle = useAnimatedStyle(() => {
      if (index === currentIndex) {
        return {
          opacity: fadeOpacity.value,
          transform: [{ scale: contentScale.value }],
        };
      }
      return {};
    });
    
    return (
      <Animated.View style={[styles.itemContainer, transitionStyle]}>
        <Animated.View style={[styles.characterContainer, animatedStyle]}>
          <Image 
            source={item.character} 
            style={[
              styles.character, 
              { width: 352, height: 440, resizeMode: 'cover' }
            ]} 
          />
        </Animated.View>
        
        <View style={styles.contentContainer}>
          <Animated.Text style={[
            styles.title, 
            index === currentIndex ? titleAnimatedStyle : {}
          ]}>
            {item.title}
          </Animated.Text>
          <Animated.Text style={[
            styles.description, 
            index === currentIndex ? { opacity: fadeOpacity.value } : {}
          ]}>
            {item.description}
          </Animated.Text>
        </View>
      </Animated.View>
    );
  };
  
  const Pagination = () => {
    return (
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = useAnimatedStyle(() => {
            const width = interpolate(
              scrollX.value,
              inputRange,
              [8, 24, 8],
              Extrapolate.CLAMP
            );
            
            return { width };
          });
          
          const dotOpacity = useAnimatedStyle(() => {
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.3, 1, 0.3],
              Extrapolate.CLAMP
            );
            
            return { opacity };
          });
          
          return (
            <Animated.View
              key={index}
              style={[styles.dot, dotWidth, dotOpacity]}
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          if (!isTransitioning) {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }
        }}
      >
        {onboardingData.map((item, index) => (
          <OnboardingItem key={item.id} item={item} index={index} />
        ))}
      </Animated.ScrollView>
      
      <View style={styles.bottomContainer}>
        <Pagination />
        
        <View style={styles.buttonContainer}>
          {currentIndex < onboardingData.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              
              <Animated.View style={buttonAnimatedStyle}>
                <View style={styles.buttonWrapper}>
                  <BoundarySpinner />
                  <TouchableOpacity 
                    style={[
                      styles.nextButton, 
                      isButtonPressed && styles.nextButtonPressed
                    ]} 
                    onPress={handleNext}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    onHoverIn={handleButtonHoverIn}
                    onHoverOut={handleButtonHoverOut}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Animated.View style={spinnerAnimatedStyle}>
                        <Ionicons name="refresh" size={24} color={colors.text.inverse} />
                      </Animated.View>
                    ) : (
                      <Ionicons name="arrow-forward" size={24} color={colors.text.inverse} />
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </>
          ) : (
            <View style={styles.getStartedContainer}>
              <Animated.View style={buttonAnimatedStyle}>
                <View style={styles.buttonWrapper}>
                  <BoundarySpinner />
                  <TouchableOpacity
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    onHoverIn={handleButtonHoverIn}
                    onHoverOut={handleButtonHoverOut}
                    disabled={isLoading}
                  >
                    <Button
                      title={isLoading ? "Loading..." : "Get Started"}
                      onPress={handleNext}
                      style={[
                        styles.getStartedButton,
                        isButtonPressed && styles.getStartedButtonPressed
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width,
    alignItems: 'center',
    paddingTop: height * 0.05,
  },
  characterContainer: {
    marginBottom: 40,
  },
  character: {
    resizeMode: 'contain',
  },
  contentContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
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
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.inverse,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  skipText: {
    fontSize: 16,
    color: colors.text.inverse,
    fontWeight: '500',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonPressed: {
    backgroundColor: colors.primary,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
  },
  getStartedButton: {
    width: 200,
    alignSelf: 'center',
  },
  getStartedButtonPressed: {
    opacity: 0.8,
  },
  boundarySpinner: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.text.inverse,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.inverse,
    position: 'absolute',
  },
  buttonWrapper: {
    position: 'relative',
  },
  getStartedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default OnboardingScreen;