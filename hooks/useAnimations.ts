import { useCallback } from 'react';
import {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}

export const useAnimations = () => {
  const createFadeInAnimation = useCallback((
    config: AnimationConfig = {}
  ) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50);
    
    const startAnimation = useCallback(() => {
      opacity.value = withDelay(
        config.delay || 0,
        withTiming(1, { duration: config.duration || 800 })
      );
      translateY.value = withDelay(
        config.delay || 0,
        withSpring(0, {
          damping: config.damping || 15,
          stiffness: config.stiffness || 100,
          mass: config.mass || 1,
        })
      );
    }, [config]);
    
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    }));
    
    return { startAnimation, animatedStyle };
  }, []);
  
  const createScaleAnimation = useCallback((
    config: AnimationConfig = {}
  ) => {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);
    
    const startAnimation = useCallback(() => {
      scale.value = withDelay(
        config.delay || 0,
        withSpring(1, {
          damping: config.damping || 15,
          stiffness: config.stiffness || 100,
        })
      );
      opacity.value = withDelay(
        config.delay || 0,
        withTiming(1, { duration: config.duration || 500 })
      );
    }, [config]);
    
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    }));
    
    return { startAnimation, animatedStyle };
  }, []);
  
  const createStaggeredAnimation = useCallback((
    count: number,
    config: AnimationConfig = {}
  ) => {
    const animations = Array.from({ length: count }, () => {
      const opacity = useSharedValue(0);
      const translateY = useSharedValue(30);
      
      return { opacity, translateY };
    });
    
    const startAnimation = useCallback(() => {
      animations.forEach((animation, index) => {
        const delay = (config.delay || 0) + (index * (config.duration || 100));
        
        animation.opacity.value = withDelay(
          delay,
          withTiming(1, { duration: config.duration || 600 })
        );
        animation.translateY.value = withDelay(
          delay,
          withSpring(0, {
            damping: config.damping || 15,
            stiffness: config.stiffness || 100,
          })
        );
      });
    }, [animations, config]);
    
    const getAnimatedStyle = useCallback((index: number) => {
      return useAnimatedStyle(() => ({
        opacity: animations[index].opacity.value,
        transform: [{ translateY: animations[index].translateY.value }]
      }));
    }, [animations]);
    
    return { startAnimation, getAnimatedStyle };
  }, []);
  
  const createScrollAnimation = useCallback((
    scrollX: any,
    inputRange: number[],
    outputRange: number[]
  ) => {
    return useAnimatedStyle(() => {
      const value = interpolate(
        scrollX.value,
        inputRange,
        outputRange,
        Extrapolate.CLAMP
      );
      
      return { transform: [{ translateX: value }] };
    });
  }, []);
  
  const createPressAnimation = useCallback(() => {
    const scale = useSharedValue(1);
    
    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 100 });
    }, []);
    
    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, []);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
    }));
    
    return { handlePressIn, handlePressOut, animatedStyle };
  }, []);
  
  return {
    createFadeInAnimation,
    createScaleAnimation,
    createStaggeredAnimation,
    createScrollAnimation,
    createPressAnimation,
  };
}; 