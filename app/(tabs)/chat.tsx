import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const INITIAL: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm WeThink AI 👋\n\nI can help you explore our services, review case studies, schedule consultations, or answer questions about digital transformation. How can I assist you today?",
    time: 'Just now',
  },
];

const QUICK_PROMPTS = ['🧠 AI services', '📊 Case studies', '💰 Pricing info', '📅 Book a demo', '🌍 Locations', '🤝 Partnerships'];

const AI_RESPONSES: Record<string, string> = {
  default: "Great question! WeThink specializes in enterprise AI and digital transformation across the UAE and GCC region.\n\nOur core expertise:\n• Custom AI & ML solutions\n• Cloud architecture (AWS/Azure/GCP)\n• Cybersecurity & compliance\n• Digital transformation consulting\n\nWould you like to explore any of these areas?",
  services: "We offer a comprehensive enterprise suite:\n\n🧠 AI & Machine Learning\nCustom models, NLP, computer vision — from AED 15,000\n\n☁️ Cloud Architecture\nAWS, Azure, GCP migrations — from AED 8,000\n\n🛡️ Cybersecurity\nZero-trust, SOC, pen testing — from AED 12,000\n\n🚀 Digital Transformation\nEnd-to-end digitization — from AED 20,000\n\nShall I schedule a free consultation?",
  projects: "Our recent flagship projects:\n\n✅ Emirates NBD — AI Fraud Detection\n94% accuracy · $2.4B protected daily\n\n✅ Dubai Municipality — Smart City\n2,000+ IoT sensors · 40% efficiency gain\n\n🔄 ADNOC — Predictive Maintenance\n78% downtime reduction · AED 180M saved/yr\n\nWant a detailed case study for any project?",
  pricing: "Our pricing by project scope:\n\n📦 Starter — AED 5,000–15,000\nSME solutions, single service\n\n📦 Professional — AED 15,000–50,000\nMulti-service, dedicated team\n\n📦 Enterprise — AED 50,000+\nFull transformation, 24/7 SLA support\n\nAll packages include discovery workshop, dedicated PM, and training.\n\nReady for a free consultation?",
  demo: "I'd love to arrange a demo for you!\n\n📅 Available this week:\n• Tuesday 10:00 AM\n• Wednesday 2:00 PM\n• Thursday 11:00 AM\n\n📍 Location options:\n• DIFC Office (Gate Building)\n• Virtual via Zoom/Teams\n• Your office (UAE only)\n\nOur demo includes a live AI showcase tailored to your industry. Which time works best?",
};

function getResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('service') || lower.includes('offer') || lower.includes('ai')) return AI_RESPONSES.services;
  if (lower.includes('project') || lower.includes('case') || lower.includes('portfolio')) return AI_RESPONSES.projects;
  if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) return AI_RESPONSES.pricing;
  if (lower.includes('demo') || lower.includes('book') || lower.includes('schedule')) return AI_RESPONSES.demo;
  return AI_RESPONSES.default;
}

function getTime() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function TypingIndicator() {
  const d0 = useRef(new Animated.Value(0)).current;
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = (val: Animated.Value, delay: number) =>
      Animated.sequence([
        Animated.delay(delay),
        Animated.loop(Animated.sequence([
          Animated.timing(val, { toValue: -5, duration: 280, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 280, useNativeDriver: true }),
        ])),
      ]).start();
    anim(d0, 0);
    anim(d1, 140);
    anim(d2, 280);
  }, []);
  return (
    <View style={styles.typingBubble}>
      {[d0, d1, d2].map((d, i) => (
        <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: d }] }]} />
      ))}
    </View>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[styles.msgRow, isUser && styles.msgRowUser, { opacity, transform: [{ translateY }] }]}>
      {!isUser && (
        <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>W</Text>
        </LinearGradient>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{msg.content}</Text>
        <Text style={[styles.bubbleTime, isUser && { color: 'rgba(255,255,255,0.6)' }]}>{msg.time}</Text>
      </View>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: getResponse(text), time: getTime() };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 1400);
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, typing]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
      <View style={styles.header}>
        <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>W</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>WeThink AI</Text>
          <View style={styles.headerStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active · Powered by WeThink Intelligence</Text>
          </View>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
        {messages.length <= 1 && (
          <View style={styles.quickSection}>
            <Text style={styles.quickTitle}>Try asking about:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
              {QUICK_PROMPTS.map((p, i) => (
                <TouchableOpacity key={i} style={styles.quickChip} onPress={() => send(p)}>
                  <Text style={styles.quickChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        {typing && (
          <View style={styles.msgRow}>
            <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.aiAvatar}>
              <Text style={styles.aiAvatarText}>W</Text>
            </LinearGradient>
            <TypingIndicator />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask WeThink AI anything..."
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={500}
          />
          <TouchableOpacity onPress={() => send(input)} disabled={!input.trim()}>
            <LinearGradient colors={input.trim() ? ['#0055FF', '#003ECC'] : ['#E2E8F0', '#E2E8F0']} style={styles.sendBtn}>
              <Text style={[styles.sendIcon, { color: input.trim() ? '#FFFFFF' : '#94A3B8' }]}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>WeThink AI may make mistakes. Verify important information.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: 12, gap: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  headerName: { fontSize: 16, fontWeight: '700', color: '#0A1628' },
  headerStatus: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#059669' },
  statusText: { fontSize: 11, color: '#475569' },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 12, paddingBottom: 8 },
  quickSection: { marginBottom: 8 },
  quickTitle: { fontSize: 12, color: '#94A3B8', fontWeight: '500', marginBottom: 8 },
  quickChip: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  quickChipText: { fontSize: 13, color: '#0055FF', fontWeight: '500' },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aiAvatarText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  bubble: { maxWidth: W * 0.72, borderRadius: 18, padding: 12 },
  bubbleAI: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, shadowColor: '#0A1628', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  bubbleUser: { backgroundColor: '#0055FF', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, color: '#0A1628', lineHeight: 21 },
  bubbleTextUser: { color: '#FFFFFF' },
  bubbleTime: { fontSize: 10, color: '#94A3B8', marginTop: 4, textAlign: 'right' },
  typingBubble: { backgroundColor: '#FFFFFF', borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', gap: 4, alignItems: 'center', shadowColor: '#0A1628', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#94A3B8' },
  inputArea: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingHorizontal: 16, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 30 : 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  input: { flex: 1, backgroundColor: '#F4F6FF', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: '#0A1628', maxHeight: 100, borderWidth: 1, borderColor: '#E2E8F0' },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 18, fontWeight: '700' },
  hint: { fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 6 },
});
