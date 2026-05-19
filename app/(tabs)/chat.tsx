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
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');
const CHAT_KEY = '@wethink_consult_chat_v2';

// ─── Brand Colors ─────────────────────────────────────────────────────────────
const BLUE = '#0055FF';
const PURPLE = '#7C3AED';

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
  content: "Hi! I'm WeThink AI. Ask me about our services, UAE AI market, or how we can help your organization.",
  time: 'Just now',
};

const SUGGESTED_PROMPTS = [
  'What services do you offer?',
  'How much does AI consulting cost?',
  'Do you support Arabic NLP?',
  "What's your typical timeline?",
];

// ─── AI Response Logic ────────────────────────────────────────────────────────

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes('service') || lower.includes('offer') || lower.includes('what do')) {
    return "WeThink offers 4 core services:\n\n1. AI Strategy & Consulting — We build your custom AI roadmap\n2. Custom AI Development — ML, NLP & Computer Vision solutions\n3. Data Engineering — Pipelines, lakes & real-time analytics\n4. AI Integration — Connecting AI to your existing systems\n\nWhich area interests you most?";
  }

  if (lower.includes('cost') || lower.includes('price') || lower.includes('much') || lower.includes('fee')) {
    return "Our engagements are structured as:\n\n• Project-Based: AED 50K–500K\n• Monthly Retainer: AED 30K/month\n• Staff Augmentation: AED 15K/resource/month\n\nBook a free call and we'll give you a custom quote within 24 hours.";
  }

  if (lower.includes('arabic') || lower.includes('nlp') || lower.includes('language')) {
    return "Yes — Arabic NLP is one of our core specialties. We've built Gulf-dialect models for Emirates NBD, Etisalat and others. Our Arabic AI understands MSA, Gulf dialect, and code-switching.";
  }

  if (lower.includes('timeline') || lower.includes('how long') || lower.includes('duration')) {
    return "Typical timelines:\n\n• AI Strategy: 4–6 weeks\n• MVP Development: 8–12 weeks\n• Full Platform: 4–6 months\n\nWe deliver in sprints so you see results early.";
  }

  if (lower.includes('client') || lower.includes('customer') || lower.includes('who') || lower.includes('portfolio')) {
    return "We've worked with UAE's top organizations:\n\n• Emirates NBD — AI Fraud Detection\n• ADNOC — Predictive Maintenance\n• Dubai Municipality — Smart City Dashboard\n• Etisalat — Customer AI (4M users)\n• DEWA — Energy Analytics\n• RTA Dubai — Autonomous Fleet AI";
  }

  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('reach')) {
    return "Reach us at:\n\nEmail: info@wethink.ae\nPhone: 0503125078\nInstagram: @wethink.ae\nLocation: Dubai Internet City, UAE\n\nOr tap 'Schedule Now' above to book a call!";
  }

  return "Great question! Our team of 200+ AI specialists can help. Would you like to book a free 30-minute call with one of our consultants? They can answer this in detail and suggest the best approach for your situation.";
}

function getTime(): string {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function CalendarIcon({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function SendIcon({ color, size = 19 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Animated Waveform ───────────────────────────────────────────────────────

function Waveform() {
  const bars = Array.from({ length: 18 }, (_, i) =>
    useRef(new Animated.Value(0.3)).current
  );

  useEffect(() => {
    bars.forEach((bar, i) => {
      const animate = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: 0.2 + Math.random() * 0.8,
              duration: 250 + Math.random() * 300,
              useNativeDriver: true,
            }),
            Animated.timing(bar, {
              toValue: 0.15 + Math.random() * 0.4,
              duration: 200 + Math.random() * 250,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      setTimeout(animate, i * 60);
    });
  }, []);

  return (
    <View style={styles.waveform}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[
            styles.waveBar,
            {
              transform: [{ scaleY: bar }],
              backgroundColor: i % 3 === 0 ? BLUE : i % 3 === 1 ? PURPLE : '#0EA5E9',
              opacity: 0.7 + (i % 4) * 0.075,
            },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Pulsing Availability Dot ─────────────────────────────────────────────────

function PulsingDot() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.8, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 0.2, duration: 900, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.pulsingDotOuter}>
      <Animated.View
        style={[
          styles.pulsingDotRing,
          { transform: [{ scale: pulseAnim }], opacity: opacityAnim },
        ]}
      />
      <View style={styles.pulsingDotCore} />
    </View>
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
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot, {
            toValue: -7,
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(320),
        ])
      )
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View
      style={[
        typingStyles.bubble,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            typingStyles.dot,
            { backgroundColor: colors.textMuted, transform: [{ translateY: dot }] },
          ]}
        />
      ))}
    </View>
  );
}

