import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const AI_RESPONSES = [
  "WeThink AI has helped over 180 enterprise clients across the UAE achieve measurable ROI within 90 days of deployment.",
  "Our fraud detection system achieves 94% accuracy in real-time, processing millions of transactions daily.",
  "We specialize in Machine Learning, Cloud Services, Cybersecurity, and Digital Transformation for Gulf enterprises.",
  "Book a free consultation at wethink.ae to discuss your AI roadmap with our expert team.",
  "Our AI Suite Enterprise Edition starts at AED 45,000/month and includes unlimited model training and 24/7 support.",
  "The UAE AI Strategy 2031 positions the country as a global AI hub — we help businesses align with this vision.",
  "Our average project delivery time is 12 weeks from kick-off to production deployment.",
  "We have partnerships with Microsoft Azure, AWS, and Google Cloud for scalable AI infrastructure.",
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

function TypingIndicator({ colors }: { colors: any }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={[styles.bubble, styles.aiBubble, { backgroundColor: colors.surface }]}>
      <View style={styles.typingRow}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.typingDot, { backgroundColor: colors.textMuted, transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  );
}

export default function AiChatScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: "Hello! I'm the WeThink AI assistant. How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const responseIndex = useRef(0);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: Message = { id: Date.now().toString(), text, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = AI_RESPONSES[responseIndex.current % AI_RESPONSES.length];
      responseIndex.current += 1;
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: reply, isUser: false }]);
    }, 1500);
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#7C3AED', '#A855F7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>🤖</Text>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSub}>WeThink AI • Online</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[styles.messageRow, msg.isUser ? styles.userRow : styles.aiRow]}
            >
              {!msg.isUser && (
                <View style={[styles.aiAvatar, { backgroundColor: '#7C3AED' }]}>
                  <Text style={styles.aiAvatarText}>W</Text>
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.isUser
                    ? [styles.userBubble, { backgroundColor: '#0055FF' }]
                    : [styles.aiBubble, { backgroundColor: colors.surface }],
                ]}
              >
                <Text style={[styles.bubbleText, { color: msg.isUser ? '#FFFFFF' : colors.text }]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={[styles.messageRow, styles.aiRow]}>
              <View style={[styles.aiAvatar, { backgroundColor: '#7C3AED' }]}>
                <Text style={styles.aiAvatarText}>W</Text>
              </View>
              <TypingIndicator colors={colors} />
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Ask WeThink AI..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: '#7C3AED', opacity: input.trim() ? 1 : 0.5 }]}
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <Text style={styles.sendText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    gap: 12,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerEmoji: { fontSize: 28 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  messagesContent: { padding: 16, gap: 12, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  aiAvatarText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12 },
  userBubble: { borderBottomRightRadius: 4 },
  aiBubble: { borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  typingRow: { flexDirection: 'row', gap: 4, paddingVertical: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
