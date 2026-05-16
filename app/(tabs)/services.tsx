import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - 48 - 12) / 2;

const TOOLS = [
  { id: 'ai-chat',         emoji: '🤖', title: 'AI Assistant',      subtitle: 'Chat with WeThink AI',         color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'quiz',            emoji: '📊', title: 'Readiness Quiz',     subtitle: 'Assess your digital maturity', color: '#0055FF', bg: '#E8EFFE' },
  { id: 'cost-estimator',  emoji: '💰', title: 'Cost Estimator',     subtitle: 'Price your AI project',        color: '#059669', bg: '#D1FAE5' },
  { id: 'roi-calculator',  emoji: '🧮', title: 'ROI Calculator',     subtitle: 'Measure your returns',         color: '#D97706', bg: '#FEF3C7' },
  { id: 'consultation',    emoji: '📅', title: 'Book Consultation',  subtitle: 'Schedule a free call',         color: '#DC2626', bg: '#FEE2E2' },
  { id: 'news',            emoji: '📰', title: 'Tech News',          subtitle: 'Latest AI & tech stories',     color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 'knowledge-base',  emoji: '📚', title: 'Knowledge Base',     subtitle: 'Learn from our experts',       color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'password-gen',    emoji: '🔑', title: 'Password Generator', subtitle: 'Create secure passwords',      color: '#059669', bg: '#D1FAE5' },
  { id: 'speed-test',      emoji: '🌐', title: 'Speed Test',         subtitle: 'Test your connection',         color: '#D97706', bg: '#FEF3C7' },
  { id: 'security-scan',   emoji: '🛡️', title: 'Security Scanner',  subtitle: 'Check your website security', color: '#DC2626', bg: '#FEE2E2' },
  { id: 'project-tracker', emoji: '📋', title: 'Project Tracker',   subtitle: 'Track your deliverables',      color: '#0055FF', bg: '#E8EFFE' },
  { id: 'live-chat',       emoji: '💬', title: 'Live Support',       subtitle: 'Chat with our team',           color: '#0EA5E9', bg: '#E0F2FE' },
];

function Particle({ style }: { style: any }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 3200, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(anim, { toValue: 0, duration: 3200, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) }],
          opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.85, 0.4] }),
        },
      ]}
    />
  );
}

function ToolCard({ tool, index }: { tool: typeof TOOLS[0]; index: number }) {
  const { colors, isDark } = useTheme();
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(('/tools/' + tool.id) as any);
  };

  const bgColor = isDark ? colors.card : tool.bg;

  return (
    <Animated.View style={{ opacity, transform: [{ scale }], width: CARD_W }}>
      <TouchableOpacity
        style={[styles.toolCard, { backgroundColor: bgColor, shadowColor: tool.color }]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={[styles.toolIconWrap, { backgroundColor: tool.color + '22' }]}>
          <Text style={styles.toolEmoji}>{tool.emoji}</Text>
        </View>
        <View style={[styles.toolAccentBar, { backgroundColor: tool.color }]} />
        <Text style={[styles.toolTitle, { color: isDark ? colors.text : tool.color }]} numberOfLines={1}>
          {tool.title}
        </Text>
        <Text style={[styles.toolSubtitle, { color: isDark ? colors.textSecondary : tool.color + 'CC' }]} numberOfLines={2}>
          {tool.subtitle}
        </Text>
        <View style={[styles.toolArrow, { backgroundColor: tool.color }]}>
          <Text style={styles.toolArrowText}>→</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ServicesScreen() {
  const { colors } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }}>
          <LinearGradient
            colors={['#0055FF', '#7C3AED', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroHeader}
          >
            <Particle style={[styles.particle, { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.12)', top: 20, left: 30 }]} />
            <Particle style={[styles.particle, { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', top: 60, right: 50 }]} />
            <Particle style={[styles.particle, { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.06)', bottom: 10, right: 20 }]} />
            <Particle style={[styles.particle, { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.15)', bottom: 30, left: 100 }]} />

            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>⚡ WeThink Tools Hub</Text>
              </View>
              <Text style={styles.heroTitle}>Your AI Toolkit</Text>
              <Text style={styles.heroSubtitle}>
                12 powerful tools to accelerate your digital transformation journey
              </Text>
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>12</Text>
                  <Text style={styles.heroStatLabel}>Tools</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>180+</Text>
                  <Text style={styles.heroStatLabel}>Clients</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>24/7</Text>
                  <Text style={styles.heroStatLabel}>Support</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Tools</Text>
          <Text style={[styles.sectionCount, { color: colors.textMuted }]}>{TOOLS.length} available</Text>
        </View>

        <View style={styles.grid}>
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  heroHeader: {
    minHeight: 220,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ?? 24) + 16,
    paddingBottom: 28,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  particle: { position: 'absolute' },
  heroContent: { zIndex: 1 },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  heroTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', letterSpacing: -0.8, marginBottom: 8 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 21, marginBottom: 20 },
  heroStats: { flexDirection: 'row', alignItems: 'center' },
  heroStatItem: { alignItems: 'center' },
  heroStatValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '500', marginTop: 1 },
  heroStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  sectionCount: { fontSize: 13, fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 24 },
  toolCard: {
    width: CARD_W,
    borderRadius: 20,
    padding: 16,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  toolIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolEmoji: { fontSize: 26 },
  toolAccentBar: { height: 3, borderRadius: 2, marginBottom: 10, width: '40%' },
  toolTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4, letterSpacing: -0.2 },
  toolSubtitle: { fontSize: 11, lineHeight: 16, marginBottom: 12 },
  toolArrow: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolArrowText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
