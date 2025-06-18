import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  icon,
  keyboardType = 'default',
  maxLength,
  editable = true,
  style,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);
  const focusAnimation = useSharedValue(0);
  
  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, { duration: 200 });
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      focusAnimation.value = withTiming(0, { duration: 200 });
    }
  };
  
  const labelAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      focusAnimation.value,
      [0, 1],
      [18, -8]
    );
    const scale = interpolate(
      focusAnimation.value,
      [0, 1],
      [1, 0.8]
    );
    
    return {
      transform: [
        { translateY },
        { scale }
      ]
    };
  });
  
  const borderAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        error ? colors.error : isFocused ? colors.primary : colors.border,
        { duration: 200 }
      ),
      borderWidth: withTiming(isFocused ? 2 : 1, { duration: 200 })
    };
  });
  
  React.useEffect(() => {
    if (value) {
      focusAnimation.value = withTiming(1, { duration: 200 });
    }
  }, [value]);
  
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        <Animated.View style={[styles.inputContainer, borderAnimatedStyle]}>
          {icon && (
            <View style={styles.iconContainer}>
              {React.cloneElement(icon, {
                size: 20,
                color: isFocused ? colors.primary : colors.text.secondary
              })}
            </View>
          )}
          
          <View style={styles.inputWrapper}>
            {label && (
              <Animated.Text style={[styles.label, labelAnimatedStyle]}>
                {label}
              </Animated.Text>
            )}
            
            <TextInput
              ref={inputRef}
              style={[styles.input, style]}
              value={value}
              onChangeText={onChangeText}
              placeholder={isFocused ? placeholder : ''}
              placeholderTextColor={colors.text.disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={secureTextEntry && !showPassword}
              keyboardType={keyboardType}
              maxLength={maxLength}
              editable={editable}
              {...props}
            />
          </View>
          
          {secureTextEntry && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 0,
    fontSize: 16,
    color: colors.text.secondary,
    backgroundColor: colors.background,
    paddingHorizontal: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default Input;