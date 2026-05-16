import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Animated, Easing, FlatList, KeyboardAvoidingView, StyleSheet,
  View, Text, TextInput, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

interface Message { id: string; text: string; from: 'user' | 'agent'; ts: string; }

const REPLIES = [
  "Hi! I'm Sarah from WeThink support. How can I assist you today?",
  "I'll connect you with the right team member for your query.",
  "Our support team is available 24/7. You can also reach us at support@wethink.ae",
  "I can see your account details. Let me check on that for you.",
  "That's a great question! I'll escalate this to our technical team and get back to you within 2 hours.",
  "Is there anything else I can help you with today?",
  "Thank you for reaching out to WeThink. Your satisfaction is our priority!",
];

let replyIndex = 0;

export default function LiveChatScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: "Hi! I'm Sarah from WeThink support. How can I help you today? 😊", from: 'agent', ts: 'Now' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const animateDots = useCallback(() => {
    const bounce = (val: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(val, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(val, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      ]));
    Animated.parallel([bounce(dot1, 0), bounce(dot2, 200), bounce(dot3, 400)]).start();
  }, []);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: String(Date.now()), text, from: 'user', ts: now }]);
    setInput('');
    setTyping(true);
    animateDots();
    setTimeout(() => {
      setTyping(false);
      const reply = REPLIES[replyIndex % REPLIES.length];
      replyIndex++;
      setMessages(prev => [...prev, { id: String(Date.now() + 1), text: reply, from: 'agent', ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 2000);
  }, [input]);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, typing]);

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.from === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.agentAvatar}>
            <Text style={styles.agentAvatarText}>S</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : [styles.bubbleAgent, { backgroundColor: colors.surface }]]}>
          <Text style={[styles.bubbleText, { color: isUser ? '#fff' : colors.text }]}>{item.text}</Text>
          <Text style={[styles.bubbleTs, { color: isUser ? 'rgba(255,255,255,0.6)' : colors.textMuted }]}>{item.ts}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#0EA5E9', '#059669']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.agentInfo}>
          <View style={[styles.agentAvatar, styles.headerAvatar]}>
            <Text style={styles.agentAvatarText}>S</Text>
          </View>
          <View>
            <Text style={styles.agentName}>Sarah — Support</Text>
            <Text style={styles.agentStatus}>🟢 Online · Typically replies in &lt;2 min</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={typing ? (
          <View style={styles.msgRow}>
            <View style={styles.agentAvatar}><Text style={styles.agentAvatarText}>S</Text></View>
            <View style={[styles.bubble, styles.bubbleAgent, styles.typingBubble, { backgroundColor: colors.surface }]}>
              {[dot1, dot2, dot3].map((d, i) => (
                <Animated.View key={i} style={[styles.typingDot, { backgroundColor: colors.textMuted, opacity: d }]} />
              ))}
            </View>
          </View>
        ) : null}
      />

      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={send}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity onPress={send} disabled={!input.trim()} style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.4 }]}>
          <LinearGradient colors={['#0EA5E9', '#059669']} style={styles.sendBtnGrad}>
            <Text style={styles.sendBtnText}>↑</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingHorizontal: 20, paddingBottom: 16 },
  back: { marginBottom: 10 },
  backText: { color: '#fff', fontSize: 22 },
  agentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: { width: 44, height: 44 },
  agentAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' },
  agentAvatarText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  agentName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  agentStatus: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  list: { padding: 16, gap: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12, gap: 4 },
  bubbleUser: { backgroundColor: '#0055FF', borderBottomRightRadius: 4 },
  bubbleAgent: { borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTs: { fontSize: 11, alignSelf: 'flex-end' },
  typingBubble: { flexDirection: 'row', gap: 6, paddingVertical: 14, paddingHorizontal: 16 },
  typingDot: { width: 8, height: 8, borderRadius: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1, paddingBottom: Platform.OS === 'ios' ? 28 : 12 },
  input: { flex: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendBtn: {},
  sendBtnGrad: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
