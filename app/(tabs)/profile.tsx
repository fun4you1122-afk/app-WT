import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';

const { width: W } = Dimensions.get('window');

// ─── Icons ────────────────────────────────────────────────────────────────────

function GearIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EditIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MoonIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color + '20'}
      />
    </Svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BANNER_HEIGHT = 160;
const AVATAR_SIZE = 84;
const AVATAR_OVERLAP = 36;

const CATEGORY_COLORS: Record<string, string> = {
  AI: '#7C3AED',
  Tech: '#0EA5E9',
  Business: '#059669',
  UAE: '#D97706',
  Global: '#DC2626',
};

const MY_DISCUSSIONS = [
  { id: 'd1', title: 'UAE fintech regulatory sandbox — a blueprint for the world?', category: 'Business', likes: 312 },
  { id: 'd2', title: 'Why I switched from GPT-4 to Claude for my startup', category: 'AI', likes: 198 },
  { id: 'd3', title: 'Dubai 2040 urban plan: ambitious or achievable?', category: 'UAE', likes: 445 },
  { id: 'd4', title: 'The hidden costs of rapid AI adoption in enterprise', category: 'Tech', likes: 267 },
  { id: 'd5', title: 'Quantum computing timeline: closer than you think', category: 'Tech', likes: 183 },
  { id: 'd6', title: 'How decentralised identity could reshape the Gulf economy', category: 'Global', likes: 341 },
];

