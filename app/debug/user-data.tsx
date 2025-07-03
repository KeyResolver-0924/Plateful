import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../../constants/colors';
import authService from '../../utils/authService';

const UserDataDebugScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [storedData, setStoredData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Get data from AuthService
      const currentUser = authService.getCurrentUser();
      const storedUserData = await authService.getStoredUserData();
      const isAuth = authService.isAuthenticated();
      
      // Get all AsyncStorage data
      const allStoredData = await getAllStoredData();
      
      setUserData({
        currentUser,
        storedUserData,
        isAuthenticated: isAuth
      });
      setStoredData(allStoredData);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const getAllStoredData = async (): Promise<any> => {
    const keys = await AsyncStorage.getAllKeys();
    const data: any = {};
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      try {
        data[key] = JSON.parse(value || '');
      } catch {
        data[key] = value;
      }
    }
    
    return data;
  };

  const clearAllData = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      await authService.clearStoredData();
      Alert.alert('Success', 'All data cleared');
      loadUserData();
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Data Debug</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current User (AuthService)</Text>
        <Text style={styles.dataText}>
          {JSON.stringify(userData, null, 2)}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Stored Data (AsyncStorage)</Text>
        <Text style={styles.dataText}>
          {JSON.stringify(storedData, null, 2)}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={loadUserData}>
        <Text style={styles.buttonText}>Refresh Data</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearAllData}>
        <Text style={styles.buttonText}>Clear All Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 10,
  },
  dataText: {
    fontSize: 12,
    color: colors.text.secondary,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: colors.error || '#ff4444',
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default UserDataDebugScreen; 