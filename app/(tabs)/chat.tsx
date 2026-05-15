import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView, StyleSheet, View, Text, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path } from 'react-native-svg';
import AnimatedBackground from '../../components/AnimatedBackground';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing, Radius } from '../../constants/Theme';

const { width: W } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm WeThink AI, your intelligent business assistant. I'm here to help you with insights about our services, projects, analytics, and anything related to your digital transformation journey. How can I assist you today?",
    timestamp: 'Just now',
  },
];

const QUICK_PROMPTS = [
  'What AI services do you offer?',
  'Show me recent projects',
  'Explain your cloud solutions',
  'How can AI benefit my business?',
];

const AI_RESPONSES: Record<string, string> = {
  default: "That's a great question! WeThink specializes in delivering cutting-edge AI and technology solutions across the UAE. Our expertise spans machine learning, cloud architecture, cybersecurity, and digital transformation. Would you like me to elaborate on any specific area?",
  ai: "WeThink offers a comprehensive suite of AI services including: custom ML model development, natural language processing, computer vision solutions, predictive analytics platforms, and AI-powered automation systems. Our AI Suite 2025 is our flagship enterprise offering. Shall I schedule a consultation?",
  cloud: "Our Cloud Architecture services cover AWS, Azure, and Google Cloud deployments. We specialize in: zero-downtime migrations, Kubernetes orchestration, serverless architectures, and multi-cloud strategies. We've successfully migrated 100+ enterprise systems to the cloud.",
  project: "Our recent highlights include the Emirates NBD Fraud Detection Platform (94% fraud reduction), Dubai Smart City Command Center (2,000+ IoT sensors), and ADNOC Predictive Maintenance System (78% downtime reduction). Want details on any project?",
  business: "AI can transform your business through: automated decision-making (10x faster), predictive analytics (forecast trends 6+ months ahead), intelligent automation (reduce costs by 40-60%), and personalized customer experiences (30%+ revenue lift). Let's discuss your specific needs!",
};

function AIAvatar() {
  const pulse = useSharedValue(1);
  const ring = useSharedValue(0.8);
  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1.1, { duration: 1500 }), withTiming(1, { duration: 1500 })), -1, true);
    ring.value = withRepeat(withSequence(withTiming(1.2, { duration: 2000 }), withTiming(0.9, { duration: 2000 })), -1, true);
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: ring.value }], opacity: 2 - ring.value }));
  return (
    <View style={styles.avatarContainer}>
      <Animated.View style={[styles.avatarRing, ringStyle]} />
      <Animated.View style={[styles.avatarCore, pulseStyle]}>
        <LinearGradient colors={[Colors.neonBlue, Colors.electricBlue]} style={styles.avatarGrad}>
          <Text style={styles.avatarIcon}>🤖</Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

function TypingIndicator() {
  const dots = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];
  useEffect(() => {
    dots.forEach((d, i) => {
      d.value = withDelay(i * 200, withRepeat(withSequence(withTiming(-6, { duration: 400 }), withTiming(0, { duration: 400 })), -1, false));
    });
  }, []);
  return (
    <View style={styles.typingRow}>
      {dots.map((d, i) => {
        const style = useAnimatedStyle(() => ({ transform: [{ translateY: d.value }] }));
        return <Animated.View key={i} style={[styles.typingDot, style]} />;
      })}
    </View>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow, style]}>
      {!isUser && (
        <View style={styles.msgAvatar}>
          <LinearGradient colors={[Colors.neonBlue, Colors.electricBlue]} style={styles.msgAvatarGrad}>
            <Text style={{ fontSize: 12 }}>W</Text>
          </LinearGradient>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && <View style={styles.bubbleTopBorder} />}
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>{message.content}</Text>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>
      {isUser && (
        <View style={styles.msgAvatar}>
          <LinearGradient colors={[Colors.neonPurple, Colors.neonPink]} style={styles.msgAvatarGrad}>
            <Text style={{ fontSize: 12 }}>U</Text>
          </LinearGradient>
        </View>
      )}
    </Animated.View>
  );
}

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine')) return AI_RESPONSES.ai;
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure')) return AI_RESPONSES.cloud;
  if (lower.includes('project') || lower.includes('client') || lower.includes('portfolio')) return AI_RESPONSES.project;
  if (lower.includes('business') || lower.includes('benefit') || lower.includes('roi')) return AI_RESPONSES.business;
  return AI_RESPONSES.default;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = (text: string = input) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: getResponse(text), timestamp: 'Just now' };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AnimatedBackground />

      {/* Header */}
      <View style={styles.header}>
        <AIAvatar />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>WeThink <Text style={{ color: Colors.neonBlue }}>AI</Text></Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Active • Powered by WeThink Intelligence</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Text style={styles.headerActionText}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        {isTyping && (
          <View style={[styles.messageRow, styles.aiRow]}>
            <View style={styles.msgAvatar}>
              <LinearGradient colors={[Colors.neonBlue, Colors.electricBlue]} style={styles.msgAvatarGrad}>
                <Text style={{ fontSize: 12 }}>W</Text>
              </LinearGradient>
            </View>
            <View style={[styles.bubble, styles.aiBubble]}>
              <TypingIndicator />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPrompts} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {QUICK_PROMPTS.map((p, i) => (
          <TouchableOpacity key={i} style={styles.quickBtn} onPress={() => sendMessage(p)}>
            <Text style={styles.quickText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <BlurView intensity={30} tint="dark" style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask WeThink AI anything..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity onPress={() => sendMessage()} style={styles.sendBtn} disabled={!input.trim()}>
            <LinearGradient
              colors={input.trim() ? [Colors.neonBlue, Colors.electricBlue] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.sendGrad}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  avatarContainer: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  avatarRing: { position: 'absolute', width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: `${Colors.neonBlue}40` },
  avatarCore: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden' },
  avatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarIcon: { fontSize: 22 },
  headerInfo: { flex: 1 },
  headerTitle: { ...Typography.headingMD, color: Colors.white, fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  onlineText: { ...Typography.caption, color: Colors.textMuted },
  headerAction: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerActionText: { fontSize: 20, color: Colors.textMuted },
  messages: { flex: 1 },
  messagesContent: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: 16 },
  messageRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  msgAvatar: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden' },
  msgAvatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: W * 0.72, borderRadius: Radius.xl, padding: Spacing.md, overflow: 'hidden' },
  userBubble: { backgroundColor: `${Colors.electricBlue}CC`, borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 },
  bubbleTopBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: `${Colors.neonBlue}30` },
  bubbleText: { ...Typography.bodyMD, lineHeight: 22 },
  userText: { color: Colors.white },
  aiText: { color: Colors.textSecondary },
  timestamp: { ...Typography.caption, color: 'rgba(255,255,255,0.3)', marginTop: 6 },
  typingRow: { flexDirection: 'row', gap: 4, alignItems: 'flex-end', padding: 4 },
  typingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.neonBlue, opacity: 0.8 },
  quickPrompts: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)' },
  quickBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,212,255,0.08)',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: `${Colors.neonBlue}25`,
  },
  quickText: { ...Typography.bodySM, color: Colors.neonBlue },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, padding: Spacing.md },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    color: Colors.textPrimary,
    maxHeight: 120,
    ...Typography.bodyMD,
  },
  sendBtn: {},
  sendGrad: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neonBlue,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  sendIcon: { fontSize: 20, color: Colors.white, fontWeight: '700' },
});
