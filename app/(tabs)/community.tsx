import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TextInput, TouchableOpacity, Dimensions, Platform, StatusBar, Linking,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring,
  withRepeat, withSequence, withDelay, Easing as REasing,
  interpolate, cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');

// ─── Brand Colors ─────────────────────────────────────────────────────────────
const BLUE = '#0055FF';
const PURPLE = '#7C3AED';
const TEAL = '#0EA5E9';
const GREEN = '#059669';
const AMBER = '#D97706';
const RED = '#DC2626';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Case Studies', 'Market Reports', 'AI Trends', 'UAE Focus', 'Guides'];

const FEATURED_ARTICLE = {
  title: 'The Future of AI in Enterprise: 2025 Global Trends Report',
  tag: 'Featured',
  source: 'Reuters AI',
  tagColor: PURPLE,
  readTime: '12 min read',
  author: 'WeThink Research',
  gradient: ['#0055FF', '#4338ca', '#7C3AED'] as const,
  url: 'https://www.reuters.com/technology/artificial-intelligence/',
};

const ARTICLES = [
  {
    id: '1',
    headline: 'How AI is Reshaping Banking in the Middle East',
    source: 'Khaleej Times',
    category: 'Case Studies',
    categoryColor: BLUE,
    readTime: '5 min',
    trending: true,
    url: 'https://www.khaleejtimes.com/uae/technology',
  },
  {
    id: '2',
    headline: "DEWA's Smart Grid AI Implementation Success",
    source: 'DEWA Press',
    category: 'UAE Focus',
    categoryColor: GREEN,
    readTime: '4 min',
    trending: false,
    url: 'https://www.dewa.gov.ae/en/about-dewa/news-and-media/press-and-news',
  },
  {
    id: '3',
    headline: 'Arabic NLP: State of the Art Models for Gulf Enterprises',
    source: 'Hugging Face',
    category: 'AI Trends',
    categoryColor: PURPLE,
    readTime: '8 min',
    trending: true,
    url: 'https://huggingface.co/models?language=ar',
  },
  {
    id: '4',
    headline: 'Smart Dubai 2030: AI-Powered Government Services',
    source: 'Smart Dubai',
    category: 'UAE Focus',
    categoryColor: TEAL,
    readTime: '6 min',
    trending: false,
    url: 'https://www.digitaldubai.ae',
  },
  {
    id: '5',
    headline: 'AI for Enterprise: Complete Learning Path 2025',
    source: 'LinkedIn Learning',
    category: 'Guides',
    categoryColor: AMBER,
    readTime: '10 min',
    trending: false,
    url: 'https://www.linkedin.com/learning/topics/artificial-intelligence',
  },
  {
    id: '6',
    headline: 'e& Group Digital Transformation Report — AI at Scale',
    source: 'e& (Etisalat)',
    category: 'Market Reports',
    categoryColor: BLUE,
    readTime: '7 min',
    trending: true,
    url: 'https://www.eand.com/en/media-centre.html',
  },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function BookmarkIcon({ color, filled }: { color: string; filled: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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

function ClockIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function EyeIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function MailIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M2 8L12 14L22 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Featured Article Card ────────────────────────────────────────────────────

function FeaturedCard() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.96);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 14, stiffness: 110 });
  }, []);

  return (
    <Animated.View style={cardStyle}>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); Linking.openURL(FEATURED_ARTICLE.url); }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={FEATURED_ARTICLE.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredCard}
        >
          {/* Decorative SVG */}
          <Svg style={StyleSheet.absoluteFill as any} width={W - 32} height={220} pointerEvents="none">
            <Circle cx={(W - 32) * 0.85} cy={50} r={80} fill="rgba(124,58,237,0.2)" />
            <Circle cx={(W - 32) * 0.1} cy={180} r={50} fill="rgba(14,165,233,0.12)" />
            <Ellipse cx={(W - 32) * 0.5} cy={220} rx={140} ry={50} fill="rgba(0,0,0,0.3)" />
          </Svg>

          {/* Gradient overlay for readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.featuredOverlay}
          />

          {/* Content at bottom */}
          <View style={styles.featuredContent}>
            <View style={styles.featuredTopRow}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>{FEATURED_ARTICLE.tag}</Text>
              </View>
              <Text style={styles.featuredSource}>{FEATURED_ARTICLE.source} · {FEATURED_ARTICLE.readTime}</Text>
            </View>
            <Text style={styles.featuredHeadline} numberOfLines={3}>
              {FEATURED_ARTICLE.title}
            </Text>
            <View style={styles.featuredMeta}>
              <Text style={styles.featuredReadLink}>Read on Reuters →</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({
  article, index, colors,
}: {
  article: typeof ARTICLES[0];
  index: number;
  colors: any;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const slideAnim = useSharedValue(24);
  const opacityAnim = useSharedValue(0);
  const bookmarkScale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
    transform: [{ translateY: slideAnim.value }, { scale: cardScale.value }],
  }));

  const bookmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  useEffect(() => {
    opacityAnim.value = withDelay(index * 65, withTiming(1, { duration: 350 }));
    slideAnim.value = withDelay(index * 65, withSpring(0, { damping: 16, stiffness: 130 }));
  }, []);

  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBookmarked(prev => !prev);
    bookmarkScale.value = withSequence(
      withSpring(1.4, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
  }, []);

  const handlePressIn = () => {
    cardScale.value = withSpring(0.98, { damping: 14 });
  };
  const handlePressOut = () => {
    cardScale.value = withSpring(1, { damping: 12 });
  };

  return (
    <Animated.View
      style={[
        styles.articleCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: article.categoryColor,
          shadowColor: article.categoryColor,
        },
        cardStyle,
      ]}
    >
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL(article.url); }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Source + meta row */}
        <View style={styles.articleSourceRow}>
          <Text style={[styles.articleSource, { color: colors.textMuted }]}>{article.source}</Text>
          <Text style={[styles.metaDot, { color: colors.textMuted }]}>•</Text>
          <ClockIcon color={colors.textMuted} />
          <Text style={[styles.metaText, { color: colors.textMuted }]}>{article.readTime}</Text>
          {article.trending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingText}>↑ Trending</Text>
            </View>
          )}
        </View>

        <View style={styles.articleTop}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: article.categoryColor + '18',
                borderColor: article.categoryColor + '40',
              },
            ]}
          >
            <Text style={[styles.categoryText, { color: article.categoryColor }]}>
              {article.category}
            </Text>
          </View>
          <Animated.View style={bookmarkStyle}>
            <TouchableOpacity
              onPress={handleBookmark}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <BookmarkIcon
                color={bookmarked ? colors.primary : colors.textMuted}
                filled={bookmarked}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={[styles.articleHeadline, { color: colors.text }]} numberOfLines={2}>
          {article.headline}
        </Text>

        <Text style={[styles.readArticleLink, { color: article.categoryColor }]}>
          Read article ↗
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Newsletter Signup ────────────────────────────────────────────────────────

