import React, { useState, useRef, useCallback } from 'react';
import { Animated, Easing, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Line, Defs, RadialGradient, Stop, Ellipse, Polygon } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { Typography, Spacing, Radius } from '../constants/Theme';

const { width: W, height: H } = Dimensions.get('window');

const STEPS = [
  {
    title: 'AI-Powered\nInnovation',
    description: "UAE's leading artificial intelligence platform, delivering cutting-edge solutions that redefine what's possible.",
    color: Colors.neonBlue,
    gradients: ['#00D4FF', '#0066FF'] as const,
  },
  {
    title: 'Smart Enterprise\nSolutions',
    description: 'Transform your business with intelligent automation, predictive analytics, and next-gen cloud architecture.',
    color: Colors.neonPurple,
    gradients: ['#BF5FFF', '#FF2D92'] as const,
  },
  {
    title: 'Join the\nFuture',
    description: 'Be part of the UAE digital revolution. Partner with WeThink and lead the way in technological excellence.',
    color: Colors.neonCyan,
    gradients: ['#00F5FF', '#00D4FF'] as const,
  },
];

function OnboardingIllustration({ step, color }: { step: number; color: string }) {
  const cx = W / 2;
  const cy = 160;
  if (step === 0) {
    return (
      <Svg width={W} height={320}>
        <Defs>
          <RadialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={cx} cy={cy} r={110} fill="url(#brainGlow)" />
        <Circle cx={cx} cy={cy} r={70} fill="none" stroke={color} strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
        <Circle cx={cx} cy={cy} r={90} fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 6" opacity={0.25} />
        <Circle cx={cx} cy={cy} r={28} fill={`${color}25`} stroke={color} strokeWidth={1.5} />
        <Path d={`M ${cx-10} ${cy-6} L ${cx} ${cy-14} L ${cx+10} ${cy-6} L ${cx+10} ${cy+6} L ${cx} ${cy+14} L ${cx-10} ${cy+6} Z`} fill={color} opacity={0.8} />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const nx = cx + 70 * Math.cos(rad);
          const ny = cy + 70 * Math.sin(rad);
          return (
            <React.Fragment key={i}>
              <Line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth={0.8} opacity={0.3} />
              <Circle cx={nx} cy={ny} r={i % 2 === 0 ? 8 : 6} fill={`${color}30`} stroke={color} strokeWidth={1} />
            </React.Fragment>
          );
        })}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <Circle key={`p${i}`} cx={cx + 38 * Math.cos(rad)} cy={cy + 38 * Math.sin(rad)} r={2.5} fill={color} opacity={0.6} />;
        })}
      </Svg>
    );
  }
  if (step === 1) {
    return (
      <Svg width={W} height={320}>
        <Defs>
          <RadialGradient id="enterpriseGlow" cx="50%" cy="50%" r="55%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={cx} cy={cy} r={120} fill="url(#enterpriseGlow)" />
        <Path d={`M ${cx-100} ${cy+80} L ${cx-100} ${cy-30} L ${cx-60} ${cy-30} L ${cx-60} ${cy+80}`} fill={`${color}15`} stroke={color} strokeWidth={1} opacity={0.7} />
        <Path d={`M ${cx-50} ${cy+80} L ${cx-50} ${cy-60} L ${cx-10} ${cy-60} L ${cx-10} ${cy+80}`} fill={`${color}20`} stroke={color} strokeWidth={1.2} />
        <Path d={`M ${cx} ${cy+80} L ${cx} ${cy-90} L ${cx+40} ${cy-90} L ${cx+40} ${cy+80}`} fill={`${color}25`} stroke={color} strokeWidth={1.5} />
        <Path d={`M ${cx+50} ${cy+80} L ${cx+50} ${cy-50} L ${cx+90} ${cy-50} L ${cx+90} ${cy+80}`} fill={`${color}15`} stroke={color} strokeWidth={1} opacity={0.7} />
        <Line x1={cx-80} y1={cy-20} x2={cx+80} y2={cy-20} stroke={color} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.3} />
        <Line x1={cx} y1={cy-90} x2={cx} y2={cy-120} stroke={color} strokeWidth={1} opacity={0.4} />
        <Circle cx={cx} cy={cy-125} r={5} fill={color} opacity={0.6} />
        <Path d={`M ${cx-40} ${cy-125} Q ${cx} ${cy-160} ${cx+40} ${cy-125}`} fill="none" stroke={color} strokeWidth={1} opacity={0.4} strokeDasharray="3 4" />
      </Svg>
    );
  }
  return (
    <Svg width={W} height={320}>
      <Defs>
        <RadialGradient id="futureGlow" cx="50%" cy="45%" r="55%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={120} fill="url(#futureGlow)" />
      <Polygon points={`${cx},${cy-70} ${cx+50},${cy+30} ${cx},${cy+10} ${cx-50},${cy+30}`} fill={`${color}20`} stroke={color} strokeWidth={1.2} />
      <Polygon points={`${cx},${cy-70} ${cx+25},${cy-20} ${cx},${cy+10} ${cx-25},${cy-20}`} fill={`${color}35`} stroke={color} strokeWidth={1.5} />
      {[-80,-55,-35,-15,15,35,55,80].map((x, i) => (
        <Line key={i} x1={cx+x} y1={cy+80} x2={cx+x} y2={cy+80-(40+i*6-Math.abs(i-3.5)*8)} stroke={color} strokeWidth={1.5} opacity={0.4+i*0.04} />
      ))}
      <Circle cx={cx} cy={cy+50} r={6} fill={color} opacity={0.9} />
      <Circle cx={cx} cy={cy+50} r={16} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
      <Circle cx={cx} cy={cy+50} r={28} fill="none" stroke={color} strokeWidth={0.8} opacity={0.25} strokeDasharray="2 4" />
      <Ellipse cx={cx} cy={cy} rx={80} ry={25} fill="none" stroke={color} strokeWidth={1} opacity={0.3} strokeDasharray="4 4" />
      <Circle cx={cx+80} cy={cy} r={5} fill={color} opacity={0.7} />
    </Svg>
  );
}

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const offset = useRef(new Animated.Value(0)).current;

  const goTo = useCallback((next: number) => {
    if (next >= STEPS.length) {
      router.replace('/(tabs)/dashboard');
      return;
    }
    Animated.timing(offset, { toValue: next, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    setCurrent(next);
  }, []);

  const step = STEPS[current];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#050A18', '#080E20', '#050A18']} style={StyleSheet.absoluteFillObject} />
      <TouchableOpacity style={styles.skip} onPress={() => router.replace('/(tabs)/dashboard')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Illustrations */}
      <View style={styles.illustrationArea}>
        {STEPS.map((s, i) => {
          const opacity = offset.interpolate({ inputRange: [i-1, i, i+1], outputRange: [0, 1, 0], extrapolate: 'clamp' });
          const translateX = offset.interpolate({ inputRange: [i-1, i, i+1], outputRange: [W*0.3, 0, -W*0.3], extrapolate: 'clamp' });
          return (
            <Animated.View key={i} style={[StyleSheet.absoluteFillObject, { opacity, transform: [{ translateX }] }]}>
              <OnboardingIllustration step={i} color={s.color} />
            </Animated.View>
          );
        })}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {STEPS.map((s, i) => {
          const opacity = offset.interpolate({ inputRange: [i-1, i, i+1], outputRange: [0, 1, 0], extrapolate: 'clamp' });
          const translateX = offset.interpolate({ inputRange: [i-1, i, i+1], outputRange: [W*0.3, 0, -W*0.3], extrapolate: 'clamp' });
          return (
            <Animated.View key={i} style={[styles.textBlock, StyleSheet.absoluteFillObject, { opacity, transform: [{ translateX }] }]}>
              <LinearGradient colors={s.gradients} style={styles.titleGradientBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.description}>{s.description}</Text>
            </Animated.View>
          );
        })}
        <View style={{ height: 130 }} />
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <View style={styles.dots}>
          {STEPS.map((s, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={[styles.dot, { backgroundColor: i === current ? s.color : 'rgba(255,255,255,0.2)', width: i === current ? 24 : 8 }]} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => goTo(current + 1)} activeOpacity={0.85}>
          <LinearGradient colors={step.gradients} style={styles.nextButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.nextText}>{current === STEPS.length - 1 ? 'Get Started  →' : 'Next  →'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A18' },
  skip: { position: 'absolute', top: 56, right: 24, zIndex: 10 },
  skipText: { ...Typography.bodyMD, color: Colors.textMuted },
  illustrationArea: { height: 320, marginTop: 60 },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 16 },
  textBlock: { paddingTop: 8 },
  titleGradientBar: { width: 48, height: 3, borderRadius: 2, marginBottom: 16 },
  title: { ...Typography.displayMD, color: Colors.white, marginBottom: 16, lineHeight: 38 },
  description: { ...Typography.bodyLG, color: Colors.textSecondary, lineHeight: 26 },
  bottom: { paddingHorizontal: 32, paddingBottom: 48, gap: 24 },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  dot: { height: 8, borderRadius: 4 },
  nextButton: { height: 60, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.neonBlue, shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
  nextText: { ...Typography.headingSM, color: Colors.white, letterSpacing: 0.5 },
});
