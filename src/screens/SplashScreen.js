import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View className="flex-1 bg-slate-900 justify-center items-center">
      {/* Visual Identity Container */}
      <View className="items-center bg-white/10 p-10 rounded-[40px] border border-white/10 shadow-2xl">
        <Text className="text-5xl font-black text-white tracking-wider mb-2">Kollab</Text>
        <Text className="text-indigo-300 text-sm font-medium tracking-widest uppercase mb-8">
          Connect · Build · Grow
        </Text>
        
        {/* Smooth loading animation  */}
        <ActivityIndicator size="large" color="#818cf8" />
      </View>
    </View>
  );
}