import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';

// Import additional screens
import MealDetailScreen from '../screens/meal/MealDetailScreen';
import MealHistoryScreen from '../screens/meal/MealHistoryScreen';
import BadgesScreen from '../screens/gamification/BadgesScreen';
import QuestsScreen from '../screens/gamification/QuestsScreen';
import LeaderboardScreen from '../screens/gamification/LeaderboardScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress,
          },
        }),
      }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen 
        name="MealDetail" 
        component={MealDetailScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="MealHistory" 
        component={MealHistoryScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="Badges" 
        component={BadgesScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="Quests" 
        component={QuestsScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;