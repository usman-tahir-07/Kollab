import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { supabase } from '../api/supabase';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState({ labels: [], datasets: [{ data: [] }] });

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData(); // Refresh calculations whenever the user opens the tab
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    setLoading(true);

    // 1. Fetch profiles to calculate Main Skill Categories [cite: 94, 151-152]
    const { data: profiles } = await supabase.from('profiles').select('skill_category');
    
    // 2. Fetch collaboration posts to evaluate Most Requested Skills [cite: 95, 153-154]
    const { data: posts } = await supabase.from('collaboration_posts').select('required_skill');

    // Process Pie Chart Data (User Distribution) [cite: 94, 96, 101-105]
    if (profiles && profiles.length > 0) {
      const counts = {};
      profiles.forEach(p => {
        const cat = p.skill_category || 'Other';
        counts[cat] = (counts[cat] || 0) + 1;
      });

      const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
      const formattedPie = Object.keys(counts).map((key, idx) => ({
        name: key,
        population: counts[key],
        color: colors[idx % colors.length],
        legendFontColor: '#475569',
        legendFontSize: 13,
      }));
      setPieData(formattedPie);
    }

    // Process Bar Chart Data (Most Requested Skills) [cite: 95]
    if (posts && posts.length > 0) {
      const postCounts = {};
      posts.forEach(p => {
        const skill = p.required_skill || 'General';
        postCounts[skill] = (postCounts[skill] || 0) + 1;
      });

      const labels = Object.keys(postCounts).slice(0, 4); // Top 4 requested skills
      const dataValues = labels.map(l => postCounts[l]);

      setBarData({
        labels: labels.length > 0 ? labels : ['None'],
        datasets: [{ data: dataValues.length > 0 ? dataValues : [0] }]
      });
    }

    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator className="flex-1 justify-center" size="large" color="#6366f1" />;
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-5 pt-14">
      <Text className="text-3xl font-bold text-slate-900 mb-2">Analytics</Text>
      <Text className="text-slate-500 mb-8">Community growth and skill trends</Text>

      {/* Pie Chart Card [cite: 101-105] */}
      <View className="bg-white/70 p-5 rounded-3xl border border-white/40 shadow-sm mb-6">
        <Text className="text-lg font-bold text-slate-800 mb-4">User Distribution By Skill</Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={180}
            chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        ) : (
          <Text className="text-slate-400 text-center py-6">No profile data available yet.</Text>
        )}
      </View>

      {/* Bar Chart Card [cite: 93, 95] */}
      <View className="bg-white/70 p-5 rounded-3xl border border-white/40 shadow-sm mb-10">
        <Text className="text-lg font-bold text-slate-800 mb-4">Most Demanded Skills</Text>
        {barData.labels.length > 0 && barData.datasets[0].data.length > 0 ? (
          <BarChart
            data={barData}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
            }}
            style={{ borderRadius: 16, marginTop: 8 }}
          />
        ) : (
          <Text className="text-slate-400 text-center py-6">No active requirement posts found.</Text>
        )}
      </View>
    </ScrollView>
  );
}