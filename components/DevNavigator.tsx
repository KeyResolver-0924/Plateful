import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { DEV_CONFIG } from '../constants/config';

interface DevNavigatorProps {
  visible?: boolean;
  onClose?: () => void;
}

const DevNavigator: React.FC<DevNavigatorProps> = ({ visible = true, onClose }) => {
  if (!__DEV__ || !visible) return null;

  const navigateToPage = (page: string, title: string) => {
    console.log(`DevNavigator: Navigating to ${title} (${page})`);
    router.replace(page);
    onClose?.();
  };

  const clearStorage = async () => {
    Alert.alert(
      'Clear Storage',
      'This will clear all AsyncStorage data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            console.log('DevNavigator: Storage cleared');
            router.replace('/');
          }
        }
      ]
    );
  };

  const setMockAuthState = async (userToken: string | null, onboardingComplete: string | null) => {
    if (userToken) await AsyncStorage.setItem('userToken', userToken);
    else await AsyncStorage.removeItem('userToken');
    
    if (onboardingComplete) await AsyncStorage.setItem('onboardingComplete', onboardingComplete);  
    else await AsyncStorage.removeItem('onboardingComplete');
    
    console.log('DevNavigator: Mock auth state set', { userToken: !!userToken, onboardingComplete });
    router.replace('/');
  };

  const pages = [
    { key: 'HOME', title: '🏠 Home Dashboard', page: DEV_CONFIG.PAGES.HOME },
    { key: 'SIGN_IN', title: '🔐 Sign In', page: DEV_CONFIG.PAGES.SIGN_IN },
    { key: 'SIGN_UP', title: '📝 Sign Up', page: DEV_CONFIG.PAGES.SIGN_UP },
    { key: 'ONBOARDING', title: '👋 Onboarding', page: DEV_CONFIG.PAGES.ONBOARDING },
    { key: 'SPLASH', title: '🌟 Splash Screen', page: DEV_CONFIG.PAGES.SPLASH },
    { key: 'PROFILE', title: '👤 Profile', page: DEV_CONFIG.PAGES.PROFILE },
    { key: 'FOOD', title: '🍎 Food', page: DEV_CONFIG.PAGES.FOOD },
    { key: 'MEALS', title: '🍽️ Meals', page: DEV_CONFIG.PAGES.MEALS },
    { key: 'DEBUG', title: '🔧 Debug Reset', page: DEV_CONFIG.PAGES.DEBUG },
  ];

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🚀 Dev Navigator</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Quick Navigation</Text>
          {pages.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.pageButton}
              onPress={() => navigateToPage(item.page, item.title)}
            >
              <Text style={styles.pageButtonText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
          
          <Text style={styles.sectionTitle}>Mock States</Text>
          
          <TouchableOpacity
            style={[styles.pageButton, styles.mockButton]}
            onPress={() => setMockAuthState('mock-token', 'true')}
          >
            <Text style={styles.pageButtonText}>👤 Mock Authenticated User</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.pageButton, styles.mockButton]}
            onPress={() => setMockAuthState(null, 'true')}
          >
            <Text style={styles.pageButtonText}>🔄 Mock Returning User</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.pageButton, styles.mockButton]}
            onPress={() => setMockAuthState(null, null)}
          >
            <Text style={styles.pageButtonText}>🆕 Mock First Time User</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.pageButton, styles.dangerButton]}
            onPress={clearStorage}
          >
            <Text style={[styles.pageButtonText, styles.dangerText]}>🗑️ Clear All Storage</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    maxHeight: 500,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  pageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
  },
  mockButton: {
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  dangerButton: {
    backgroundColor: colors.error + '10',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  pageButtonText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  dangerText: {
    color: colors.error,
  },
});

export default DevNavigator; 