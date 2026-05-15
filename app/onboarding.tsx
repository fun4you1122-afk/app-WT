import React, { useState, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Text, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect, Line, Polyline, G, Ellipse } from 'react-native-svg';
import { Colors } from '../constants/Colors';

const { width: W, height: H } = Dimensions.get('window');

const STEPS = [
  {
    id: 0,
    title: 'AI-Powered\nSolutions',
    subtitle: 'Cutting-edge artificial intelligence tailored for enterprise growth in the UAE and beyond.',
    gradient: ['#0055FF', '#3B82F6'] as const,
    bgColor: '#EFF6FF',
    accentColor: '#0055FF',
  },
  {
    id: 1,
    title: 'Real-Time\nAnalytics',
    subtitle: 'Deep insights and predictive intelligence to drive smarter business decisions.',
    gradient: ['#7C3AED', '#A855F7'] as const,
    bgColor: '#F5F3FF',
    accentColor: '#7C3AED',
  },
  {
    id: 2,
    title: 'Enterprise\nReady',
    subtitle: 'Bank-grade security, 99.9% uptime, and dedicated support for mission-critical operations.',
    gradient: ['#059669', '#10B981'] as const,
    bgColor: '#ECFDF5',
    accentColor: '#059669',
  },
];

function AIIllustration() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="60" fill="#0055FF" opacity="0.12" />
      <Circle cx="100" cy="100" r="40" fill="#0055FF" opacity="0.18" />
      <Circle cx="100" cy="100" r="24" fill="#0055FF" opacity="0.9" />
      <Circle cx="100" cy="100" r="10" fill="white" />
      {[0,60,120,180,240,300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + 24 * Math.cos(rad);
        const y1 = 100 + 24 * Math.sin(rad);
        const x2 = 100 + 58 * Math.cos(rad);
        const y2 = 100 + 58 * Math.sin(rad);
        return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0055FF" strokeWidth="1.5" opacity="0.5" />;
      })}
      {[0,60,120,180,240,300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + 58 * Math.cos(rad);
        const cy = 100 + 58 * Math.sin(rad);
        return <Circle key={i} cx={cx} cy={cy} r="7" fill="#0055FF" opacity="0.7" />;
      })}
    </Svg>
  );
}

function AnalyticsIllustration() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      <Rect x="20" y="140" width="28" height="44" rx="4" fill="#7C3AED" opacity="0.3" />
      <Rect x="60" y="110" width="28" height="74" rx="4" fill="#7C3AED" opacity="0.5" />
      <Rect x="100" y="80" width="28" height="104" rx="4" fill="#7C3AED" opacity="0.7" />
      <Rect x="140" y="50" width="28" height="134" rx="4" fill="#7C3AED" opacity="0.9" />
      <Polyline points="20,140 60,110 100,80 140,50 168,30" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {[[20,140],[60,110],[100,80],[140,50],[168,30]].map(([x,y], i) => (
        <Circle key={i} cx={x} cy={y} r="5" fill="#7C3AED" />
      ))}
    </Svg>
  );
}

function EnterpriseIllustration() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      <Path d="M100 30 L160 60 L160 110 C160 145 133 172 100 180 C67 172 40 145 40 110 L40 60 Z" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="2" />
      <Path d="M100 50 L148 74 L148 110 C148 138 127 160 100 168 C73 160 52 138 52 110 L52 74 Z" fill="#059669" opacity="0.25" />
      <Path d="M78 102 L92 116 L124 86" stroke="#059669" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

const illustrations = [AIIllustration, AnalyticsIllustration, EnterpriseIllustration];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    if (step < 2) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -30, duration: 180, useNativeDriver: true }),
      ]).start(() => {
        setStep(s => s + 1);
        slideAnim.setValue(30);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
      });
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  const current = STEPS[step];
  const Illustration = illustrations[step];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Skip */}
        <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)/dashboard')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Illustration card */}
        <Animated.View style={[styles.card, { backgroundColor: current.bgColor, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient colors={[current.bgColor, current.bgColor]} style={StyleSheet.absoluteFillObject} />
          <View style={styles.illustrationWrap}>
            <Illustration />
          </View>
        </Animated.View>

        {/* Text */}
        <Animated.View style={[styles.textBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={[styles.title, { color: Colors.text }]}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>
        </Animated.View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === step ? current.accentColor : Colors.border, width: i === step ? 24 : 8 }]} />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity onPress={goNext} activeOpacity={0.85}>
          <LinearGradient colors={current.gradient} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.btnText}>{step < 2 ? 'Continue' : 'Get Started'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FF' },
  safe: { flex: 1, paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  skipBtn: { alignSelf: 'flex-end', paddingVertical: 12, paddingLeft: 16, marginBottom: 8 },
  skipText: { fontSize: 15, color: '#475569', fontWeight: '500' },
  card: { width: W - 48, height: H * 0.38, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 36, shadowColor: '#0A1628', shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  illustrationWrap: { alignItems: 'center', justifyContent: 'center' },
  textBlock: { width: '100%', marginBottom: 32 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -1, marginBottom: 12, lineHeight: 40 },
  subtitle: { fontSize: 16, color: '#475569', lineHeight: 26, fontWeight: '400' },
  dotsRow: { flexDirection: 'row', gap: 6, marginBottom: 32, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
  btn: { width: W - 48, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: '#0055FF', shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  btnText: { fontSize: 17, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 },
});
