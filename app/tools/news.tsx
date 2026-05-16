import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const CATEGORY_COLORS: Record<string, string> = {
  AI: '#7C3AED',
  Tech: '#0EA5E9',
  Business: '#059669',
  Security: '#DC2626',
};

const ARTICLES = [
  { id: 1, category: 'AI', title: 'UAE announces AED 2B AI investment fund', snippet: 'The UAE government has unveiled a new sovereign fund dedicated to accelerating AI adoption across key industries including healthcare, energy, and smart infrastructure. The initiative aims to position UAE as the top AI hub in the region by 2028.', source: 'Gulf News', time: '2h ago', icon: '🇦🇪' },
  { id: 2, category: 'Tech', title: "OpenAI's GPT-5 sets new benchmark records", snippet: "The latest model from OpenAI has surpassed human performance on 87% of standardized reasoning tests, achieving unprecedented scores in logic, coding, and mathematical problem solving according to the latest evaluation report.", source: 'TechCrunch', time: '4h ago', icon: '🤖' },
  { id: 3, category: 'Business', title: 'ADNOC deploys AI for predictive maintenance', snippet: 'The energy giant reports 40% reduction in equipment downtime after deploying machine learning models across its refinery operations. The system processes sensor data in real time to predict failures before they occur.', source: 'Arabian Business', time: '6h ago', icon: '⚡' },
  { id: 4, category: 'Security', title: 'New ransomware variant targets Gulf banks', snippet: 'Cybersecurity researchers have identified a sophisticated new strain targeting financial institutions across the Gulf region. The variant uses advanced evasion techniques and encrypted C2 communications to avoid detection.', source: 'Dark Reading', time: '8h ago', icon: '🛡️' },
  { id: 5, category: 'AI', title: 'Dubai Smart City platform reaches 5M users', snippet: 'The integrated digital platform connecting Dubai residents to government services has hit a major milestone, with 5 million registered users accessing over 120 digital services through a single unified interface.', source: 'Khaleej Times', time: '1d ago', icon: '🏙️' },
  { id: 6, category: 'Tech', title: 'Saudi Arabia launches 100B riyal tech zone', snippet: 'NEOM announces a dedicated technology and AI research zone as part of Vision 2030 expansion. The zone will host 200+ global tech companies and is expected to create 50,000 jobs in software, robotics, and AI research.', source: 'Reuters', time: '1d ago', icon: '🚀' },
  { id: 7, category: 'Business', title: 'WeThink wins Best AI Company award at GITEX', snippet: "WeThink.ae was recognized as the top AI solutions provider at this year's GITEX Global conference, beating out 847 competing companies across 12 categories with its enterprise-grade fraud detection and NLP platforms.", source: 'WeThink News', time: '2d ago', icon: '🏆' },
  { id: 8, category: 'AI', title: 'Autonomous vehicles approved for Dubai roads', snippet: 'RTA has given the green light for commercial autonomous vehicle operations in select Dubai zones starting Q2. The initiative is part of the Smart Dubai 2030 initiative to automate 25% of all transportation.', source: 'The National', time: '3d ago', icon: '🚗' },
];

const CATEGORIES = ['All', 'AI', 'Tech', 'Business', 'Security'];

function ArticleCard({ article, colors }: { article: typeof ARTICLES[0]; colors: any }) {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const catColor = CATEGORY_COLORS[article.category] ?? '#0055FF';

  const toggle = () => {
    Haptics.selectionAsync();
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.timing(heightAnim, {
      toValue,
      duration: 280,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const snippetHeight = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 80] });

  return (
    <TouchableOpacity
      style={[styles.articleCard, { backgroundColor: colors.surface, borderLeftColor: catColor }]}
      onPress={toggle}
      activeOpacity={0.85}
    >
      <View style={styles.articleHeader}>
        <Text style={styles.articleIcon}>{article.icon}</Text>
        <View style={{ flex: 1 }}>
          <View style={styles.articleMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: catColor + '20' }]}>
              <Text style={[styles.categoryText, { color: catColor }]}>{article.category}</Text>
            </View>
            <Text style={[styles.articleTime, { color: colors.textMuted }]}>{article.time}</Text>
          </View>
          <Text style={[styles.articleTitle, { color: colors.text }]} numberOfLines={expanded ? undefined : 2}>
            {article.title}
          </Text>
          <Text style={[styles.articleSource, { color: colors.textMuted }]}>{article.source}</Text>
        </View>
      </View>
      <Animated.View style={{ maxHeight: snippetHeight, overflow: 'hidden' }}>
        <Text style={[styles.articleSnippet, { color: colors.textSecondary }]}>{article.snippet}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function NewsScreen() {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#0EA5E9', '#38BDF8']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tech News</Text>
        <View style={{ width: 36 }} />
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { backgroundColor: colors.surface }]}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              {
                backgroundColor: activeCategory === cat ? '#0EA5E9' : colors.borderLight,
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveCategory(cat);
            }}
          >
            <Text style={[styles.filterText, { color: activeCategory === cat ? '#FFFFFF' : colors.textSecondary }]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map(article => (
          <ArticleCard key={article.id} article={article} colors={colors} />
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  filterScroll: { maxHeight: 52 },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '600' },
  content: { padding: 16, gap: 12 },
  articleCard: {
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    gap: 10,
  },
  articleHeader: { flexDirection: 'row', gap: 10 },
  articleIcon: { fontSize: 26, marginTop: 2 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  categoryText: { fontSize: 11, fontWeight: '700' },
  articleTime: { fontSize: 11, fontWeight: '500' },
  articleTitle: { fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
  articleSource: { fontSize: 11, fontWeight: '500' },
  articleSnippet: { fontSize: 13, lineHeight: 19 },
});
