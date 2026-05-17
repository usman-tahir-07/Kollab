import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '../api/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    if (isSignUp) {
      // 1. Sign up user in Supabase Auth [cite: 30-31]
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) Alert.alert(error.message);
      else {
        // 2. Insert profile metadata into our custom 'profiles' table [cite: 151-152]
        const { error: profileError } = await supabase.from('profiles').insert([
          { 
            id: data.user.id, 
            full_name: fullName, 
            email: email, 
            skill_category: skillCategory,
            availability: 'Available for Collaboration' // Default status [cite: 52]
          }
        ]);
        if (profileError) Alert.alert("Profile Sync Error", profileError.message);
        else Alert.alert("Welcome to Kollab!");
      }
    } else {
      // Login logic [cite: 29]
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert(error.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView 
      className="bg-slate-50" 
      contentContainerStyle={{ 
        flexGrow: 1, 
        justifyContent: 'center', 
        padding: 24 
      }}
    >
      {/* Glassmorphism Card */}
      <View className="bg-white/70 p-8 rounded-3xl shadow-xl border border-white/20">
        <Text className="text-3xl font-bold text-slate-800 mb-2">Kollab</Text>
        <Text className="text-slate-500 mb-8">{isSignUp ? 'Create your profile' : 'Welcome back'}</Text>

        {isSignUp && (
          <>
            <TextInput 
              placeholder="Full Name" 
              className="bg-white p-4 rounded-xl mb-4 border border-slate-200"
              onChangeText={setFullName}
            />
            <TextInput 
              placeholder="Skill Category (e.g. Frontend)" 
              className="bg-white p-4 rounded-xl mb-4 border border-slate-200"
              onChangeText={setSkillCategory}
            />
          </>
        )}

        <TextInput 
          placeholder="Email" 
          autoCapitalize="none"
          className="bg-white p-4 rounded-xl mb-4 border border-slate-200"
          onChangeText={setEmail}
        />
        <TextInput 
          placeholder="Password" 
          secureTextEntry 
          className="bg-white p-4 rounded-xl mb-6 border border-slate-200"
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          onPress={handleAuth} 
          disabled={loading}
          className="bg-indigo-600 p-4 rounded-xl shadow-lg"
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} className="mt-6">
          <Text className="text-center text-indigo-600 font-medium">
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}