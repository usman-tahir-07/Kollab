import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../api/supabase';

export default function DiscoveryScreen({navigation}) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();

    // Listen for when this tab comes into focus [cite: 162-163]
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfiles(); // Re-fetch data when user clicks this tab
    });

    return unsubscribe; // Clean up the listener when screen unmounts
  }, [navigation]);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) console.log('Error fetching profiles:', error.message);
    else {
      setProfiles(data);
      setFilteredProfiles(data);
    }
    setLoading(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = profiles.filter(profile => 
      profile.full_name?.toLowerCase().includes(text.toLowerCase()) ||
      profile.skill_category?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProfiles(filtered);
  };

  const renderUserCard = ({ item }) => (
    <View className="bg-white/70 p-5 rounded-3xl mb-4 border border-white/30 shadow-sm">
      {/* Profile Header Block with Image or Initial Placeholder [cite: 46] */}
      <View className="flex-row items-center mb-3">
        {item.profile_image ? (
          <Image source={{ uri: item.profile_image }} className="w-12 h-12 rounded-full mr-3 bg-slate-100" />
        ) : (
          <View className="w-12 h-12 bg-indigo-100 rounded-full mr-3 items-center justify-center">
            <Text className="text-indigo-600 font-bold text-lg">
              {item.full_name ? item.full_name[0].toUpperCase() : 'U'}
            </Text>
          </View>
        )}
        
        <View className="flex-1">
          <Text className="text-xl font-bold text-slate-800">{item.full_name}</Text>
          <Text className="text-indigo-600 font-medium">{item.skill_category}</Text>
        </View>
        
        <Text className="text-amber-500 font-bold">⭐ {item.rating?.toFixed(1) || '5.0'}</Text>
      </View>
      
      <View className="bg-green-100 px-2 py-1 rounded-md self-start mb-2">
        <Text className="text-green-700 text-xs font-bold">{item.availability || 'Available'}</Text>
      </View>
      
      <Text className="text-slate-500 mt-1 italic" numberOfLines={2}>
        {item.bio || "No bio provided yet."}
      </Text>

      <TouchableOpacity 
        onPress={() => navigation.navigate('SkillDetail', { profile: item })}
        className="bg-indigo-600 mt-4 p-3 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 p-5 pt-14">
      <Text className="text-3xl font-bold text-slate-900 mb-2">Discovery</Text>
      <Text className="text-slate-500 mb-6">Find your next project partner</Text>

      {/* Search Bar  */}
      <TextInput
        placeholder="Search by name or skill..."
        className="bg-white p-4 rounded-2xl mb-6 border border-slate-200 shadow-sm"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" />
      ) : (
        <FlatList
          data={filteredProfiles}
          keyExtractor={(item) => item.id}
          renderItem={renderUserCard}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text className="text-center text-slate-400 mt-10">No students found.</Text>}
        />
      )}
    </View>
  );
}