import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, Image, Alert } from 'react-native';

export default function SkillDetailScreen({ route }) {
  const { profile } = route.params; // Receives the passed full profile object

  const handleContact = (type) => {
    // Safety check: verify contact details exist prior to invoking native deep-links [cite: 68-72]
    if (!profile.phone && (type === 'call' || type === 'whatsapp')) {
      Alert.alert("Contact Unavailable", "This student hasn't added a phone number to their profile yet.");
      return;
    }
    if (!profile.email && type === 'email') {
      Alert.alert("Contact Unavailable", "This student hasn't added an email address to their profile yet.");
      return;
    }

    if (type === 'call') {
      Linking.openURL(`tel:${profile.phone}`);
    }
    
    if (type === 'email') {
      Linking.openURL(`mailto:${profile.email}`);
    }
    
    if (type === 'whatsapp') {
      // Clean up accidental spaces or formatting dashes
      let cleanedNumber = profile.phone.trim().replace(/[^0-9]/g, '');

      // FIX: If the phone number starts with a local 0, convert it into international 92 format
      if (cleanedNumber.startsWith('0')) {
        cleanedNumber = '92' + cleanedNumber.substring(1);
      }

      Linking.openURL(`whatsapp://send?phone=${cleanedNumber}`);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <View className="bg-white/80 p-8 rounded-[40px] border border-white/40 shadow-sm items-center">
        
        {/* Profile Image View */}
        <View className="w-24 h-24 bg-indigo-100 rounded-full items-center justify-center mb-4 overflow-hidden border-2 border-slate-150">
          {profile.profile_image ? (
            <Image source={{ uri: profile.profile_image }} className="w-full h-full" />
          ) : (
            <Text className="text-3xl text-indigo-600 font-bold">
              {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </Text>
          )}
        </View>

        <Text className="text-2xl font-bold text-slate-800">{profile.full_name}</Text>
        <Text className="text-indigo-600 font-medium mb-4">{profile.skill_category}</Text>

        <View className="bg-green-100 px-3 py-1 rounded-full mb-6">
          <Text className="text-green-700 font-bold text-xs">{profile.availability || 'Available'}</Text>
        </View>

        <Text className="text-slate-600 text-center leading-6 mb-8">
          {profile.bio || "This student hasn't added a bio yet."}
        </Text>

        {/* Action Button Links [cite: 68-72] */}
        <View className="w-full space-y-3">
          <TouchableOpacity 
            onPress={() => handleContact('whatsapp')}
            className="bg-green-500 p-4 rounded-2xl flex-row justify-center"
          >
            <Text className="text-white font-bold text-base">WhatsApp Me</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleContact('email')}
            className="bg-indigo-600 p-4 rounded-2xl flex-row justify-center"
          >
            <Text className="text-white font-bold text-base">Send Email</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleContact('call')}
            className="border border-slate-200 bg-white p-4 rounded-2xl flex-row justify-center"
          >
            <Text className="text-slate-600 font-bold text-base">Call Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}