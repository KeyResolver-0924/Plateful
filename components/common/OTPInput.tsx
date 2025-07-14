import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../constants/colors';

interface OTPInputProps {
  length: number;
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  error?: string;
  keyboardType?: 'numeric' | 'default';
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length,
  value,
  onChange,
  label,
  error,
  keyboardType = 'numeric',
  autoFocus = false
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleOtpChange = (text: string, index: number): void => {
    const newOtp = [...value];
    newOtp[index] = text;
    onChange(newOtp);
  };

  const handleKeyPress = (e: any, index: number): void => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      // Focus previous input on backspace
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.otpContainer}>
        {Array.from({ length }, (_, index) => (
          <TextInput
            key={index}
            data-index={index}
            value={value[index] || ''}
            onChangeText={(text: string) => handleOtpChange(text, index)}
            onKeyPress={(e: any) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            placeholder="0"
            keyboardType={keyboardType}
            maxLength={1}
            style={{
              ...styles.otpInput,
              ...(focusedIndex === index ? styles.otpInputFocused : {}),
              ...(value[index] ? styles.otpInputFilled : {})
            }}
            textAlign="center"
            autoFocus={autoFocus && index === 0}
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 56,
    fontSize: 20,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
  },
  otpInputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  otpInputFilled: {
    borderColor: colors.success,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 8,
  },
});

export default OTPInput; 