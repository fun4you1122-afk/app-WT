import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');
const CHAT_KEY = '@wethink_chat_history';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const WELCOME: Message = {
  id: '__welcome__',
  role: 'assistant',
  content:
    "Hello! I'm WeThink AI 👋\n\nI'm your intelligent discussion companion. I can help you brainstorm ideas, summarize debates, analyze arguments, suggest discussion topics, and provide balanced perspectives on any subject.\n\nWhat would you like to explore today?",
  time: 'Just now',
};

const SUGGESTED_PROMPTS = [
  'Summarize today\'s top debate',
  'Help me write a discussion post',
  'What are two sides of [topic]?',
];

function getTime(): string {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();

  if (
    lower.includes('brainstorm') ||
    lower.includes('idea') ||
    lower.includes('topic')
  ) {
    return "Here are 5 discussion topic ideas:\n\n1. 🤖 Should AI systems have legal rights?\n2. 🌍 Is remote work better for the environment?\n3. 🎓 Will university degrees be obsolete by 2035?\n4. 💰 Should there be a global minimum wage?\n5. 🏙️ Are megacities sustainable long-term?\n\nWould you like me to expand on any of these?";
  }

  if (
    lower.includes('summarize') ||
    lower.includes('debate') ||
    lower.includes('top')
  ) {
    return "Here's a summary of today's top debates:\n\n🔥 **AI in Schools** — 67% support mandatory AI literacy\n💼 **Remote vs Office** — Employers and employees still divided\n🚗 **Autonomous Vehicles** — Safety vs job displacement debate\n🌱 **Carbon Tax** — Economic impact being hotly contested\n\nWant a deep dive into any topic?";
  }

  if (
    lower.includes('write') ||
    lower.includes('post') ||
    lower.includes('discussion')
  ) {
    return "I'd love to help you write a compelling discussion post! Here's a template:\n\n**Hook:** Start with a surprising statistic or bold claim\n**Context:** 2-3 sentences of background\n**Your stance:** Be clear but invite debate\n**Question:** End with an open question for readers\n\nShare your topic and I'll draft a full post for you!";
  }

  if (
    lower.includes('sides') ||
    lower.includes('perspective') ||
    lower.includes('argument') ||
    lower.includes('balance')
  ) {
    return "I'll give you balanced perspectives:\n\n✅ **In favor:**\n• Drives innovation and efficiency\n• Creates new economic opportunities\n• Enables solutions to global problems\n\n❌ **Against:**\n• Risk of inequality and job displacement\n• Privacy and security concerns\n• Loss of human connection\n\nThe truth usually lies somewhere in between. What specific topic would you like analyzed?";
  }

  return "That's a great point to explore! As a discussion platform AI, I'm here to help you think through multiple perspectives.\n\nI can help you:\n• 💡 Brainstorm discussion topics\n• ✍️ Write compelling posts\n• ⚖️ Analyze both sides of any debate\n• 📊 Summarize ongoing discussions\n\nWhat would you like to explore?";
}

// ─── Typing indicator ────────────────────────────────────────────────────────

function TypingIndicator({ colors }: { colors: ReturnType<typeof useTheme>['colors'] }) {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, {
            toValue: -6,
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
          Animated.delay(300),
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
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});

// ─── Message bubble ──────────────────────────────────────────────────────────

function Bubble({
  msg,
  colors,
}: {
  msg: Message;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const isUser = msg.role === 'user';
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        bubbleStyles.row,
        isUser && bubbleStyles.rowUser,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {!isUser && (
        <LinearGradient
          colors={['#0055FF', '#7C3AED']}
          style={bubbleStyles.avatar}
        >
          <Text style={bubbleStyles.avatarText}>W</Text>
        </LinearGradient>
      )}
      <View
        style={[
          bubbleStyles.bubble,
          isUser
            ? { backgroundColor: colors.accent }
            : {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: colors.shadow,
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              },
          isUser ? bubbleStyles.bubbleUser : bubbleStyles.bubbleAI,
        ]}
      >
        <Text
          style={[
            bubbleStyles.text,
            { color: isUser ? '#FFFFFF' : colors.text },
          ]}
        >
          {msg.content}
        </Text>
        <Text
          style={[
            bubbleStyles.time,
            { color: isUser ? 'rgba(255,255,255,0.65)' : colors.textMuted },
          ]}
        >
          {msg.time}
        </Text>
      </View>
    </Animated.View>
  );
}

const bubbleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 4,
  },
  rowUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 2,
  },
  avatarText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  bubble: {
    maxWidth: W * 0.72,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  bubbleAI: { borderBottomLeftRadius: 4 },
  bubbleUser: { borderBottomRightRadius: 4 },
  text: { fontSize: 14.5, lineHeight: 22 },
  time: { fontSize: 10, marginTop: 6, textAlign: 'right' },
});

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Load persisted history
  useEffect(() => {
    AsyncStorage.getItem(CHAT_KEY)
      .then(raw => {
        if (raw) {
          const saved: Message[] = JSON.parse(raw);
          if (saved.length > 0) setMessages(saved);
        }
      })
      .catch(() => {});
  }, []);

  // Persist after every change
  useEffect(() => {
    AsyncStorage.setItem(CHAT_KEY, JSON.stringify(messages)).catch(() => {});
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messages, typing]);

  const send = useCallback(
    (text: string) => {
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

      const delay = 1200 + Math.random() * 600;
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
    },
    [typing]
  );

  const isEmpty = messages.length === 1 && messages[0].id === '__welcome__';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <LinearGradient
          colors={['#0055FF', '#7C3AED']}
          style={styles.headerAvatar}
        >
          <Text style={styles.headerAvatarText}>W</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerName, { color: colors.text }]}>WeThink AI</Text>
          <View style={styles.headerStatus}>
            <View style={styles.statusDot} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              Active
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setMessages([WELCOME]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          style={[styles.clearBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
        >
          <Text style={[styles.clearBtnText, { color: colors.textSecondary }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {/* Suggested prompts (empty state) */}
        {isEmpty && (
          <View style={styles.suggestSection}>
            <Text style={[styles.suggestTitle, { color: colors.textMuted }]}>
              Try one of these:
            </Text>
            <View style={styles.suggestRow}>
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
                  <Text style={[styles.suggestChipText, { color: colors.primary }]}>
                    {p}
                  </Text>
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
            <LinearGradient
              colors={['#0055FF', '#7C3AED']}
              style={bubbleStyles.avatar}
            >
              <Text style={bubbleStyles.avatarText}>W</Text>
            </LinearGradient>
            <TypingIndicator colors={colors} />
          </View>
        )}
      </ScrollView>

      {/* Input bar */}
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
            placeholder="Ask WeThink AI anything..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          {/* Mic placeholder */}
          <TouchableOpacity
            style={[styles.micBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Text style={{ fontSize: 18 }}>🎤</Text>
          </TouchableOpacity>
          {/* Send button */}
          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!input.trim() || typing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                input.trim() && !typing
                  ? [colors.primary, colors.accent]
                  : [colors.border, colors.borderLight]
              }
              style={styles.sendBtn}
            >
              <Text
                style={[
                  styles.sendIcon,
                  { color: input.trim() && !typing ? '#FFFFFF' : colors.textMuted },
                ]}
              >
                ↑
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          WeThink AI · Balanced perspectives on every discussion
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  headerName: { fontSize: 16, fontWeight: '700' },
  headerStatus: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22C55E' },
  statusText: { fontSize: 12, fontWeight: '500' },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  clearBtnText: { fontSize: 12, fontWeight: '500' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 12, gap: 8 },
  suggestSection: { marginBottom: 12 },
  suggestTitle: { fontSize: 12, fontWeight: '500', marginBottom: 10 },
  suggestRow: { gap: 8 },
  suggestChip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    borderWidth: 1,
  },
  suggestChipText: { fontSize: 13.5, fontWeight: '500' },
  inputArea: {
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 14,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 110,
    borderWidth: 1,
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { fontSize: 20, fontWeight: '700', marginTop: -1 },
  hint: { fontSize: 10.5, textAlign: 'center', marginTop: 7 },
});
