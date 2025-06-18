import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../constants/colors';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import MealLoggingScreen from '../screens/meal/MealLoggingScreen';
import ChildProfileScreen from '../screens/main/ChildProfileScreen';
import LearningModuleScreen from '../screens/main/LearningModuleScreen';
import ReportingScreen from '../screens/main/ReportingScreen';

const Tab = createBottomTabNavigator();

const AnimatedIcon = ({ name, focused, color }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.2 : 1, {
            damping: 10,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 85 : 65,
          elevation: 8,
          shadowColor: colors.shadow.medium,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'MealLog':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Learn':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Reports':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
          }

          return <AnimatedIcon name={iconName} focused={focused} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="MealLog" 
        component={MealLoggingScreen}
        options={{
          tabBarLabel: 'Log Meal',
          tabBarButton: (props) => (
            <View style={styles.centerTabContainer}>
              <View style={styles.centerTab}>
                <Ionicons name="camera" size={28} color={colors.text.inverse} />
              </View>
              <Text style={styles.centerTabLabel}>Log Meal</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ChildProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen 
        name="Learn" 
        component={LearningModuleScreen}
        options={{
          tabBarLabel: 'Learn',
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportingScreen}
        options={{
          tabBarLabel: 'Reports',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  centerTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  centerTabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default TabNavigator;