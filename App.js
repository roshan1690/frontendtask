import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, ActivityIndicator, Switch } from 'react-native';
import { useFonts } from 'expo-font';
import Text from './src/components/text/text';
import { ThemeProvider, useTheme } from './src/context/theme-context';
import Root from './src/Root';

export default function App() {
  let [fontsLoaded] = useFonts({
    'SpaceMono-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
    'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf')
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}