const SAVED_DISCUSSIONS = [
  { id: 's1', title: 'Is AI replacing human creativity or enhancing it?', category: 'AI', likes: 234 },
  { id: 's2', title: 'The case for autonomous vehicles in Gulf cities', category: 'Tech', likes: 189 },
  { id: 's3', title: "How WeThink's AI is transforming UAE banking", category: 'Business', likes: 412 },
  { id: 's4', title: 'Poll: Should UAE mandate AI literacy in schools?', category: 'UAE', likes: 567 },
  { id: 's5', title: 'Web3 identity and privacy in the post-GDPR era', category: 'Global', likes: 143 },
  { id: 's6', title: 'Mental health tech startups boom in post-pandemic MENA', category: 'Business', likes: 298 },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────

interface CounterProps {
  target: number;
  suffix?: string;
  style: any;
  duration?: number;
}

function AnimatedCounter({ target, suffix = '', style, duration = 1200 }: CounterProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const listener = anim.addListener(({ value }) => {
      if (suffix === 'K') {
        setDisplay((value / 1000).toFixed(value >= 1000 ? 1 : 0));
      } else {
        setDisplay(Math.round(value).toString());
      }
    });
    Animated.timing(anim, {
      toValue: suffix === 'K' ? target * 1000 : target,
      duration,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
    return () => anim.removeListener(listener);
  }, [anim, target, suffix, duration]);

  return <Text style={style}>{display}{suffix}</Text>;
}

// ─── Mini Discussion Card ─────────────────────────────────────────────────────

function MiniCard({ item, colors, index }: { item: typeof MY_DISCUSSIONS[0]; colors: any; index: number }) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 350,
      delay: index * 60,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [slideAnim, index]);

  const catColor = CATEGORY_COLORS[item.category] ?? colors.primary;

  return (
    <Animated.View
      style={[
        styles.miniCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.borderLight,
          opacity: slideAnim,
          transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        },
      ]}
    >
      <View style={[styles.miniCategoryDot, { backgroundColor: catColor }]} />
      <View style={styles.miniCardBody}>
        <Text style={[styles.miniTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.miniFooter}>
          <View style={[styles.miniCategoryBadge, { backgroundColor: catColor + '18' }]}>
            <Text style={[styles.miniCategoryText, { color: catColor }]}>{item.category}</Text>
          </View>
          <Text style={[styles.miniLikes, { color: colors.textMuted }]}>♥ {item.likes}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'My Discussions' | 'Saved'>('My Discussions');
  const bannerAnim = useRef(new Animated.Value(0)).current;
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bannerAnim, { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.spring(avatarAnim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 120 }),
    ]).start();
  }, [bannerAnim, avatarAnim]);

  const handleTabSwitch = (tab: 'My Discussions' | 'Saved') => {
    Haptics.selectionAsync();
    setActiveTab(tab);
    Animated.timing(tabIndicatorAnim, {
      toValue: tab === 'My Discussions' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const tabIndicatorLeft = tabIndicatorAnim.interpolate({ inputRange: [0, 1], outputRange: ['2%', '52%'] });
  const discussions = activeTab === 'My Discussions' ? MY_DISCUSSIONS : SAVED_DISCUSSIONS;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Banner ── */}
        <Animated.View style={{ opacity: bannerAnim }}>
          <LinearGradient
            colors={['#0055FF', '#7C3AED', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            {/* Decorative circles */}
            <View style={[styles.bannerCircle, styles.bannerCircle1]} />
            <View style={[styles.bannerCircle, styles.bannerCircle2]} />

            {/* Top action buttons */}
            <View style={styles.bannerActions}>
              <TouchableOpacity
                onPress={() => router.push('/settings' as any)}
                style={styles.bannerIconBtn}
                activeOpacity={0.8}
              >
                <GearIcon color="#FFFFFF" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {/* edit profile */ }}
                style={[styles.bannerEditBtn]}
                activeOpacity={0.8}
              >
                <EditIcon color="#FFFFFF" size={16} />
                <Text style={styles.bannerEditText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <Animated.View
            style={[
              styles.avatarWrapper,
              {
                borderColor: colors.background,
                transform: [
                  { scale: avatarAnim },
                  { translateY: avatarAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#0055FF', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitials}>RA</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* ── Name & Bio ── */}
        <View style={styles.nameSection}>
          <Text style={[styles.displayName, { color: colors.text }]}>Rasha Aljalam</Text>
          <Text style={[styles.role, { color: colors.primary }]}>CEO of WeThink.ae</Text>
          <Text style={[styles.handle, { color: colors.textSecondary }]}>@rasha.aljalam</Text>
          <Text style={[styles.bio, { color: colors.textSecondary }]}>
            {'AI Policy Researcher · UAE Digital Economy Advocate\nBuilding the future with @WeThink.ae 🇦🇪'}
          </Text>
        </View>

        {/* ── Stats ── */}
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
            <AnimatedCounter target={47} style={[styles.statValue, { color: colors.text }]} duration={1000} />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Posts</Text>
          </TouchableOpacity>
          <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />
          <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
            <View style={styles.statValueRow}>
              <AnimatedCounter target={1.2} suffix="K" style={[styles.statValue, { color: colors.text }]} duration={1200} />
            </View>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Followers</Text>
          </TouchableOpacity>
          <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />
          <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
            <AnimatedCounter target={234} style={[styles.statValue, { color: colors.text }]} duration={1100} />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Following</Text>
          </TouchableOpacity>
        </View>

        {/* ── Toggle Tabs ── */}
        <View style={[styles.tabSwitcher, { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderLight }]}>
          <Animated.View
            style={[
              styles.tabSwitcherIndicator,
              { backgroundColor: colors.card, left: tabIndicatorLeft, shadowColor: colors.shadow },
            ]}
          />
          {(['My Discussions', 'Saved'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabSwitch(tab)}
              style={styles.tabSwitcherBtn}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabSwitcherText, { color: activeTab === tab ? colors.text : colors.textMuted, fontWeight: activeTab === tab ? '700' : '500' }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Discussion Grid ── */}
        <View style={styles.grid}>
          {discussions.map((item, i) => (
            <MiniCard key={item.id} item={item} colors={colors} index={i} />
          ))}
        </View>

        {/* ── Theme Toggle ── */}
        <View style={[styles.themeRow, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <View style={styles.themeRowLeft}>
            <View style={[styles.themeIconWrap, { backgroundColor: isDark ? colors.accentLight : colors.primaryLight }]}>
              <MoonIcon color={isDark ? colors.accent : colors.primary} size={18} />
            </View>
            <View>
              <Text style={[styles.themeLabel, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.themeSubtitle, { color: colors.textMuted }]}>
                {isDark ? 'Currently dark theme' : 'Currently light theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleThemeToggle}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={isDark ? colors.primary : colors.textMuted}
            ios_backgroundColor={colors.border}
          />
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  // Banner
  banner: {
    height: BANNER_HEIGHT + (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 24),
    paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight ?? 24) + 12,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  bannerCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bannerCircle1: { width: 200, height: 200, top: -60, right: -40 },
  bannerCircle2: { width: 120, height: 120, bottom: -20, left: 60 },
  bannerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerEditText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  // Avatar
  avatarSection: {
    paddingHorizontal: 20,
    marginTop: -(AVATAR_OVERLAP),
    marginBottom: 4,
  },
  avatarWrapper: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  avatarGradient: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },

  // Name section
  nameSection: { paddingHorizontal: 20, marginBottom: 20 },
  displayName: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4, marginBottom: 2 },
  role: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  handle: { fontSize: 14, fontWeight: '500', marginBottom: 10 },
  bio: { fontSize: 14, lineHeight: 21 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0A1628',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  statDivider: { width: 1, marginVertical: 12 },

  // Tab switcher
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    marginBottom: 16,
    position: 'relative',
  },
  tabSwitcherIndicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: '46%',
    borderRadius: 12,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabSwitcherBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, zIndex: 1 },
  tabSwitcherText: { fontSize: 14 },

  // Grid
  grid: { paddingHorizontal: 16, gap: 10, marginBottom: 20 },
  miniCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowColor: '#0A1628',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  miniCategoryDot: { width: 4, borderRadius: 2, alignSelf: 'stretch', marginTop: 2 },
  miniCardBody: { flex: 1, gap: 8 },
  miniTitle: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  miniFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  miniCategoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  miniCategoryText: { fontSize: 11, fontWeight: '700' },
  miniLikes: { fontSize: 12, fontWeight: '600' },

  // Theme row
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#0A1628',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  themeRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  themeIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  themeLabel: { fontSize: 15, fontWeight: '700' },
  themeSubtitle: { fontSize: 12, marginTop: 1 },
});
