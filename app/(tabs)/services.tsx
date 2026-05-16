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
const CELL_W = (W - 48 - 12) / 2;

const PRIMARY_TOOLS = [
  { id: 'ai-chat',        emoji: '🤖', title: 'AI Assistant',   subtitle: 'Chat with WeThink AI',        colors: ['#7C3AED','#A78BFA'] as const },
  { id: 'quiz',           emoji: '📊', title: 'Readiness Quiz', subtitle: 'Assess digital maturity',     colors: ['#0055FF','#38BDF8'] as const },
  { id: 'cost-estimator', emoji: '💰', title: 'Cost Estimator', subtitle: 'Price your project',          colors: ['#059669','#34D399'] as const },
  { id: 'roi-calculator', emoji: '🧮', title: 'ROI Calculator', subtitle: 'Measure your returns',        colors: ['#D97706','#FCD34D'] as const },
  { id: 'consultation',   emoji: '📅', title: 'Book a Call',    subtitle: 'Free 30-min consultation',    colors: ['#DC2626','#F87171'] as const },
  { id: 'news',           emoji: '📰', title: 'Tech News',      subtitle: 'Latest AI stories',           colors: ['#0EA5E9','#7DD3FC'] as const },
];

const SECONDARY_TOOLS = [
  { id: 'knowledge-base',  emoji: '📚', title: 'Knowledge Base', color: '#7C3AED' },
  { id: 'password-gen',    emoji: '🔑', title: 'Password Gen',   color: '#059669' },
  { id: 'speed-test',      emoji: '🌐', title: 'Speed Test',     color: '#D97706' },
  { id: 'security-scan',   emoji: '🛡️', title: 'Security Scan',  color: '#DC2626' },
  { id: 'project-tracker', emoji: '📋', title: 'Projects',       color: '#0055FF' },
  { id: 'live-chat',       emoji: '💬', title: 'Live Support',   color: '#0EA5E9' },
];

// ── Decorative floating circle ────────────────────────────────────────────────
function FloatCircle({ style }: { style: any }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(anim, { toValue: 0, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={[style, {
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) }],
        opacity:    anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.85, 0.4] }),
      }]}
    />
  );
}

// ── Primary grid card ─────────────────────────────────────────────────────────
function PrimaryCard({ tool, index }: { tool: typeof PRIMARY_TOOLS[0]; index: number }) {
  const scale   = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        delay: index * 70,
        easing: Easing.out(Easing.back(1.15)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(('/tools/' + tool.id) as any);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale }], width: CELL_W }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.primaryCardOuter}>
        <LinearGradient colors={tool.colors} style={styles.primaryCard}>
          <Text style={styles.primaryEmoji}>{tool.emoji}</Text>
          <Text style={styles.primaryTitle}>{tool.title}</Text>
          <Text style={styles.primarySubtitle}>{tool.subtitle}</Text>
          <View style={styles.primaryArrow}>
            <Text style={styles.primaryArrowText}>→</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Secondary chip ────────────────────────────────────────────────────────────
function SecondaryChip({ tool }: { tool: typeof SECONDARY_TOOLS[0] }) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(('/tools/' + tool.id) as any);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.chip}>
      <View style={[styles.chipIcon, { backgroundColor: tool.color + '22' }]}>
        <Text style={styles.chipEmoji}>{tool.emoji}</Text>
      </View>
      <Text style={[styles.chipTitle, { color: tool.color }]}>{tool.title}</Text>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero Banner ── */}
        <Animated.View style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }}>
          <LinearGradient
            colors={['#0055FF', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            {/* Floating decorative circles */}
            <FloatCircle style={[styles.deco, { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.10)', top: 10, left: 20 }]} />
            <FloatCircle style={[styles.deco, { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.07)', top: 50, right: 40 }]} />
            <FloatCircle style={[styles.deco, { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, right: 10 }]} />
            <FloatCircle style={[styles.deco, { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.13)', bottom: 24, left: 110 }]} />

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>WeThink Tools</Text>
              <Text style={styles.heroSubtitle}>12 AI-powered tools</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Primary Grid ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Tools</Text>
        <View style={styles.primaryGrid}>
          {PRIMARY_TOOLS.map((tool, i) => (
            <PrimaryCard key={tool.id} tool={tool} index={i} />
          ))}
        </View>

        {/* ── Secondary Tools ── */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>More Tools</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.secondaryRow}
        >
          {SECONDARY_TOOLS.map((tool) => (
            <SecondaryChip key={tool.id} tool={tool} />
          ))}
        </ScrollView>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 24 },

  // Hero banner
  heroBanner: {
    height: 140,
    marginHorizontal: 0,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ?? 24) + 16,
    paddingHorizontal: 24,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  deco: { position: 'absolute' },
  heroContent: { zIndex: 1 },
  heroTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.8 },
  heroSubtitle: { color: 'rgba(255,255,255,0.80)', fontSize: 14, fontWeight: '500', marginTop: 2 },

  // Section title
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14, paddingHorizontal: 24 },

  // Primary grid
  primaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
  },
  primaryCardOuter: {
    width: CELL_W,
    height: 160,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  primaryCard: {
    flex: 1,
    padding: 18,
    justifyContent: 'flex-end',
  },
  primaryEmoji: { fontSize: 40, marginBottom: 8 },
  primaryTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  primarySubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.80)', marginTop: 2, lineHeight: 15 },
  primaryArrow: {
    position: 'absolute',
    top: 14, right: 14,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  primaryArrowText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  // Secondary chips
  secondaryRow: { paddingHorizontal: 24, gap: 10, paddingBottom: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  chipIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  chipEmoji: { fontSize: 18 },
  chipTitle: { fontSize: 13, fontWeight: '700' },
});
