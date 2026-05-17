import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../api/supabase';
import { decode } from 'base64-arraybuffer';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    phone: '',
    skill_category: '',
    availability: '',
    profile_image: ''
  });

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) setProfile(data);
    setLoading(false);
  };

  const pickAndUploadImage = async () => {
    try {
      // Request device media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Allow Kollab to access your photos to upload an avatar.");
        return;
      }

      // Open the gallery picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // FIXES TERMINAL WARNING: Replaces deprecated MediaTypeOptions
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,           // CRUCIAL: Forces expo-image-picker to return the Base64 data string
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      setUploading(true);
      
      const base64Data = result.assets[0].base64; // Extract base64 payload
      const selectedImageUri = result.assets[0].uri;
      const { data: { user } } = await supabase.auth.getUser();

      const fileExtension = selectedImageUri.split('.').pop() || 'jpg';
      const storageFilePath = `${user.id}-${Date.now()}.${fileExtension}`;

      // FIX NETWORK ERROR: Decode base64 directly into an ArrayBuffer container
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(storageFilePath, decode(base64Data), {
          contentType: `image/${fileExtension}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 5. Generate accessible public storage CDN URLs
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(storageFilePath);

      const generatedPublicUrl = urlData.publicUrl;

      // NEW FIX: Immediately auto-save this URL directly to the user's database profile row 
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ profile_image: generatedPublicUrl })
        .eq('id', user.id);

      if (dbError) throw dbError;

      // Update configuration hooks
      setProfile(currentProfile => ({ ...currentProfile, profile_image: generatedPublicUrl }));
      
      Alert.alert("Success", "Photo uploaded successfully! Remember to save profile updates.");
    } catch (err) {
      Alert.alert("Upload Error", err.message || "An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        phone: profile.phone,
        skill_category: profile.skill_category,
        availability: profile.availability,
        profile_image: profile.profile_image, // Persist photo path inside profile tables [cite: 152]
      })
      .eq('id', user.id);

    if (error) Alert.alert("Update Failed", error.message);
    else Alert.alert("Success", "Profile updated successfully!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <ActivityIndicator className="flex-1 text-center" size="large" color="#4f46e5" />;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-5 pt-14">
      <Text className="text-3xl font-bold text-slate-900 mb-2">My Profile</Text>
      <Text className="text-slate-500 mb-8">Manage your professional information</Text>

      {/* Interactive Avatar Container [cite: 112, 122-124] */}
      <View className="items-center mb-6">
        <TouchableOpacity 
          onPress={pickAndUploadImage}
          disabled={uploading}
          className="w-28 h-28 rounded-full bg-indigo-100 border-4 border-white shadow-md overflow-hidden justify-center items-center"
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#4f46e5" />
          ) : profile.profile_image ? (
            <Image source={{ uri: profile.profile_image }} className="w-full h-full" />
          ) : (
            <Text className="text-4xl font-bold text-indigo-600">
              {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={pickAndUploadImage} disabled={uploading} className="mt-2">
          <Text className="text-indigo-600 font-semibold text-sm">
            {profile.profile_image ? 'Change Photo' : 'Upload Photo'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white/70 p-6 rounded-3xl border border-white/40 shadow-sm mb-6">
        <Text className="text-slate-400 font-bold text-xs uppercase mb-4 tracking-widest">Basic Info</Text>
        
        <Text className="text-slate-600 mb-1 ml-1">Full Name</Text>
        <TextInput 
          value={profile.full_name} 
          onChangeText={(txt) => setProfile({...profile, full_name: txt})}
          className="bg-white p-4 rounded-xl mb-4 border border-slate-100"
        />

        <Text className="text-slate-600 mb-1 ml-1">Skill Category</Text>
        <TextInput 
          value={profile.skill_category} 
          onChangeText={(txt) => setProfile({...profile, skill_category: txt})}
          className="bg-white p-4 rounded-xl mb-4 border border-slate-100"
        />

        <Text className="text-slate-600 mb-1 ml-1">Phone Number</Text>
        <TextInput 
          value={profile.phone} 
          keyboardType="phone-pad"
          onChangeText={(txt) => setProfile({...profile, phone: txt})}
          className="bg-white p-4 rounded-xl mb-4 border border-slate-100"
        />

        <Text className="text-slate-600 mb-1 ml-1">Bio</Text>
        <TextInput 
          value={profile.bio} 
          multiline
          onChangeText={(txt) => setProfile({...profile, bio: txt})}
          className="bg-white p-4 rounded-xl mb-4 border border-slate-100 h-24"
        />
      </View>

      <TouchableOpacity onPress={handleUpdate} className="bg-indigo-600 p-4 rounded-2xl shadow-lg mb-4">
        <Text className="text-white text-center font-bold text-lg">Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} className="p-4 mb-10">
        <Text className="text-center text-red-500 font-medium">Logout Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}