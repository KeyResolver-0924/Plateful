import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    character: require('../../assets/images/characters/carrot.png'),
    title: 'Empowering You to Take Control\nof Your Kids Health',
    description: 'Lorem ipsum dolor sit amet consectetur.\nPorttitor egestas venenatis at nibh urna.',
    characterStyle: { width: 180, height: 240 }
  },
  {
    id: 2,
    character: require('../../assets/images/characters/strawberry.png'),
    title: 'Empowering You to Take Control\nof Your Kids Health',
    description: 'Lorem ipsum dolor sit amet consectetur.\nPorttitor egestas venenatis at nibh urna.',
    characterStyle: { width: 160, height: 220 }
  },
  {
    id: 3,
    character: require('../../assets/images/characters/garlic.png'),
    title: 'Empowering You to Take Control\nof Your Kids Health',
    description: 'Lorem ipsum dolor sit amet consectetur.\nPorttitor egestas venenatis at nibh urna.',
    characterStyle: { width: 150, height: 200 }
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollRef = useRef(null);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Auth');
    }
  };
  
  const handleSkip = () => {
    navigation.replace('Auth');
  };
  
  const OnboardingItem = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolate.CLAMP
      );
      
      return {
        transform: [{ scale }],
        opacity,
      };
    });
    
    return (
      <View style={styles.itemContainer}>
        <Animated.View style={[styles.characterContainer, animatedStyle]}>
          <Image source={item.character} style={[styles.character, item.characterStyle]} />
        </Animated.View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
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
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
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
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Ionicons name="arrow-forward" size={24} color={colors.text.inverse} />
              </TouchableOpacity>
            </>
          ) : (
            <Button
              title="Get Started"
              onPress={handleNext}
              style={styles.getStartedButton}
            />
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
    paddingTop: height * 0.15,
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
  },
  getStartedButton: {
    flex: 1,
  },
});

export default OnboardingScreen;