function NewsletterCard({ colors }: { colors: any }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const btnScale = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleSubscribe = () => {
    if (!email.trim()) return;
    btnScale.value = withSequence(
      withSpring(0.94, { damping: 12 }),
      withSpring(1, { damping: 10 }),
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubscribed(true);
  };

  return (
    <LinearGradient
      colors={['#0D1B4B', '#3B0764', '#7C3AED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.newsletterCard}
    >
      <Svg style={StyleSheet.absoluteFill as any} width={W - 48} height={160} pointerEvents="none">
        <Circle cx={W - 80} cy={80} r={90} fill="rgba(255,255,255,0.04)" />
        <Circle cx={20} cy={160} r={60} fill="rgba(0,0,0,0.1)" />
      </Svg>

      <View style={styles.newsletterIconWrap}>
        <MailIcon color="#fff" />
      </View>
      <Text style={styles.newsletterTitle}>Get Weekly AI Insights</Text>
      <Text style={styles.newsletterSub}>Join 12,000+ UAE business leaders</Text>

      {subscribed ? (
        <View style={styles.subscribedBubble}>
          <Text style={styles.subscribedText}>You're in! Welcome to the community.</Text>
        </View>
      ) : (
        <View style={styles.newsletterForm}>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Animated.View style={btnStyle}>
            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={handleSubscribe}
              activeOpacity={0.88}
            >
              <Text style={styles.subscribeBtnText}>Subscribe</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </LinearGradient>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const headerFade = useSharedValue(0);
  const headerSlide = useSharedValue(-24);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerFade.value,
    transform: [{ translateY: headerSlide.value }],
  }));

  useEffect(() => {
    headerFade.value = withTiming(1, { duration: 600 });
    headerSlide.value = withSpring(0, { damping: 16, stiffness: 120 });
  }, []);

  const filteredArticles = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ── */}
        <Animated.View style={headerStyle}>
          <LinearGradient
            colors={['#0D1B4B', '#0055FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Svg style={StyleSheet.absoluteFill as any} width={W} height={180} pointerEvents="none">
              <Ellipse cx={W * 0.88} cy={40} rx={90} ry={90} fill="rgba(124,58,237,0.2)" />
              <Ellipse cx={W * 0.1} cy={160} rx={60} ry={60} fill="rgba(14,165,233,0.1)" />
              <Circle cx={W * 0.55} cy={-10} r={50} fill="rgba(255,255,255,0.04)" />
            </Svg>
            <View style={styles.headerInner}>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>Thought Leadership</Text>
              </View>
              <Text style={styles.headerTitle}>Insights</Text>
              <Text style={styles.headerSubtitle}>
                UAE AI trends, research & case studies from the region's leading AI firm
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Category Filter ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
          style={styles.catScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveCategory(cat);
              }}
              style={[
                styles.catChip,
                activeCategory === cat
                  ? { backgroundColor: colors.primary, borderColor: colors.primary }
                  : { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.catChipText,
                  { color: activeCategory === cat ? '#fff' : colors.textSecondary },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Featured Article ── */}
        <View style={styles.featuredSection}>
          <FeaturedCard />
        </View>

        {/* ── Article List ── */}
        <View style={styles.articleSection}>
          {filteredArticles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No articles in this category yet.
              </Text>
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
    paddingBottom: 36,
    overflow: 'hidden',
    minHeight: 180,
  },
  headerInner: { paddingHorizontal: 20, zIndex: 1 },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  headerBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  headerTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 8,
  },
  headerSubtitle: { color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 20 },

  // Category filter
  catScroll: { marginTop: 28 },
  catRow: { paddingHorizontal: 20, paddingBottom: 4, gap: 8 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
  },
  catChipText: { fontSize: 13, fontWeight: '600' },

  // Featured
  featuredSection: { marginTop: 28, paddingHorizontal: 20 },
  featuredCard: {
    borderRadius: 22,
    minHeight: 200,
    height: 230,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: '35%',
  },
  featuredTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  featuredBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  featuredBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  featuredSource: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '500' },
  featuredContent: { padding: 20, justifyContent: 'flex-end', flex: 1 },
  featuredHeadline: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 23,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  featuredReadLink: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600' },
  featuredAvatar: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featuredAvatarText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  featuredAuthor: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
  featuredDot: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  featuredReadTime: { color: 'rgba(255,255,255,0.65)', fontSize: 12 },

  // Article list
  articleSection: { marginTop: 28, paddingHorizontal: 20, gap: 14 },
  articleCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 14,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  articleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  articleSourceRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  articleSource: { fontSize: 11, fontWeight: '600' },
  trendingBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(5,150,105,0.15)',
    borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
  trendingText: { fontSize: 9, fontWeight: '700', color: '#34d399' },
  readArticleLink: { fontSize: 11, fontWeight: '700', marginTop: 6 },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  articleHeadline: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    letterSpacing: -0.2,
    marginBottom: 10,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  authorDot: { width: 6, height: 6, borderRadius: 3 },
  authorName: { fontSize: 12, fontWeight: '600' },
  metaDot: { fontSize: 12 },
  articleDate: { fontSize: 12 },
  articleFooter: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14 },

  // Newsletter
  newsletterSection: { marginTop: 28, paddingHorizontal: 20 },
  newsletterCard: { borderRadius: 24, padding: 24, overflow: 'hidden' },
  newsletterIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  newsletterTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  newsletterSub: { color: 'rgba(255,255,255,0.72)', fontSize: 13, marginBottom: 16 },
  newsletterForm: { flexDirection: 'row', gap: 8 },
  emailInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subscribeBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  subscribeBtnText: { color: PURPLE, fontSize: 14, fontWeight: '800' },
  subscribedBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subscribedText: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
