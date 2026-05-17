import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Animated, ScrollView, StyleSheet, View, Text,
  TextInput, TouchableOpacity, Dimensions, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Case Studies', 'Market Reports', 'AI Trends', 'UAE Focus', 'Guides'];

const FEATURED_ARTICLE = {
  title: 'How UAE Banks Are Using AI to Fight Financial Crime — A 2025 Report',
  tag: 'Market Reports',
  tagColor: '#7C3AED',
  readTime: '12 min read',
  author: 'WeThink Research',
  gradient: ['#020818', '#0D1B4B', '#0055FF'] as const,
};

const ARTICLES = [
  {
    id: '1',
    headline: 'UAE AI Market to Hit $6.4B by 2026 — Full Analysis',
    category: 'Market Reports',
    categoryColor: '#7C3AED',
    author: 'WeThink Research',
    date: 'May 14, 2026',
    readTime: '8 min',
    reads: '2.4k',
  },
  {
    id: '2',
    headline: 'How DEWA Cut Operational Costs 23% with Predictive AI',
    category: 'Case Studies',
    categoryColor: '#059669',
    author: 'WeThink Research',
    date: 'May 10, 2026',
    readTime: '6 min',
    reads: '3.1k',
  },
  {
    id: '3',
    headline: 'Arabic NLP: The Untapped Opportunity in Gulf Tech',
    category: 'AI Trends',
    categoryColor: '#0EA5E9',
    author: 'WeThink Research',
    date: 'May 7, 2026',
    readTime: '5 min',
    reads: '1.8k',
  },
  {
    id: '4',
    headline: 'Dubai Smart City Initiative: AI Lessons Learned',
    category: 'UAE Focus',
    categoryColor: '#D97706',
    author: 'WeThink Research',
    date: 'May 3, 2026',
    readTime: '7 min',
    reads: '4.2k',
  },
  {
    id: '5',
    headline: 'Building AI Teams in the Gulf: Hiring Guide 2025',
    category: 'Guides',
    categoryColor: '#DC2626',
    author: 'WeThink Research',
    date: 'Apr 28, 2026',
    readTime: '10 min',
    reads: '5.7k',
  },
  {
    id: '6',
    headline: "Etisalat's Customer AI: From Pilot to 4M Users",
    category: 'Case Studies',
    categoryColor: '#059669',
    author: 'WeThink Research',
    date: 'Apr 22, 2026',
    readTime: '5 min',
    reads: '2.9k',
  },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function BookmarkIcon({ color, filled, size = 18 }: { color: string; filled: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

function ClockIcon({ color, size = 13 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <Path d="M12 6V12L16 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function EyeIcon({ color, size = 13 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

function MailIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M2 8L12 14L22 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article, index, colors }: { article: typeof ARTICLES[0]; index: number; colors: any }) {
  const [bookmarked, setBookmarked] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 1, delay: index * 60, useNativeDriver: true, damping: 16, stiffness: 130 }),
    ]).start();
  }, []);

  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBookmarked(prev => !prev);
    Animated.sequence([
      Animated.timing(bookmarkScale, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.spring(bookmarkScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.articleCard,
      { backgroundColor: colors.surface, borderColor: colors.border },
      { opacity: opacityAnim, transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
    ]}>
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        activeOpacity={0.85}
      >
        <View style={styles.articleTop}>
          <View style={[styles.categoryBadge, { backgroundColor: article.categoryColor + '18', borderColor: article.categoryColor + '40' }]}>
            <Text style={[styles.categoryText, { color: article.categoryColor }]}>{article.category}</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
            <TouchableOpacity onPress={handleBookmark} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <BookmarkIcon color={bookmarked ? colors.primary : colors.textMuted} filled={bookmarked} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={[styles.articleHeadline, { color: colors.text }]} numberOfLines={2}>
          {article.headline}
        </Text>

        <View style={styles.articleMeta}>
          <View style={[styles.authorDot, { backgroundColor: article.categoryColor }]} />
          <Text style={[styles.authorName, { color: colors.textSecondary }]}>{article.author}</Text>
          <Text style={[styles.metaDot, { color: colors.textMuted }]}>·</Text>
          <Text style={[styles.articleDate, { color: colors.textMuted }]}>{article.date}</Text>
        </View>

        <View style={styles.articleFooter}>
          <View style={styles.metaItem}>
            <ClockIcon color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>{article.readTime} read</Text>
          </View>
          <View style={styles.metaItem}>
            <EyeIcon color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>{article.reads} reads</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Newsletter Signup ────────────────────────────────────────────────────────
function NewsletterCard({ colors }: { colors: any }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubscribed(true);
  };

  return (
    <LinearGradient colors={['#0D1B4B', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.newsletterCard}>
      <View style={styles.newsletterIcon}>
        <MailIcon color="#fff" size={24} />
      </View>
      <Text style={styles.newsletterTitle}>Get Weekly AI Insights</Text>
      <Text style={styles.newsletterSub}>Join 12,000 UAE business leaders</Text>
      {subscribed ? (
        <View style={styles.subscribedRow}>
          <Text style={styles.subscribedText}>You're subscribed! Welcome aboard.</Text>
        </View>
      ) : (
        <View style={styles.newsletterForm}>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor="rgba(255,255,255,0.45)"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe} activeOpacity={0.85}>
            <Text style={styles.subscribeBtnText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function InsightsScreen() {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const filteredArticles = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ── */}
        <Animated.View style={{ opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}>
          <LinearGradient colors={['#0D1B4B', '#0055FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
            <View style={styles.headerInner}>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>Thought Leadership</Text>
              </View>
              <Text style={styles.headerTitle}>Insights</Text>
              <Text style={styles.headerSubtitle}>UAE AI trends, research & case studies</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Category Filter ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow} style={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => { Haptics.selectionAsync(); setActiveCategory(cat); }}
              style={[
                styles.catChip,
                activeCategory === cat
                  ? { backgroundColor: colors.primary, borderColor: colors.primary }
                  : { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              activeOpacity={0.75}
            >
              <Text style={[styles.catChipText, { color: activeCategory === cat ? '#fff' : colors.textSecondary }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Featured Article ── */}
        <View style={styles.featuredSection}>
          <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} activeOpacity={0.9}>
            <LinearGradient colors={FEATURED_ARTICLE.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featuredCard}>
              {/* Bottom overlay */}
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.featuredOverlay} />
              <View style={[styles.categoryBadge, styles.featuredBadge, { backgroundColor: FEATURED_ARTICLE.tagColor }]}>
                <Text style={[styles.categoryText, { color: '#fff' }]}>{FEATURED_ARTICLE.tag}</Text>
              </View>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredHeadline} numberOfLines={3}>{FEATURED_ARTICLE.title}</Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.featuredAvatar}>
                    <Text style={styles.featuredAvatarText}>WT</Text>
                  </View>
                  <Text style={styles.featuredAuthor}>{FEATURED_ARTICLE.author}</Text>
                  <Text style={styles.featuredReadTime}>· {FEATURED_ARTICLE.readTime}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── Article List ── */}
        <View style={styles.articleSection}>
          {filteredArticles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No articles in this category yet.</Text>
            </View>
          ) : (
            filteredArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} colors={colors} />
            ))
          )}
        </View>

        {/* ── Newsletter ── */}
        <View style={styles.newsletterSection}>
          <NewsletterCard colors={colors} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  headerInner: { paddingHorizontal: 24, zIndex: 1 },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  headerBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  headerTitle: { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1, lineHeight: 38, marginBottom: 8 },
  headerSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 20 },

  // Category filter
  catScroll: { marginTop: 20 },
  catRow: { paddingHorizontal: 24, paddingBottom: 4, gap: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  catChipText: { fontSize: 13, fontWeight: '600' },

  // Featured
  featuredSection: { marginTop: 20, paddingHorizontal: 24 },
  featuredCard: { borderRadius: 20, height: 200, overflow: 'hidden', justifyContent: 'flex-end' },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, top: '40%' },
  featuredBadge: { position: 'absolute', top: 16, left: 16, borderColor: 'transparent' },
  featuredContent: { padding: 18 },
  featuredHeadline: { color: '#fff', fontSize: 17, fontWeight: '900', lineHeight: 23, marginBottom: 10, letterSpacing: -0.3 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featuredAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#0055FF', alignItems: 'center', justifyContent: 'center' },
  featuredAvatarText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  featuredAuthor: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
  featuredReadTime: { color: 'rgba(255,255,255,0.65)', fontSize: 12 },

  // Article list
  articleSection: { marginTop: 20, paddingHorizontal: 24, gap: 12 },
  articleCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  articleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  categoryText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  articleHeadline: { fontSize: 15, fontWeight: '800', lineHeight: 21, letterSpacing: -0.2, marginBottom: 10 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  authorDot: { width: 6, height: 6, borderRadius: 3 },
  authorName: { fontSize: 12, fontWeight: '600' },
  metaDot: { fontSize: 12 },
  articleDate: { fontSize: 12 },
  articleFooter: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14 },

  // Newsletter
  newsletterSection: { marginTop: 24, paddingHorizontal: 24 },
  newsletterCard: { borderRadius: 22, padding: 24, gap: 8 },
  newsletterIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  newsletterTitle: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  newsletterSub: { color: 'rgba(255,255,255,0.72)', fontSize: 13, marginBottom: 8 },
  newsletterForm: { flexDirection: 'row', gap: 8, marginTop: 4 },
  emailInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subscribeBtn: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 11, justifyContent: 'center' },
  subscribeBtnText: { color: '#7C3AED', fontSize: 14, fontWeight: '800' },
  subscribedRow: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginTop: 4 },
  subscribedText: { color: '#fff', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
