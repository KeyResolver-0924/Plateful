# User Data Access Guide for Plateful App

## Overview
This guide explains how to check and access inputted user data like user accounts, profiles, and other stored information in your Plateful app.

## 🔍 **Where User Data is Stored**

### 1. **Local Storage (AsyncStorage)**
- **Location**: Device's local storage
- **Purpose**: Cached user data for offline access
- **Storage Keys**:
  - `@plateful_user_token` - Authentication token
  - `@plateful_user_data` - User profile data
  - `@plateful_auth_state` - Authentication state

### 2. **Firebase Firestore (Cloud Database)**
- **Location**: Cloud database (when Firebase is configured)
- **Purpose**: Primary data storage and synchronization
- **Collections**:
  - `users` - User profiles and account data
  - `otpCodes` - OTP verification codes
  - `children` - Child profiles
  - `meals` - Meal history
  - `foods` - Food database

## 🛠 **How to Access User Data**

### **Method 1: Using AuthService (Recommended)**

```javascript
import authService from '../utils/authService';

// Get current user data
const getCurrentUserData = async () => {
  try {
    // Get stored user data from local storage
    const userData = await authService.getStoredUserData();
    console.log('Current user data:', userData);
    return userData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Get current user object
const getCurrentUser = () => {
  const user = authService.getCurrentUser();
  console.log('Current user:', user);
  return user;
};

// Check if user is authenticated
const isUserAuthenticated = () => {
  const isAuth = authService.isAuthenticated();
  console.log('Is authenticated:', isAuth);
  return isAuth;
};
```

### **Method 2: Direct AsyncStorage Access**

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_TOKEN: '@plateful_user_token',
  USER_DATA: '@plateful_user_data',
  AUTH_STATE: '@plateful_auth_state'
};

// Get all stored user data
const getAllStoredData = async () => {
  try {
    const [token, userData, authState] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN),
      AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      AsyncStorage.getItem(STORAGE_KEYS.AUTH_STATE)
    ]);

    console.log('Stored Token:', token);
    console.log('Stored User Data:', userData ? JSON.parse(userData) : null);
    console.log('Auth State:', authState);

    return {
      token,
      userData: userData ? JSON.parse(userData) : null,
      authState
    };
  } catch (error) {
    console.error('Error getting stored data:', error);
    return null;
  }
};
```

### **Method 3: Firebase Firestore Access (When Configured)**

```javascript
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../utils/firebaseConfig';

// Initialize Firebase (if not already done)
const db = getFirestore();

// Get user profile from Firestore
const getUserProfileFromFirestore = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Firestore user data:', userData);
      return userData;
    } else {
      console.log('User not found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    return null;
  }
};

// Get all users (Admin only)
const getAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    console.log('All users:', users);
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};
```

## 📱 **Creating a Debug Screen**

Here's how to create a debug screen to view user data:

```javascript
// app/debug/user-data.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../utils/authService';
import { colors } from '../../constants/colors';

const UserDataDebugScreen = () => {
  const [userData, setUserData] = useState(null);
  const [storedData, setStoredData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
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

  const getAllStoredData = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const data = {};
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }
    
    return data;
  };

  const clearAllData = async () => {
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
    backgroundColor: colors.error,
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
```

## 🔧 **Quick Debug Commands**

### **In React Native Debugger or Console:**

```javascript
// Get current user data
const userData = await authService.getStoredUserData();
console.log('User Data:', userData);

// Get authentication state
const isAuth = authService.isAuthenticated();
console.log('Is Authenticated:', isAuth);

// Get current user
const user = authService.getCurrentUser();
console.log('Current User:', user);

// Get stored token
const token = await authService.getStoredToken();
console.log('Token:', token);

// Clear all data
await authService.clearStoredData();
console.log('Data cleared');
```

## 📊 **User Data Structure**

### **Typical User Data Object:**
```javascript
{
  userId: "user_123",
  email: "user@example.com",
  userType: "parent",
  profile: {
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+1234567890",
    avatar: "",
    timezone: "America/New_York",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: "2024-01-01T00:00:00.000Z",
    isActive: true,
    emailVerified: true,
    phoneVerified: true
  },
  subscription: {
    planType: "free",
    status: "active",
    startDate: "2024-01-01T00:00:00.000Z",
    endDate: null,
    paymentMethodId: null
  },
  preferences: {
    notifications: {
      mealReminders: true,
      reportGeneration: true,
      achievements: true
    },
    language: "en",
    units: "imperial"
  }
}
```

## 🚨 **Important Notes**

1. **Mock Mode**: When Firebase is not configured, the app uses mock data stored in AsyncStorage
2. **Security**: User data is stored locally and in Firebase (when configured)
3. **Privacy**: Be careful when logging user data in production
4. **Development**: Use the debug screen only in development builds

## 🎯 **Next Steps**

1. Add the debug screen to your app for development
2. Use the AuthService methods to access user data in your components
3. Implement proper error handling for data access
4. Add data validation and sanitization
5. Consider implementing data export/import functionality 