import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, Image } from 'react-native';
import { supabase } from '../api/supabase';

export default function FeedScreen({navigation}) {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    fetchPosts();

    // 1. Existing Realtime Subscription for NEW posts
    const subscription = supabase
      .channel('feed_changes')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'collaboration_posts' }, 
        () => { fetchPosts(); }
      )
      .subscribe();

    // 2. NEW: Listen for when the user navigates back to the Feed tab 
    const unsubscribeNav = navigation.addListener('focus', () => {
      fetchPosts(); // Re-fetch to capture name/profile updates
    });

    // Cleanup both subscriptions
    return () => {
      supabase.removeChannel(subscription);
      unsubscribeNav();
    };
  }, [navigation]);

  const fetchPosts = async () => {
    // We select all post fields and the 'full_name' from the related profile
    const { data, error } = await supabase
      .from('collaboration_posts')
      .select('*, profiles(*)') 
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Fetch error:', error.message);
    } else {
      setPosts(data);
    }
  };

  const handleCreatePost = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from('collaboration_posts').insert([
      { title: newTitle, required_skill: newSkill, description: newDesc, user_id: user.id }
    ]);

    if (error) Alert.alert("Error", error.message);
    else {
      setModalVisible(false);
      fetchPosts(); // Refresh the feed [cite: 86]
    }
  };

  const renderPost = ({ item }) => (
    <View className="bg-white/80 p-5 rounded-3xl mb-4 border border-white/40 shadow-sm">
      <Text className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
        {item.required_skill}
      </Text>
      <Text className="text-xl font-bold text-slate-800 mt-1">{item.title}</Text>
      <Text className="text-slate-500 mt-2 leading-5">{item.description}</Text>
      
      <View className="mt-4 pt-4 border-t border-slate-100 flex-row justify-between items-center">
        {/* Accessing the joined profile name [cite: 90] */}
        <Text className="text-slate-400 text-sm">
          By {item.profiles?.full_name || 'Anonymous'}
        </Text>
        <TouchableOpacity 
        onPress={() => navigation.navigate('SkillDetail', { profile: item.profiles })}
        className="bg-indigo-50 px-4 py-2 rounded-lg"
        >
        <Text className="text-indigo-600 font-bold">Collaborate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 p-5 pt-14">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-3xl font-bold text-slate-900">Feed</Text>
          <Text className="text-slate-500">Active project requests</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-indigo-600 w-12 h-12 rounded-full items-center justify-center shadow-lg">
          <Text className="text-white text-2xl font-light">+</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={posts} 
        renderItem={renderPost} 
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      {/* Post Creation Modal  */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-8 rounded-t-[40px] h-3/4">
            <Text className="text-2xl font-bold text-slate-800 mb-6">New Post</Text>
            <TextInput placeholder="Project Title (e.g. AI App)" className="bg-slate-100 p-4 rounded-xl mb-4" onChangeText={setNewTitle} />
            <TextInput placeholder="Required Skill (e.g. Node.js)" className="bg-slate-100 p-4 rounded-xl mb-4" onChangeText={setNewSkill} />
            <TextInput placeholder="Details..." multiline className="bg-slate-100 p-4 rounded-xl mb-8 h-32" onChangeText={setNewDesc} />
            <TouchableOpacity onPress={handleCreatePost} className="bg-indigo-600 p-4 rounded-xl mb-3">
              <Text className="text-white text-center font-bold text-lg">Post Requirement</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text className="text-center text-slate-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}