import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import AuthScreen from '../screens/AuthScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SplashScreen from '../screens/SplashScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SkillDetailScreen from '../screens/SkillDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  // 2. INITIALIZE THE INSETS DETECTOR
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Discovery') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'copy' : 'copy-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size - 2} color={color} />;
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 2,
        },
        // 3. APPLY DYNAMIC INSETS TO ACCUMULATE SYSTEM BAR OVERLAPS 
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          // Base bar height plus the calculated OS padding requirements
          height: 64 + (insets.bottom > 0 ? insets.bottom : 12),
          paddingTop: 8,
          // If the phone has virtual buttons, add that exact height, otherwise apply a baseline 12px cushion
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
        },
      })}
    >
      <Tab.Screen name="Discovery" component={DiscoveryScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Setup auth status listener [cite: 25-26, 31]
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Enforce the splash screen visibility duration for exactly 3 seconds 
    const splashTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      subscription?.unsubscribe();
      clearTimeout(splashTimer);
    };
  }, []);

  // Show Splash screen while parsing auth state 
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    {session ? (
        <>
        <Stack.Screen name="Main" component={MainTabs} />
        {/* Add this line so we can navigate to details from any tab [cite: 168] */}
        <Stack.Screen name="SkillDetail" component={SkillDetailScreen} options={{ headerShown: true, title: 'Profile' }} />
        </>
    ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
    )}
    </Stack.Navigator>
  );
}