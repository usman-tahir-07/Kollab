import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';


export default function App() {
  return (
    <NavigationContainer>
      {/* This renders our Auth/Main logic [cite: 161-166] */}
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}