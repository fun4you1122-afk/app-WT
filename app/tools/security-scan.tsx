import React, { useState, useRef, useCallback } from 'react';
import {
  Animated, Easing, ScrollView, StyleSheet, View, Text,
  TextInput, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Circle } from 'react-native-svg';

const CHECKS = [
  { label: 'SSL Certificate', result: 'Valid · Expires Jan 2026', status: 'pass' },
  { label: 'HTTP Security Headers', result: 'Missing X-Frame-Options', status: 'warn' },
  { label: 'DNS Security (DNSSEC)', result: 'Enabled and verified', status: 'pass' },
  { label: 'Open Ports Scan', result: 'Only 80, 443 open', status: 'pass' },
  { label: 'Malware Database', result: 'No threats detected', status: 'pass' },
];

const SCORE = 82;
const GAUGE_R = 60;
const CX = 80;
const CY = 80;
const CIRC = 2 * Math.PI * GAUGE_R;

export default function SecurityScanScreen() {
  const { colors } = useTheme();
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const slideAnims = useRef(CHECKS.map(() => new Animated.Value(-60))).current;
  const fadeAnims = useRef(CHECKS.map(() => new Animated.Value(0))).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  const startScan = useCallback(() => {
    if (scanning || !url.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScanning(true);
    setRevealed([]);
    setDone(false);
    scoreAnim.setValue(0);
    slideAnims.forEach(a => a.setValue(-60));
    fadeAnims.forEach(a => a.setValue(0));

    CHECKS.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => [...prev, i]);
        Animated.parallel([
          Animated.timing(slideAnims[i], { toValue: 0, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
          Animated.timing(fadeAnims[i], { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (i === CHECKS.length - 1) {
          setScanning(false);
          setDone(true);
          Animated.timing(scoreAnim, { toValue: SCORE, duration: 1200, useNativeDriver: false, easing: Easing.out(Easing.cubic) }).start();
        }
      }, 700 + i * 700);
    });
  }, [scanning, url]);

  const scoreStroke = scoreAnim.interpolate({ inputRange: [0, 100], outputRange: [CIRC, CIRC * (1 - SCORE / 100)] });
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#DC2626', '#7C3AED']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Scanner</Text>
        <Text style={styles.headerSub}>Check your website's security posture</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* URL input */}
        <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.prefix, { color: colors.textMuted }]}>https://</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={url}
            onChangeText={setUrl}
            placeholder="yourwebsite.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>

        <TouchableOpacity onPress={startScan} disabled={scanning || !url.trim()} style={{ opacity: scanning || !url.trim() ? 0.5 : 1 }}>
          <LinearGradient colors={['#DC2626', '#7C3AED']} style={styles.scanBtn}>
            <Text style={styles.scanBtnText}>{scanning ? '🔍 Scanning...' : '🛡️ Start Scan'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Checks */}
        {CHECKS.map((check, i) => (
          revealed.includes(i) ? (
            <Animated.View key={i} style={[styles.checkCard, { backgroundColor: colors.surface, opacity: fadeAnims[i], transform: [{ translateX: slideAnims[i] }] }]}>
              <Text style={styles.checkIcon}>{check.status === 'pass' ? '✅' : '⚠️'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.checkLabel, { color: colors.text }]}>{check.label}</Text>
                <Text style={[styles.checkResult, { color: check.status === 'warn' ? '#D97706' : colors.textMuted }]}>{check.result}</Text>
              </View>
            </Animated.View>
          ) : (
            <View key={i} style={[styles.checkCard, { backgroundColor: colors.borderLight, opacity: 0.4 }]}>
              <Text style={styles.checkIcon}>⏳</Text>
              <Text style={[styles.checkLabel, { color: colors.textMuted }]}>{check.label}</Text>
            </View>
          )
        ))}

        {/* Score */}
        {done && (
          <View style={[styles.scoreCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.scoreTitle, { color: colors.text }]}>Security Score</Text>
            <View style={styles.scoreGauge}>
              <Svg width={160} height={160} viewBox="0 0 160 160">
                <Circle cx={CX} cy={CY} r={GAUGE_R} stroke={colors.borderLight} strokeWidth={12} fill="none" />
                <AnimatedCircle
                  cx={CX} cy={CY} r={GAUGE_R}
                  stroke="#059669" strokeWidth={12} fill="none"
                  strokeDasharray={`${CIRC}`}
                  strokeDashoffset={scoreStroke as any}
                  strokeLinecap="round"
                  rotation="-90" origin={`${CX},${CY}`}
                />
              </Svg>
              <View style={styles.scoreOverlay}>
                <Text style={[styles.scoreNum, { color: '#059669' }]}>{SCORE}</Text>
                <Text style={[styles.scoreMax, { color: colors.textMuted }]}>/100</Text>
              </View>
            </View>
            <Text style={[styles.scoreGrade, { color: colors.textSecondary }]}>Good — 1 issue found</Text>
            <TouchableOpacity style={[styles.reportBtn, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.reportBtnText, { color: colors.primary }]}>📄 Download Report</Text>
            </TouchableOpacity>
          </View>
        )}
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
  scroll: { padding: 20, gap: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  prefix: { fontSize: 15, fontWeight: '500', marginRight: 2 },
  input: { flex: 1, fontSize: 15 },
  scanBtn: { paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  scanBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  checkCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14 },
  checkIcon: { fontSize: 22 },
  checkLabel: { fontSize: 14, fontWeight: '600' },
  checkResult: { fontSize: 12, marginTop: 2 },
  scoreCard: { borderRadius: 16, padding: 20, alignItems: 'center', gap: 12 },
  scoreTitle: { fontSize: 18, fontWeight: '700' },
  scoreGauge: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  scoreOverlay: { position: 'absolute', alignItems: 'center' },
  scoreNum: { fontSize: 38, fontWeight: '800' },
  scoreMax: { fontSize: 14 },
  scoreGrade: { fontSize: 15, fontWeight: '600' },
  reportBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  reportBtnText: { fontSize: 14, fontWeight: '700' },
});
