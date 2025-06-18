import React from 'react';
import { View, StatusBar as RNStatusBar, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

const StatusBar = ({ backgroundColor = colors.primary, barStyle = 'light-content', ...props }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.statusBar, { backgroundColor, paddingTop: insets.top }]}>
      <RNStatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        translucent
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    width: '100%',
    zIndex: 1000,
  }
});

export default StatusBar;