const typingStyles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});

// ─── Message Bubble ──────────────────────────────────────────────────────────

function Bubble({ msg, colors }: { msg: Message; colors: any }) {
  const isUser = msg.role === 'user';
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.spring(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
        damping: 16,
        stiffness: 180,
      }),
      Animated.spring(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        damping: 14,
        stiffness: 200,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        bubbleStyles.row,
        isUser && bubbleStyles.rowUser,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      {!isUser && (
        <LinearGradient colors={[BLUE, PURPLE]} style={bubbleStyles.avatar}>
          <Text style={bubbleStyles.avatarText}>W</Text>
        </LinearGradient>
      )}
      <View
        style={[
          bubbleStyles.bubble,
          isUser
            ? { backgroundColor: BLUE }
            : {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              },
          isUser ? bubbleStyles.bubbleUser : bubbleStyles.bubbleAI,
        ]}
      >
        <Text style={[bubbleStyles.text, { color: isUser ? '#fff' : colors.text }]}>
          {msg.content}
        </Text>
        <Text
          style={[
            bubbleStyles.time,
            { color: isUser ? 'rgba(255,255,255,0.55)' : colors.textMuted },
          ]}
        >
          {msg.time}
        </Text>
      </View>
    </Animated.View>
  );
}

const bubbleStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  rowUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 2,
  },
  avatarText: { fontSize: 13, fontWeight: '900', color: '#fff' },
  bubble: {
    maxWidth: W * 0.78,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 9,
  },
  bubbleAI: { borderBottomLeftRadius: 4 },
  bubbleUser: { borderBottomRightRadius: 4 },
  text: { fontSize: 14.5, lineHeight: 22 },
  time: { fontSize: 10, marginTop: 6, textAlign: 'right' },
});

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ colors }: { colors: any }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 110, delay: 200 }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -4, duration: 2200, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bookingCard,
        {
          backgroundColor: colors.surface,
          shadowColor: BLUE,
          opacity,
          transform: [{ scale }, { translateY: floatAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(0,85,255,0.06)', 'rgba(124,58,237,0.04)']}
        style={styles.bookingGradientBg}
      />

      <View style={styles.bookingTopRow}>
        <View style={styles.bookingAvailRow}>
          <PulsingDot />
          <Text style={[styles.bookingAvailText, { color: colors.textSecondary }]}>
            3 slots available this week
          </Text>
        </View>
        <View style={[styles.calIconWrap, { backgroundColor: BLUE + '15' }]}>
          <CalendarIcon color={BLUE} size={22} />
        </View>
      </View>

      <Text style={[styles.bookingTitle, { color: colors.text }]}>
        Book a Free 30-Min Strategy Call
      </Text>

      <View style={styles.bookingAvatarRow}>
        <LinearGradient
          colors={[BLUE, '#0033CC']}
          style={[styles.consultantAvatar, { zIndex: 1 }]}
        >
          <Text style={styles.consultantAvatarText}>RA</Text>
        </LinearGradient>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.bookingAvatarLabel, { color: colors.text, fontWeight: '700', marginBottom: 4 }]}>
            Rasha Aljalam
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={styles.availDot} />
            <Waveform />
            <Text style={[styles.bookingAvatarLabel, { color: '#22c55e' }]}>Available now</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.scheduleBtn}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/tools/consultation' as any);
        }}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={[BLUE, PURPLE]}
          style={styles.scheduleBtnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.scheduleBtnText}>Schedule Now</Text>
          <ChevronRightIcon color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

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
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: trimmed,
      time: getTime(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 1100 + Math.random() * 700;
    setTimeout(() => {
      const aiMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: getAIResponse(trimmed),
        time: getTime(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, delay);
  }, [typing]);

  const isEmpty = messages.length === 1 && messages[0].id === '__welcome__';
  const hasInput = input.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* ── Header ── */}
      <LinearGradient
        colors={['#020818', '#0D1B4B', '#0055FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Svg style={StyleSheet.absoluteFill as any} width={W} height={100} pointerEvents="none">
          <Ellipse cx={W * 0.85} cy={20} rx={70} ry={70} fill="rgba(124,58,237,0.18)" />
          <Ellipse cx={W * 0.1} cy={90} rx={50} ry={50} fill="rgba(14,165,233,0.1)" />
        </Svg>
        <View style={styles.headerInner}>
          <LinearGradient colors={[BLUE, PURPLE]} style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>W</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Talk to WeThink</Text>
            <Text style={styles.headerSubtitle}>Book a call or chat with our AI</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setMessages([WELCOME]);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            style={styles.clearBtn}
          >
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Floating Booking Card ── */}
      <View style={styles.bookingOuter}>
        <BookingCard colors={colors} />
      </View>

      {/* ── OR Divider ── */}
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
                  style={[
                    styles.suggestChip,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.suggestChipText, { color: BLUE }]}>{p}</Text>
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
            <LinearGradient colors={[BLUE, PURPLE]} style={bubbleStyles.avatar}>
              <Text style={bubbleStyles.avatarText}>W</Text>
            </LinearGradient>
            <TypingIndicator colors={colors} />
          </View>
        )}
      </ScrollView>

      {/* ── Input Bar ── */}
      <View
        style={[
          styles.inputArea,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about our services or UAE AI..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!hasInput || typing}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={hasInput && !typing ? [BLUE, PURPLE] : [colors.border, colors.borderLight]}
              style={styles.sendBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <SendIcon color={hasInput && !typing ? '#fff' : colors.textMuted} />
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
    overflow: 'hidden',
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 18, fontWeight: '900', color: '#fff' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  clearBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  clearBtnText: { fontSize: 12, fontWeight: '600', color: '#fff' },

  // Booking card (floating)
  bookingOuter: { marginHorizontal: 16, marginTop: 14, marginBottom: 2 },
  bookingCard: {
    borderRadius: 20,
    padding: 20,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BLUE + '25',
  },
  bookingGradientBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  bookingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingAvailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pulsingDotOuter: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  pulsingDotRing: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E40',
  },
  pulsingDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  bookingAvailText: { fontSize: 12, fontWeight: '600' },
  calIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingTitle: { fontSize: 16, fontWeight: '900', letterSpacing: -0.3, marginBottom: 12 },
  bookingAvatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  consultantAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  consultantAvatarText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  bookingAvatarLabel: { fontSize: 12, fontWeight: '600' },
  availDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22c55e' },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 18 },
  waveBar: { width: 2.5, height: 14, borderRadius: 2 },
  scheduleBtn: { borderRadius: 14, overflow: 'hidden' },
  scheduleBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 20,
  },
  scheduleBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  // Divider
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 24,
    marginVertical: 12,
  },
  orLine: { flex: 1, height: 1 },
  orText: { fontSize: 12, fontWeight: '600' },

  // Messages
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 80, gap: 8 },
  suggestSection: { marginBottom: 14 },
  suggestTitle: { fontSize: 12, fontWeight: '600', marginBottom: 10 },
  suggestGrid: { gap: 8 },
  suggestChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  suggestChipText: { fontSize: 13.5, fontWeight: '600' },

  // Input
  inputArea: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 15,
    maxHeight: 110,
    borderWidth: 1,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { fontSize: 10.5, textAlign: 'center', marginTop: 7 },
});
