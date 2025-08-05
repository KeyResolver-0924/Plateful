import { Tabs, usePathname } from 'expo-router';
import { Image, Platform } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { colors } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useTabBarVisibility } from '../../utils/tabBarUtils';

interface TabLayoutProps {
  hideTabBar?: boolean;
}

export default function TabLayout({ hideTabBar = false }: TabLayoutProps) {
  const colorScheme = useColorScheme();
  const { shouldHideTabBar } = useTabBarVisibility();

  // Dynamic tab bar style based on props and current route
  const getTabBarStyle = () => {
    const baseStyle = Platform.select({
      ios: {
        // Use a transparent background on iOS to show the blur effect
        position: 'absolute' as const,
      },
      default: {},
    });

    // Hide tab bar if hideTabBar prop is true OR if current route requires hiding
    const shouldHide = hideTabBar || shouldHideTabBar;

    console.log('Tab bar visibility check:', { shouldHide, shouldHideTabBar, pathname: usePathname() });

    if (shouldHide) {
      return {
        ...baseStyle,
        display: 'none' as const,
        height: 0,
        opacity: 0,
      };
    }

    return {
      ...baseStyle,
      height: 60,
      paddingBottom: 5,
      paddingTop: 5,
    };
  };

  const pathname = usePathname();
  const shouldHide = hideTabBar || shouldHideTabBar;
  
  console.log('Tab bar visibility check:', { shouldHide, shouldHideTabBar, pathname });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: shouldHide ? () => null : HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: getTabBarStyle(),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tab/home.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="gamification"
        options={{
          title: 'Child\'s Profile',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tab/profile.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning Modules',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tab/learning.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reporting"
        options={{
          title: 'Reporting',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tab/report.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}