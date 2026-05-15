import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

const { width: W } = Dimensions.get('window');

// ─── Types ───────────────────────────────────────────────────────────────────

interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
}

interface Discussion {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  time: string;
  category: string;
  title: string;
  preview: string;
  likes: number;
  comments: number;
  sentiment: { pos: number; neu: number; neg: number };
  isPoll: boolean;
  poll?: Poll;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DISCUSSIONS: Discussion[] = [
  {
    id: '1',
    author: 'Sarah Al-Rashid',
    initials: 'SR',
    avatarColor: '#7C3AED',
    time: '2h ago',
    category: 'AI',
    title: 'Is AI replacing human creativity or enhancing it?',
    preview:
      'The debate around AI-generated content has intensified. While tools like GPT-4 and Midjourney produce impressive outputs, many argue that true creativity still requires human emotion and lived experience...',
    likes: 234,
    comments: 89,
    sentiment: { pos: 45, neu: 30, neg: 25 },
    isPoll: false,
  },
  {
    id: '2',
    author: 'Mohammed Al-Farsi',
    initials: 'MF',
    avatarColor: '#0055FF',
    time: '4h ago',
    category: 'UAE',
    title: 'Poll: Should UAE mandate AI literacy in schools?',
    preview: '',
    likes: 567,
    comments: 143,
    sentiment: { pos: 70, neu: 20, neg: 10 },
    isPoll: true,
    poll: {
      question: 'Should UAE mandate AI literacy from Grade 1?',
      options: [
        { text: 'Yes, immediately', votes: 1240 },
        { text: 'Yes, from Grade 6', votes: 876 },
        { text: 'Optional only', votes: 432 },
        { text: 'No', votes: 198 },
      ],
      totalVotes: 2746,
    },
  },
  {
    id: '3',
    author: 'Priya Sharma',
    initials: 'PS',
    avatarColor: '#059669',
    time: '6h ago',
    category: 'Business',
    title: "How WeThink's AI is transforming UAE banking",
    preview:
      "Having implemented WeThink's fraud detection at three major UAE banks, I can confirm the numbers are real. The system catches 94% of fraudulent transactions in real-time, saving millions daily...",
    likes: 412,
    comments: 67,
    sentiment: { pos: 80, neu: 15, neg: 5 },
    isPoll: false,
  },
  {
    id: '4',
    author: 'James Chen',
    initials: 'JC',
    avatarColor: '#D97706',
    time: '1d ago',
    category: 'Tech',
    title: 'The case for and against autonomous vehicles in Gulf cities',
    preview:
      "Dubai's Roads and Transport Authority recently approved a pilot for fully autonomous taxis. Supporters cite efficiency gains; critics worry about job displacement for 50,000+ drivers...",
    likes: 189,
    comments: 234,
    sentiment: { pos: 35, neu: 40, neg: 25 },
    isPoll: false,
  },
];

const TRENDING_TOPICS = ['#AIPolicy', '#UAE2031', '#Fintech', '#ClimateGulf', '#StartupDXB', '#Web3', '#HealthTech'];

const SORT_TABS = ['Trending', 'Latest', 'Following'];

const CATEGORY_COLORS: Record<string, string> = {
  AI: '#7C3AED',
  Tech: '#0EA5E9',
  Business: '#059669',
  UAE: '#D97706',
  Global: '#DC2626',
};

const AI_SUMMARIES: Record<string, string[]> = {
  '1': [
    'The debate centers on whether AI tools augment or replace human creativity.',
    '55% of respondents believe AI enhances rather than replaces creative work.',
    'Key concern: economic impact on creative professionals over the next decade.',
    'Consensus: human emotional depth remains irreplaceable in artistic expression.',
  ],
  '2': [
    '88% of UAE educators support some form of mandatory AI literacy curriculum.',
    'Grade 6 introduction is preferred by most education policy experts.',
    'Current pilot programs in 12 Dubai schools show measurable skill improvements.',
    'Opposition cites infrastructure readiness in rural and northern emirates.',
  ],
  '3': [
    "WeThink's fraud detection system achieved 94% accuracy across 3 UAE banks.",
    'Real-time processing reduced false positives by 67% vs. legacy systems.',
    'Estimated AED 340M saved in fraudulent transactions in Q1 alone.',
    'Full rollout to 8 additional banks planned for H2 2026.',
  ],
  '4': [
    'RTA approved a 6-month autonomous taxi pilot in Downtown Dubai and DIFC.',
    'Current fleet of 50,000+ ride-hail drivers face medium-term displacement risk.',
    'Economic modelling shows net positive job creation in AV maintenance and ops.',
    'Public sentiment: 35% positive, split evenly between safety and efficiency concerns.',
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PencilIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56261 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BookmarkIcon({ color, size = 18, filled = false }: { color: string; size?: number; filled?: boolean }) {
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

function ShareIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 6L12 2L8 6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="12" y1="2" x2="12" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function SparkleIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={color + '40'}
      />
    </Svg>
  );
}

// ─── Skeleton Line ─────────────────────────────────────────────────────────────

function SkeletonLine({ widthPct, colors }: { widthPct: number; colors: any }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      style={{
        height: 14,
        width: `${widthPct}%` as `${number}%`,
        borderRadius: 7,
        backgroundColor: colors.border,
        opacity,
        marginBottom: 10,
      }}
    />
  );
}

// ─── AI Summary Modal ─────────────────────────────────────────────────────────

interface AISummaryModalProps {
  visible: boolean;
  discussionId: string | null;
  onClose: () => void;
}

function AISummaryModal({ visible, discussionId, onClose }: AISummaryModalProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setLoading(true);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 380, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 400, duration: 300, useNativeDriver: true, easing: Easing.in(Easing.cubic) }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, slideAnim, backdropAnim]);

  const summaryPoints = discussionId ? AI_SUMMARIES[discussionId] ?? [] : [];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropAnim, backgroundColor: colors.overlay }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <Animated.View
          style={[
            styles.modalSheet,
            { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle */}
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <View style={[styles.aiChip, { backgroundColor: colors.accentLight }]}>
                <SparkleIcon color={colors.accent} size={14} />
                <Text style={[styles.aiChipText, { color: colors.accent }]}>AI Summary</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.modalCloseBtn, { backgroundColor: colors.borderLight }]}>
              <Text style={[styles.modalCloseBtnText, { color: colors.textSecondary }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
            Generated by WeThink AI · Based on 100+ comments
          </Text>

          {/* Content */}
          <View style={styles.modalContent}>
            {loading ? (
              <>
                <SkeletonLine width="90%" colors={colors} />
                <SkeletonLine width="75%" colors={colors} />
                <SkeletonLine width="85%" colors={colors} />
                <SkeletonLine width="60%" colors={colors} />
              </>
            ) : (
              summaryPoints.map((point, i) => (
                <View key={i} style={styles.summaryPoint}>
                  <View style={[styles.summaryDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.summaryText, { color: colors.text }]}>{point}</Text>
                </View>
              ))
            )}
          </View>

          {/* Footer disclaimer */}
          {!loading && (
            <Text style={[styles.modalDisclaimer, { color: colors.textMuted }]}>
              AI summaries may not reflect all viewpoints. Always read the full discussion.
            </Text>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─── Poll Card ────────────────────────────────────────────────────────────────

function PollCard({ poll, colors }: { poll: Poll; colors: any }) {
  const [voted, setVoted] = useState<number | null>(null);
  const barAnims = useRef(poll.options.map(() => new Animated.Value(0))).current;

  const handleVote = useCallback((idx: number) => {
    if (voted !== null) return;
    setVoted(idx);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    poll.options.forEach((opt, i) => {
      const pct = (opt.votes / poll.totalVotes) * 100;
      Animated.timing(barAnims[i], {
        toValue: pct,
        duration: 600,
        delay: i * 80,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }).start();
    });
  }, [voted, barAnims, poll]);

  const BAR_COLORS = ['#7C3AED', '#0055FF', '#059669', '#D97706'];

  return (
    <View style={[styles.pollContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderLight }]}>
      <Text style={[styles.pollQuestion, { color: colors.text }]}>{poll.question}</Text>
      {poll.options.map((opt, i) => {
        const pct = Math.round((opt.votes / poll.totalVotes) * 100);
        const isWinner = opt.votes === Math.max(...poll.options.map(o => o.votes));
        return (
          <TouchableOpacity
            key={i}
            onPress={() => handleVote(i)}
            activeOpacity={voted !== null ? 1 : 0.7}
            style={styles.pollOptionWrapper}
          >
            <View style={[styles.pollOption, { borderColor: voted === i ? BAR_COLORS[i] : colors.border, backgroundColor: colors.card }]}>
              <View style={styles.pollOptionTop}>
                <Text style={[styles.pollOptionText, { color: voted !== null && isWinner ? BAR_COLORS[i] : colors.text, fontWeight: isWinner && voted !== null ? '700' : '500' }]}>
                  {opt.text}
                </Text>
                {voted !== null && (
                  <Text style={[styles.pollPct, { color: BAR_COLORS[i] }]}>{pct}%</Text>
                )}
              </View>
              {voted !== null && (
                <Animated.View
                  style={[
                    styles.pollBar,
                    {
                      width: barAnims[i].interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                      backgroundColor: BAR_COLORS[i] + '30',
                    },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      <Text style={[styles.pollTotal, { color: colors.textMuted }]}>
        {poll.totalVotes.toLocaleString()} votes · {voted !== null ? 'You voted' : 'Tap to vote'}
      </Text>
    </View>
  );
}

// ─── Discussion Card ──────────────────────────────────────────────────────────

interface DiscussionCardProps {
  item: Discussion;
  onAISummary: (id: string) => void;
}

function DiscussionCard({ item, onAISummary }: DiscussionCardProps) {
  const { colors } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const likeScale = useRef(new Animated.Value(1)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [cardAnim]);

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !liked;
    setLiked(next);
    setLikeCount(c => c + (next ? 1 : -1));
    Animated.sequence([
      Animated.timing(likeScale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  }, [liked, likeScale]);

  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBookmarked(b => !b);
  }, []);

  const catColor = CATEGORY_COLORS[item.category] ?? colors.primary;
  const totalSentiment = item.sentiment.pos + item.sentiment.neu + item.sentiment.neg;
  const posW = (item.sentiment.pos / totalSentiment) * 100;
  const neuW = (item.sentiment.neu / totalSentiment) * 100;
  const negW = (item.sentiment.neg / totalSentiment) * 100;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.borderLight,
          opacity: cardAnim,
          transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        },
      ]}
    >
      {/* Author row */}
      <View style={styles.cardAuthorRow}>
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
          <Text style={styles.avatarInitials}>{item.initials}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: colors.text }]}>{item.author}</Text>
          <Text style={[styles.authorTime, { color: colors.textMuted }]}>{item.time}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: catColor + '18', borderColor: catColor + '40' }]}>
          <Text style={[styles.categoryText, { color: catColor }]}>{item.category}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Preview */}
      {item.preview.length > 0 && (
        <Text style={[styles.cardPreview, { color: colors.textSecondary }]} numberOfLines={3}>
          {item.preview}
        </Text>
      )}

      {/* Poll */}
      {item.isPoll && item.poll && (
        <PollCard poll={item.poll} colors={colors} />
      )}

      {/* AI Summary button */}
      <TouchableOpacity
        onPress={() => onAISummary(item.id)}
        style={[styles.aiSummaryBtn, { backgroundColor: colors.accentLight, borderColor: colors.accent + '30' }]}
        activeOpacity={0.75}
      >
        <SparkleIcon color={colors.accent} size={13} />
        <Text style={[styles.aiSummaryText, { color: colors.accent }]}>AI Summary</Text>
      </TouchableOpacity>

      {/* Sentiment bar */}
      <View style={styles.sentimentRow}>
        <Text style={[styles.sentimentLabel, { color: colors.textMuted }]}>Sentiment</Text>
        <View style={styles.sentimentBar}>
          <View style={[styles.sentimentSegment, { width: `${posW}%`, backgroundColor: '#059669' }]} />
          <View style={[styles.sentimentSegment, { width: `${neuW}%`, backgroundColor: '#94A3B8' }]} />
          <View style={[styles.sentimentSegment, { width: `${negW}%`, backgroundColor: '#DC2626' }]} />
        </View>
        <View style={styles.sentimentLegend}>
          <Text style={[styles.sentimentLegendText, { color: '#059669' }]}>{item.sentiment.pos}%</Text>
          <Text style={[styles.sentimentLegendText, { color: '#94A3B8' }]}>{item.sentiment.neu}%</Text>
          <Text style={[styles.sentimentLegendText, { color: '#DC2626' }]}>{item.sentiment.neg}%</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.cardFooter, { borderTopColor: colors.borderLight }]}>
        {/* Comments */}
        <TouchableOpacity style={styles.footerAction} activeOpacity={0.7}>
          <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"
              stroke={colors.textMuted}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[styles.footerCount, { color: colors.textMuted }]}>{item.comments}</Text>
        </TouchableOpacity>

        {/* Likes */}
        <Animated.View style={{ transform: [{ scale: likeScale }] }}>
          <TouchableOpacity style={styles.footerAction} onPress={handleLike} activeOpacity={0.7}>
            <Text style={[styles.footerHeart, { color: liked ? '#DC2626' : colors.textMuted }]}>
              {liked ? '♥' : '♡'}
            </Text>
            <Text style={[styles.footerCount, { color: liked ? '#DC2626' : colors.textMuted }]}>
              {likeCount}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Share */}
        <TouchableOpacity style={styles.footerAction} activeOpacity={0.7}>
          <ShareIcon color={colors.textMuted} size={17} />
        </TouchableOpacity>

        {/* Bookmark */}
        <TouchableOpacity onPress={handleBookmark} style={styles.footerAction} activeOpacity={0.7}>
          <BookmarkIcon
            color={bookmarked ? colors.primary : colors.textMuted}
            size={17}
            filled={bookmarked}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const { colors } = useTheme();
  const [activeSort, setActiveSort] = useState('Trending');
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const fabScale = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [headerAnim]);

  const openSummary = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSummaryId(id);
    setSummaryVisible(true);
  }, []);

  const closeSummary = useCallback(() => {
    setSummaryVisible(false);
  }, []);

  const handleFAB = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.88, duration: 100, useNativeDriver: true }),
      Animated.spring(fabScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
    router.push('/compose' as any);
  }, [fabScale]);

  const handleSortTab = (tab: string) => {
    Haptics.selectionAsync();
    setActiveSort(tab);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#F1F5F9' ? 'light-content' : 'dark-content'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
            },
          ]}
        >
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Community</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>Join the conversation</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/compose' as any)}
            style={[styles.headerComposeBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.82}
          >
            <PencilIcon color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </Animated.View>

        {/* Trending topics row */}
        <View>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>TRENDING TOPICS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicsRow}
          >
            {TRENDING_TOPICS.map((topic, i) => (
              <TouchableOpacity
                key={topic}
                style={[
                  styles.topicPill,
                  {
                    backgroundColor: i % 3 === 0 ? colors.primaryLight : i % 3 === 1 ? colors.accentLight : colors.surfaceSecondary,
                    borderColor: i % 3 === 0 ? colors.primary + '30' : i % 3 === 1 ? colors.accent + '30' : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.topicText,
                    { color: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.accent : colors.textSecondary },
                  ]}
                >
                  {topic}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sort tabs */}
        <View style={[styles.sortRow, { borderBottomColor: colors.borderLight }]}>
          {SORT_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleSortTab(tab)}
              style={styles.sortTab}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortTabText, { color: activeSort === tab ? colors.primary : colors.textMuted, fontWeight: activeSort === tab ? '700' : '500' }]}>
                {tab}
              </Text>
              {activeSort === tab && (
                <View style={[styles.sortTabIndicator, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Discussion cards */}
        <View style={styles.feed}>
          {DISCUSSIONS.map(item => (
            <DiscussionCard key={item.id} item={item} onAISummary={openSummary} />
          ))}
        </View>

        {/* Bottom spacer for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity onPress={handleFAB} activeOpacity={1}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <PencilIcon color="#FFFFFF" size={22} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* AI Summary Modal */}
      <AISummaryModal
        visible={summaryVisible}
        discussionId={summaryId}
        onClose={closeSummary}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: Platform.OS === 'ios' ? 56 : 40 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, marginTop: 2 },
  headerComposeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section label
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, paddingHorizontal: 20, marginBottom: 10 },

  // Topics
  topicsRow: { paddingHorizontal: 20, paddingBottom: 4, gap: 8 },
  topicPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  topicText: { fontSize: 13, fontWeight: '600' },

  // Sort tabs
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    borderBottomWidth: 1,
  },
  sortTab: { marginRight: 28, paddingBottom: 12, position: 'relative', alignItems: 'center' },
  sortTabText: { fontSize: 15 },
  sortTabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2.5, borderRadius: 2 },

  // Feed
  feed: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },

  // Card
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#0A1628',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardAuthorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  authorInfo: { flex: 1, marginLeft: 10 },
  authorName: { fontSize: 14, fontWeight: '700' },
  authorTime: { fontSize: 12, marginTop: 1 },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },

  cardTitle: { fontSize: 16, fontWeight: '800', lineHeight: 22, marginBottom: 8, letterSpacing: -0.2 },
  cardPreview: { fontSize: 14, lineHeight: 20, marginBottom: 12 },

  // Poll
  pollContainer: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12, gap: 8 },
  pollQuestion: { fontSize: 14, fontWeight: '700', marginBottom: 6, lineHeight: 20 },
  pollOptionWrapper: { marginBottom: 4 },
  pollOption: {
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'relative',
  },
  pollOptionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  pollOptionText: { fontSize: 13, flex: 1 },
  pollPct: { fontSize: 13, fontWeight: '700', marginLeft: 8 },
  pollBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 8,
  },
  pollTotal: { fontSize: 12, marginTop: 4 },

  // AI Summary button
  aiSummaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  aiSummaryText: { fontSize: 12, fontWeight: '700' },

  // Sentiment
  sentimentRow: { marginBottom: 14, gap: 6 },
  sentimentLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  sentimentBar: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1 },
  sentimentSegment: { height: '100%', borderRadius: 3 },
  sentimentLegend: { flexDirection: 'row', gap: 12 },
  sentimentLegendText: { fontSize: 11, fontWeight: '600' },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 20,
  },
  footerAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerCount: { fontSize: 13, fontWeight: '600' },
  footerHeart: { fontSize: 18, lineHeight: 22 },

  // FAB
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 108 : 80,
    right: 20,
    borderRadius: 30,
    shadowColor: '#0055FF',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  fabGradient: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },

  // Modal
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    minHeight: 340,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  aiChipText: { fontSize: 14, fontWeight: '700' },
  modalCloseBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  modalCloseBtnText: { fontSize: 14, fontWeight: '600' },
  modalSubtitle: { fontSize: 12, paddingHorizontal: 20, marginTop: 4, marginBottom: 20 },
  modalContent: { paddingHorizontal: 20, gap: 4 },
  summaryPoint: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  summaryDot: { width: 7, height: 7, borderRadius: 4, marginTop: 7 },
  summaryText: { flex: 1, fontSize: 15, lineHeight: 22 },
  modalDisclaimer: { fontSize: 11, paddingHorizontal: 20, marginTop: 20, lineHeight: 16 },
});
