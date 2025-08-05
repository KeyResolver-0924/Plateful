import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { colors } from '../../constants/colors';
import { getCountryByCode } from '../../constants/countries';
import CountryPicker from './CountryPicker';

const PhoneInput = ({
  value,
  onChangeText,
  placeholder = "Enter phone number",
  error,
  style,
  containerStyle,
  ...props
}) => {
  const [selectedCountry, setSelectedCountry] = useState(getCountryByCode('US'));
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (value) {
      setPhoneNumber(value);
    }
  }, [value]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    // Update the full phone number with new country code
    const fullNumber = phoneNumber;
    onChangeText(fullNumber);
  };

  const handlePhoneChange = (text) => {
    // Remove any non-digit characters except +
    const cleanedText = text.replace(/[^\d+]/g, '');
    
    // If the text starts with the country calling code, extract only the number part
    if (cleanedText.startsWith(selectedCountry.callingCode)) {
      const numberPart = cleanedText.substring(selectedCountry.callingCode.length);
      setPhoneNumber(numberPart);
      onChangeText(cleanedText);
    } else {
      // If it doesn't start with the calling code, assume it's just the number part
      setPhoneNumber(cleanedText);
      onChangeText(selectedCountry.callingCode + cleanedText);
    }
  };

  const getDisplayValue = () => {
    if (!phoneNumber) return '';
    return phoneNumber;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, error && styles.inputError, style]}>
        <CountryPicker
          selectedCountry={selectedCountry}
          onSelectCountry={handleCountrySelect}
          style={styles.countryPicker}
        />
        
        <View style={styles.phoneInputContainer}>
          <Text style={styles.callingCode}>
            {selectedCountry.callingCode}
          </Text>
          <TextInput
            style={styles.phoneInput}
            value={getDisplayValue()}
            onChangeText={handlePhoneChange}
            placeholder={placeholder}
            keyboardType="phone-pad"
            placeholderTextColor={colors.text.disabled}
            {...props}
          />
        </View>
      </View>
      
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
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  countryPicker: {
    marginRight: 8,
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callingCode: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default PhoneInput; 