import React, { useState, useCallback, useRef } from 'react';
import {
  Animated, Easing, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Switch, Platform, Clipboard,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const CHARSET = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generate(length: number, opts: Record<string, boolean>) {
  let pool = '';
  if (opts.upper) pool += CHARSET.upper;
  if (opts.lower) pool += CHARSET.lower;
  if (opts.numbers) pool += CHARSET.numbers;
  if (opts.symbols) pool += CHARSET.symbols;
  if (!pool) pool = CHARSET.lower;
  let pwd = '';
  for (let i = 0; i < length; i++) pwd += pool[Math.floor(Math.random() * pool.length)];
  return pwd;
}

function strength(pwd: string) {
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 20) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 1) return { label: 'Weak', color: '#DC2626', pct: 20 };
  if (score === 2) return { label: 'Fair', color: '#D97706', pct: 45 };
  if (score === 3) return { label: 'Good', color: '#0EA5E9', pct: 65 };
  if (score === 4) return { label: 'Strong', color: '#059669', pct: 85 };
  return { label: 'Very Strong', color: '#059669', pct: 100 };
}

export default function PasswordGenScreen() {
  const { colors } = useTheme();
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false });
  const [password, setPassword] = useState(() => generate(16, { upper: true, lower: true, numbers: true, symbols: false }));
  const [copied, setCopied] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const copyScale = useRef(new Animated.Value(1)).current;

  const regen = useCallback((len = length, o = opts) => {
    const pwd = generate(len, o);
    setPassword(pwd);
    setCopied(false);
    const s = strength(pwd);
    barAnim.setValue(0);
    Animated.timing(barAnim, { toValue: s.pct, duration: 500, useNativeDriver: false, easing: Easing.out(Easing.cubic) }).start();
    Animated.sequence([
      Animated.timing(spinAnim, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(spinAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [length, opts]);

  const toggleOpt = (key: string) => {
    const next = { ...opts, [key]: !opts[key as keyof typeof opts] };
    setOpts(next);
    regen(length, next);
  };

  const changeLength = (delta: number) => {
    const next = Math.min(32, Math.max(8, length + delta));
    setLength(next);
    regen(next, opts);
  };

  const copy = () => {
    Clipboard.setString(password);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.timing(copyScale, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.spring(copyScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
    setTimeout(() => setCopied(false), 2000);
  };

  const s = strength(password);
  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const barWidth = barAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#059669', '#0EA5E9']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Password Generator</Text>
        <Text style={styles.headerSub}>Create secure passwords instantly</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Password display */}
        <View style={[styles.pwdBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.pwdText, { color: colors.text }]} numberOfLines={2} selectable>{password}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale: copyScale }] }}>
            <TouchableOpacity onPress={copy} style={[styles.actionBtn, { backgroundColor: copied ? '#059669' : colors.primary }]}>
              <Text style={styles.actionBtnText}>{copied ? '✓ Copied!' : '📋 Copy'}</Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity onPress={() => regen()} style={[styles.actionBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
            <Animated.Text style={[styles.actionBtnText, { color: colors.text, transform: [{ rotate: spin }] }]}>↻</Animated.Text>
            <Text style={[styles.actionBtnText, { color: colors.text }]}> Regenerate</Text>
          </TouchableOpacity>
        </View>

        {/* Strength */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.strengthRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Strength</Text>
            <Text style={[styles.strengthLabel, { color: s.color }]}>{s.label}</Text>
          </View>
          <View style={[styles.barTrack, { backgroundColor: colors.borderLight }]}>
            <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: s.color }]} />
          </View>
        </View>

        {/* Length */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Length</Text>
          <View style={styles.lengthRow}>
            <TouchableOpacity onPress={() => changeLength(-1)} style={[styles.stepBtn, { backgroundColor: colors.borderLight }]}>
              <Text style={[styles.stepBtnText, { color: colors.text }]}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.lengthVal, { color: colors.primary }]}>{length}</Text>
            <TouchableOpacity onPress={() => changeLength(1)} style={[styles.stepBtn, { backgroundColor: colors.borderLight }]}>
              <Text style={[styles.stepBtnText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lengthPresets}>
            {[8, 12, 16, 24, 32].map(l => (
              <TouchableOpacity key={l} onPress={() => { setLength(l); regen(l, opts); }}
                style={[styles.presetBtn, { backgroundColor: length === l ? colors.primary : colors.borderLight }]}>
                <Text style={[styles.presetText, { color: length === l ? '#fff' : colors.textSecondary }]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Character types */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Character Types</Text>
          {([['upper', 'Uppercase (A-Z)'], ['lower', 'Lowercase (a-z)'], ['numbers', 'Numbers (0-9)'], ['symbols', 'Symbols (!@#$)']] as [string, string][]).map(([key, label]) => (
            <View key={key} style={[styles.toggleRow, { borderBottomColor: colors.borderLight }]}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>{label}</Text>
              <Switch
                value={opts[key as keyof typeof opts]}
                onValueChange={() => toggleOpt(key)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingHorizontal: 20, paddingBottom: 28 },
  back: { marginBottom: 12 },
  backText: { color: '#fff', fontSize: 22 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  scroll: { padding: 20, gap: 14 },
  pwdBox: { borderRadius: 16, borderWidth: 1.5, padding: 20 },
  pwdText: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 18, letterSpacing: 1, lineHeight: 26 },
  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 13, borderRadius: 14, gap: 4 },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  card: { borderRadius: 16, padding: 16, gap: 12 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  strengthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  strengthLabel: { fontSize: 14, fontWeight: '700' },
  barTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  lengthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  stepBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 22, fontWeight: '300' },
  lengthVal: { fontSize: 36, fontWeight: '800', minWidth: 60, textAlign: 'center' },
  lengthPresets: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  presetBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  presetText: { fontSize: 13, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  toggleLabel: { fontSize: 15 },
});
