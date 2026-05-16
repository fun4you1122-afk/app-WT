import React, { useState, useRef, useCallback } from 'react';
import { Animated, Easing, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

const GAUGE_R = 90;
const GAUGE_CX = 120;
const GAUGE_CY = 120;
const CIRC = 2 * Math.PI * GAUGE_R;

type Phase = 'idle' | 'download' | 'upload' | 'ping' | 'done';

export default function SpeedTestScreen() {
  const { colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('idle');
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [ping, setPing] = useState(0);
  const [displayVal, setDisplayVal] = useState(0);
  const gaugeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const animateGauge = (target: number, duration: number, onDone: () => void) => {
    gaugeAnim.setValue(0);
    let current = 0;
    const interval = setInterval(() => {
      current += target / (duration / 50);
      if (current >= target) { current = target; clearInterval(interval); onDone(); }
      setDisplayVal(Math.round(current));
    }, 50);
    Animated.timing(gaugeAnim, { toValue: target / 300, duration, useNativeDriver: false, easing: Easing.out(Easing.cubic) }).start();
  };

  const startTest = useCallback(() => {
    if (phase !== 'idle' && phase !== 'done') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDownload(0); setUpload(0); setPing(0);
    setPhase('download');

    const dlTarget = Math.round(80 + Math.random() * 170);
    animateGauge(dlTarget, 2500, () => {
      setDownload(dlTarget);
      setPhase('upload');
      const ulTarget = Math.round(20 + Math.random() * 80);
      animateGauge(ulTarget, 2000, () => {
        setUpload(ulTarget);
        setPhase('ping');
        setDisplayVal(0);
        setTimeout(() => {
          const p = Math.round(8 + Math.random() * 37);
          setPing(p);
          setPhase('done');
        }, 800);
      });
    });

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.06, duration: 600, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ])).start();
  }, [phase]);

  const gaugeStroke = gaugeAnim.interpolate({ inputRange: [0, 1], outputRange: [CIRC, 0] });
  const phaseLabel = phase === 'idle' ? 'Ready' : phase === 'download' ? 'Testing Download...' : phase === 'upload' ? 'Testing Upload...' : phase === 'ping' ? 'Measuring Ping...' : 'Test Complete';
  const gaugeColor = phase === 'upload' ? '#059669' : phase === 'ping' ? '#D97706' : '#0055FF';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#D97706', '#0055FF']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Speed Test</Text>
        <Text style={styles.headerSub}>Test your internet connection</Text>
      </LinearGradient>

      <View style={styles.body}>
        {/* Gauge */}
        <Animated.View style={[styles.gaugeWrap, { transform: [{ scale: phase !== 'idle' && phase !== 'done' ? pulseAnim : new Animated.Value(1) }] }]}>
          <Svg width={240} height={240} viewBox="0 0 240 240">
            <Circle cx={GAUGE_CX} cy={GAUGE_CY} r={GAUGE_R} stroke={colors.borderLight} strokeWidth={14} fill="none" />
            <AnimatedCircle
              cx={GAUGE_CX} cy={GAUGE_CY} r={GAUGE_R}
              stroke={gaugeColor} strokeWidth={14} fill="none"
              strokeDasharray={`${CIRC}`}
              strokeDashoffset={gaugeStroke as any}
              strokeLinecap="round"
              rotation="-90" origin={`${GAUGE_CX},${GAUGE_CY}`}
            />
            <SvgText x={GAUGE_CX} y={GAUGE_CY - 8} textAnchor="middle" fontSize="42" fontWeight="800" fill={colors.text}>{displayVal}</SvgText>
            <SvgText x={GAUGE_CX} y={GAUGE_CY + 18} textAnchor="middle" fontSize="14" fill={colors.textMuted}>Mbps</SvgText>
          </Svg>
        </Animated.View>

        <Text style={[styles.phaseLabel, { color: colors.textSecondary }]}>{phaseLabel}</Text>

        {/* Results */}
        <View style={styles.resultsRow}>
          <ResultCard label="Download" value={download ? `${download}` : '—'} unit="Mbps" color="#0055FF" icon="⬇️" colors={colors} />
          <ResultCard label="Upload" value={upload ? `${upload}` : '—'} unit="Mbps" color="#059669" icon="⬆️" colors={colors} />
          <ResultCard label="Ping" value={ping ? `${ping}` : '—'} unit="ms" color="#D97706" icon="📡" colors={colors} />
        </View>

        {phase === 'done' && (
          <View style={[styles.serverCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.serverText, { color: colors.textSecondary }]}>🌐 Server: Dubai — UAE  ·  ISP: Etisalat</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={startTest}
          style={[styles.startBtn, { opacity: phase !== 'idle' && phase !== 'done' ? 0.5 : 1 }]}
          disabled={phase !== 'idle' && phase !== 'done'}
        >
          <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.startBtnGrad}>
            <Text style={styles.startBtnText}>{phase === 'done' ? '↻ Re-Test' : phase === 'idle' ? '▶  Start Test' : 'Testing...'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ResultCard({ label, value, unit, color, icon, colors }: any) {
  return (
    <View style={[styles.resultCard, { backgroundColor: colors.surface }]}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={[styles.resultVal, { color }]}>{value}</Text>
      <Text style={[styles.resultUnit, { color: colors.textMuted }]}>{unit}</Text>
      <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

// Wrap Circle to accept animated strokeDashoffset
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingHorizontal: 20, paddingBottom: 28 },
  back: { marginBottom: 12 },
  backText: { color: '#fff', fontSize: 22 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  body: { flex: 1, alignItems: 'center', paddingTop: 32, paddingHorizontal: 20, gap: 20 },
  gaugeWrap: { alignItems: 'center', justifyContent: 'center' },
  phaseLabel: { fontSize: 15, fontWeight: '600' },
  resultsRow: { flexDirection: 'row', gap: 12 },
  resultCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 },
  resultVal: { fontSize: 22, fontWeight: '800' },
  resultUnit: { fontSize: 12, fontWeight: '500' },
  resultLabel: { fontSize: 12, fontWeight: '600' },
  serverCard: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  serverText: { fontSize: 13, fontWeight: '500' },
  startBtn: { width: '100%' },
  startBtnGrad: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
