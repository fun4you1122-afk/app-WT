import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Animated, Easing, ScrollView, StyleSheet, View, Text,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');
const CHAT_KEY = '@wethink_consult_chat';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WELCOME: Message = {
  id: '__welcome__',
  role: 'assistant',
  content: "Hi! I'm WeThink AI. Ask me anything about our services, UAE AI trends, or how we can help your business.",
  time: 'Just now',
};

const SUGGESTED_PROMPTS = [
  'What services do you offer?',
  'How much does AI consulting cost?',
  'Can you help with Arabic NLP?',
  "What's your project timeline?",
];

// ─── AI Response Logic ────────────────────────────────────────────────────────

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes('service') || lower.includes('offer') || lower.includes('what do')) {
    return "We offer four core AI services:\n\n1. AI Strategy & Consulting — Custom AI roadmaps, digital maturity assessments and ROI analysis.\n\n2. Custom AI Development — Bespoke ML models, Arabic NLP systems and computer vision solutions.\n\n3. Data Engineering — End-to-end data pipelines, lakes and real-time analytics.\n\n4. AI Integration — Connect AI to your existing ERP, legacy systems and API infrastructure.\n\nWould you like to learn more about any of these?";
  }

  if (lower.includes('cost') || lower.includes('price') || lower.includes('how much') || lower.includes('pricing')) {
    return "Our engagements start from AED 50,000 for strategy consulting. We offer three flexible models:\n\n• Project-Based: AED 50K–500K, fixed scope\n• Retainer: AED 30K/month, ongoing partnership\n• Staff Augmentation: AED 15K/resource/month\n\nBook a free call to get a custom quote tailored to your needs.";
  }

  if (lower.includes('timeline') || lower.includes('how long') || lower.includes('duration')) {
    return "Typical project timelines:\n\n• AI Strategy: 4–6 weeks\n• Proof of Concept: 6–8 weeks\n• Custom AI Development: 3–6 months\n• Data Engineering: 2–4 months\n\nWe provide a detailed project plan after the discovery call. Every engagement starts with a scoping workshop to define milestones.";
  }

  if (lower.includes('arabic') || lower.includes('nlp') || lower.includes('language') || lower.includes('gulf')) {
    return "Yes! Arabic NLP is one of our core specialisations. We are one of very few Gulf-based AI firms with:\n\n• Native Arabic language models trained on UAE-specific datasets\n• Dialect-aware NLP for Gulf Arabic, Egyptian, and MSA\n• Legal and government document processing in Arabic\n• Arabic sentiment analysis and chatbot frameworks\n\nThis is a major differentiator — most global AI tools fail on Gulf Arabic dialects.";
  }

  if (lower.includes('contact') || lower.includes('reach') || lower.includes('email') || lower.includes('phone') || lower.includes('call')) {
    return "You can reach us through several channels:\n\n• Email: hello@wethink.ae\n• Phone: +971 4 XXX XXXX\n• LinkedIn: WeThink.ae\n• Office: Dubai Internet City, UAE\n\nOr book a free 30-minute consultation directly in this app — tap 'Schedule Now' above!";
  }

  if (lower.includes('team') || lower.includes('who') || lower.includes('founder') || lower.includes('employee')) {
    return "WeThink was founded in 2019 in Dubai. Our team of 200+ includes:\n\n• AI engineers and data scientists\n• Domain experts in banking, government, energy and telecom\n• Arabic NLP specialists\n• Project managers and delivery consultants\n\nOur leadership includes Rasha Aljalam (CEO), Khalid Al-Mansouri (CTO, ex-Google Brain) and Sarah Chen (Head of Delivery, 80+ projects).";
  }

  if (lower.includes('client') || lower.includes('customer') || lower.includes('who have you')) {
    return "We've worked with 180+ organisations across the UAE and wider GCC, including:\n\n• Emirates NBD — AI Fraud Detection (AED 340M saved)\n• ADNOC — Predictive maintenance AI\n• Dubai Municipality — Smart city AI platform\n• Etisalat — Customer AI serving 4M users\n• DEWA — 23% cost reduction with predictive AI\n• RTA Dubai — Traffic optimisation AI\n\nAll engagements are covered by our enterprise NDA.";
  }

  return "Great question! Our team of 200+ AI specialists would love to help. Here's what I can tell you:\n\n• We serve 180+ enterprises across the UAE and GCC\n• We specialise in Arabic NLP, enterprise AI and data engineering\n• Engagements from AED 50K with flexible models\n\nWould you like me to connect you with a consultant, or can I answer more specific questions?";
}

function getTime(): string {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function CalendarIcon({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function SendIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────

function TypingIndicator({ colors }: { colors: any }) {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 150),
        Animated.timing(dot, { toValue: -6, duration: 280, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 280, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(280),
      ]))
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View style={[typingStyles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {dots.map((dot, i) => (
        <Animated.View key={i} style={[typingStyles.dot, { backgroundColor: colors.textMuted, transform: [{ translateY: dot }] }]} />
      ))}
    </View>
  );
}

const typingStyles = StyleSheet.create({
  bubble: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, borderBottomLeftRadius: 4, borderWidth: 1 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});

// ─── Message Bubble ──────────────────────────────────────────────────────────

function Bubble({ msg, colors }: { msg: Message; colors: any }) {
  const isUser = msg.role === 'user';
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[bubbleStyles.row, isUser && bubbleStyles.rowUser, { opacity, transform: [{ translateY }] }]}>
      {!isUser && (
        <LinearGradient colors={['#0055FF', '#7C3AED']} style={bubbleStyles.avatar}>
          <Text style={bubbleStyles.avatarText}>W</Text>
        </LinearGradient>
      )}
      <View style={[
        bubbleStyles.bubble,
        isUser
          ? { backgroundColor: '#0055FF' }
          : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
        isUser ? bubbleStyles.bubbleUser : bubbleStyles.bubbleAI,
      ]}>
        <Text style={[bubbleStyles.text, { color: isUser ? '#fff' : colors.text }]}>{msg.content}</Text>
        <Text style={[bubbleStyles.time, { color: isUser ? 'rgba(255,255,255,0.6)' : colors.textMuted }]}>{msg.time}</Text>
      </View>
    </Animated.View>
  );
}

const bubbleStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  rowUser: { flexDirection: 'row-reverse' },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 },
  avatarText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  bubble: { maxWidth: W * 0.72, borderRadius: 18, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  bubbleAI: { borderBottomLeftRadius: 4 },
  bubbleUser: { borderBottomRightRadius: 4 },
  text: { fontSize: 14.5, lineHeight: 22 },
  time: { fontSize: 10, marginTop: 6, textAlign: 'right' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ConsultScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHAT_KEY)
      .then((raw: string | null) => {
        if (raw) {
          const saved: Message[] = JSON.parse(raw);
          if (saved.length > 0) setMessages(saved);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CHAT_KEY, JSON.stringify(messages)).catch(() => {});
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messages, typing]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: trimmed, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 1200 + Math.random() * 600;
    setTimeout(() => {
      const aiMsg: Message = { id: `a_${Date.now()}`, role: 'assistant', content: getAIResponse(trimmed), time: getTime() };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, delay);
  }, [typing]);

  const isEmpty = messages.length === 1 && messages[0].id === '__welcome__';

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* ── Header ── */}
      <LinearGradient colors={['#020818', '#0055FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerInner}>
          <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>W</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Talk to WeThink</Text>
            <Text style={styles.headerSubtitle}>Book a consultation or ask our AI assistant</Text>
          </View>
          <TouchableOpacity
            onPress={() => { setMessages([WELCOME]); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
            style={styles.clearBtn}
          >
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Booking Card ── */}
      <View style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
        <View style={styles.bookingLeft}>
          <View style={[styles.bookingIconWrap, { backgroundColor: colors.primary + '15' }]}>
            <CalendarIcon color={colors.primary} size={26} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bookingTitle, { color: colors.text }]}>Book a Free 30-Min Call</Text>
            <View style={styles.bookingMeta}>
              <View style={styles.availDot} />
              <Text style={[styles.bookingDesc, { color: colors.textMuted }]}>Available this week · No credit card</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.scheduleBtn, { backgroundColor: colors.primary }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/tools/consultation' as any); }}
          activeOpacity={0.85}
        >
          <Text style={styles.scheduleBtnText}>Schedule Now →</Text>
        </TouchableOpacity>
      </View>

      {/* ── Divider ── */}
      <View style={styles.orDivider}>
        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.orText, { color: colors.textMuted }]}>or chat with our AI</Text>
        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
      </View>

      {/* ── Messages ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {isEmpty && (
          <View style={styles.suggestSection}>
            <Text style={[styles.suggestTitle, { color: colors.textMuted }]}>Try asking:</Text>
            <View style={styles.suggestGrid}>
              {SUGGESTED_PROMPTS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => send(p)}
                  style={[styles.suggestChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.suggestChipText, { color: colors.primary }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map(msg => (
          <Bubble key={msg.id} msg={msg} colors={colors} />
        ))}

        {typing && (
          <View style={[bubbleStyles.row, { marginBottom: 4 }]}>
            <LinearGradient colors={['#0055FF', '#7C3AED']} style={bubbleStyles.avatar}>
              <Text style={bubbleStyles.avatarText}>W</Text>
            </LinearGradient>
            <TypingIndicator colors={colors} />
          </View>
        )}
      </ScrollView>

      {/* ── Input Bar ── */}
      <View style={[styles.inputArea, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about our services or UAE AI..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!input.trim() || typing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={input.trim() && !typing ? ['#0055FF', '#7C3AED'] : [colors.border, colors.borderLight]}
              style={styles.sendBtn}
            >
              <SendIcon color={input.trim() && !typing ? '#fff' : colors.textMuted} size={18} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          WeThink AI · Enterprise AI consulting
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  clearBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  clearBtnText: { fontSize: 12, fontWeight: '600', color: '#fff' },

  // Booking card
  bookingCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
    shadowColor: '#0055FF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bookingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookingIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bookingTitle: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  availDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22C55E' },
  bookingDesc: { fontSize: 12, fontWeight: '500' },
  scheduleBtn: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  scheduleBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  // Or divider
  orDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 24, marginVertical: 12 },
  orLine: { flex: 1, height: 1 },
  orText: { fontSize: 12, fontWeight: '600' },

  // Messages
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 12, gap: 8 },
  suggestSection: { marginBottom: 12 },
  suggestTitle: { fontSize: 12, fontWeight: '600', marginBottom: 10 },
  suggestGrid: { gap: 8 },
  suggestChip: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 22, borderWidth: 1 },
  suggestChipText: { fontSize: 13.5, fontWeight: '600' },

  // Input
  inputArea: { borderTopWidth: 1, paddingHorizontal: 14, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 32 : 14 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 110, borderWidth: 1 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 10.5, textAlign: 'center', marginTop: 7 },
});
