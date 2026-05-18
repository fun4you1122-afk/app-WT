import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Dimensions, Platform, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Ellipse, Path, Rect, Line } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');

// ─── Brand Colors ─────────────────────────────────────────────────────────────
const BLUE = '#0055FF';
const PURPLE = '#7C3AED';
const TEAL = '#0EA5E9';
const GREEN = '#059669';
const AMBER = '#D97706';

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  { name: 'Banking & Finance', count: '12 projects', color: BLUE, gradient: ['#0D1B4B', '#0055FF'] as const, iconType: 'bank' },
  { name: 'Government & Smart City', count: '18 projects', color: PURPLE, gradient: ['#2E1B5E', '#7C3AED'] as const, iconType: 'gov' },
  { name: 'Energy & Utilities', count: '9 projects', color: GREEN, gradient: ['#064E3B', '#059669'] as const, iconType: 'energy' },
  { name: 'Telecom & Media', count: '14 projects', color: AMBER, gradient: ['#451A03', '#D97706'] as const, iconType: 'telecom' },
];

const STATS = [
  { target: 247, suffix: '', label: 'Projects Delivered', color: BLUE },
  { target: 180, suffix: '+', label: 'Enterprise Clients', color: PURPLE },
  { target: 6, suffix: '', label: 'Countries', color: GREEN },
  { target: 99, suffix: '.9%', label: 'Uptime SLA', color: AMBER },
];

const WHY_ITEMS = [
  { title: 'UAE-Native AI', desc: 'Built for Gulf regulations & Arabic NLP', iconType: 'flag', color: BLUE },
  { title: 'Enterprise Grade', desc: 'ISO 27001 certified, 99.9% SLA guaranteed', iconType: 'shield', color: PURPLE },
  { title: 'Full-Stack Team', desc: '200+ engineers, data scientists & consultants', iconType: 'team', color: GREEN },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function GearIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={color} strokeWidth="1.8" fill="none" />
      <Path d="M19.4 15C19.1 15.6 19.3 16.4 19.8 16.9L19.9 17C20.3 17.4 20.3 18 19.9 18.4L18.4 19.9C18 20.3 17.4 20.3 17 19.9L16.9 19.8C16.4 19.3 15.6 19.1 15 19.4C14.4 19.7 14 20.3 14 21V21.1C14 21.6 13.6 22 13.1 22H10.9C10.4 22 10 21.6 10 21.1V21C10 20.3 9.6 19.7 9 19.4C8.4 19.1 7.6 19.3 7.1 19.8L7 19.9C6.6 20.3 6 20.3 5.6 19.9L4.1 18.4C3.7 18 3.7 17.4 4.1 17L4.2 16.9C4.7 16.4 4.9 15.6 4.6 15C4.3 14.4 3.7 14 3 14H2.9C2.4 14 2 13.6 2 13.1V10.9C2 10.4 2.4 10 2.9 10H3C3.7 10 4.3 9.6 4.6 9C4.9 8.4 4.7 7.6 4.2 7.1L4.1 7C3.7 6.6 3.7 6 4.1 5.6L5.6 4.1C6 3.7 6.6 3.7 7 4.1L7.1 4.2C7.6 4.7 8.4 4.9 9 4.6C9.6 4.3 10 3.7 10 3V2.9C10 2.4 10.4 2 10.9 2H13.1C13.6 2 14 2.4 14 2.9V3C14 3.7 14.4 4.3 15 4.6C15.6 4.9 16.4 4.7 16.9 4.2L17 4.1C17.4 3.7 18 3.7 18.4 4.1L19.9 5.6C20.3 6 20.3 6.6 19.9 7L19.8 7.1C19.3 7.6 19.1 8.4 19.4 9C19.7 9.6 20.3 10 21 10H21.1C21.6 10 22 10.4 22 10.9V13.1C22 13.6 21.6 14 21.1 14H21C20.3 14 19.7 14.4 19.4 15Z" stroke={color} strokeWidth="1.8" fill="none" />
    </Svg>
  );
}

function BankIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 10V21M12 10V21M16 10V21" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function GovIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L2 7H22L12 2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M2 7V9H22V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M4 9V19M8 9V19M12 9V19M16 9V19M20 9V19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M2 19H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function EnergyIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TelecomIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M1.5 8.5C4 5 7.5 3 12 3C16.5 3 20 5 22.5 8.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M5 12C6.7 10 9.2 9 12 9C14.8 9 17.3 10 19 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8.5 15.5C9.5 14.2 10.7 13.5 12 13.5C13.3 13.5 14.5 14.2 15.5 15.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="19" r="1.5" fill={color} />
    </Svg>
  );
}

function FlagIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 15S5 14 8 14S13 16 16 16S20 15 20 15V3S19 4 16 4S11 2 8 2S4 3 4 3V22" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22S4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TeamIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="8" r="3" stroke={color} strokeWidth="1.8" />
      <Path d="M3 20C3 17.24 5.69 15 9 15C12.31 15 15 17.24 15 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M16 11C17.66 11 19 9.66 19 8C19 6.34 17.66 5 16 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M21 20C21 17.94 19.24 16.26 17 15.73" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function getIndustryIcon(iconType: string, color: string) {
  switch (iconType) {
    case 'bank': return <BankIcon color={color} />;
    case 'gov': return <GovIcon color={color} />;
    case 'energy': return <EnergyIcon color={color} />;
    case 'telecom': return <TelecomIcon color={color} />;
    default: return null;
  }
}

function getWhyIcon(iconType: string, color: string) {
  switch (iconType) {
    case 'flag': return <FlagIcon color={color} />;
    case 'shield': return <ShieldIcon color={color} />;
    case 'team': return <TeamIcon color={color} />;
    default: return null;
  }
}

// ─── Neural Network Visualization ────────────────────────────────────────────

const NODES = [
  { x: 0.15, y: 0.18 }, { x: 0.5, y: 0.08 }, { x: 0.85, y: 0.22 },
  { x: 0.08, y: 0.5 },  { x: 0.38, y: 0.42 }, { x: 0.62, y: 0.38 }, { x: 0.92, y: 0.55 },
  { x: 0.22, y: 0.72 }, { x: 0.5, y: 0.82 },  { x: 0.78, y: 0.68 },
];
const EDGES = [
  [0,1],[1,2],[0,3],[1,4],[1,5],[2,6],[3,4],[4,5],[5,6],[3,7],[4,8],[5,9],[6,9],[7,8],[8,9],
];

function NeuralNetwork({ height }: { height: number }) {
  const pulseAnims = useRef(NODES.map(() => new Animated.Value(0))).current;
  const edgeAnims = useRef(EDGES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    NODES.forEach((_, i) => {
      const loop = () =>
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(pulseAnims[i], { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnims[i], { toValue: 0.3, duration: 1400, useNativeDriver: true }),
        ]);
      Animated.loop(loop()).start();
    });
    EDGES.forEach((_, i) => {
      const loop = () =>
        Animated.sequence([
          Animated.delay(i * 120 + 400),
          Animated.timing(edgeAnims[i], { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(edgeAnims[i], { toValue: 0.15, duration: 1600, useNativeDriver: true }),
        ]);
      Animated.loop(loop()).start();
    });
  }, []);

  return (
    <View style={[StyleSheet.absoluteFillObject, { height }]} pointerEvents="none">
      <Svg width={W} height={height}>
        {EDGES.map(([a, b], i) => {
          const na = NODES[a], nb = NODES[b];
          return (
            <Line
              key={i}
              x1={na.x * W} y1={na.y * height}
              x2={nb.x * W} y2={nb.y * height}
              stroke="rgba(99,102,241,0.35)"
              strokeWidth="1"
            />
          );
        })}
        {NODES.map((n, i) => (
          <Circle
            key={i}
            cx={n.x * W}
            cy={n.y * height}
            r={4}
            fill={i % 3 === 0 ? BLUE : i % 3 === 1 ? PURPLE : TEAL}
            opacity={0.85}
          />
        ))}
      </Svg>
      {NODES.map((n, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: n.x * W - 10,
            top: n.y * height - 10,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: i % 3 === 0 ? BLUE : i % 3 === 1 ? PURPLE : TEAL,
            opacity: pulseAnims[i],
            transform: [{ scale: pulseAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.5] }) }],
          }}
        />
      ))}
    </View>
  );
}

// ─── Impact Cards (horizontal scroll) ────────────────────────────────────────

const IMPACT_DATA = [
  { value: 'AED 340M+', label: 'Fraud Prevented', sub: 'Emirates NBD', color: BLUE, gradient: ['#0D1B4B', '#0055FF'] as const },
  { value: '4M+', label: 'Users Served', sub: 'Etisalat AI', color: PURPLE, gradient: ['#2E1B5E', '#7C3AED'] as const },
  { value: '23%', label: 'Cost Reduction', sub: 'DEWA Analytics', color: GREEN, gradient: ['#064E3B', '#059669'] as const },
  { value: '99.9%', label: 'SLA Uptime', sub: 'All Projects', color: AMBER, gradient: ['#451A03', '#D97706'] as const },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  anim: Animated.Value;
  opacAnim: Animated.Value;
  angle: number;
  color: string;
}

function ImpactCard({ item, index }: { item: typeof IMPACT_DATA[0]; index: number }) {
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay: index * 100, useNativeDriver: true, damping: 13, stiffness: 120 }),
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePress = (evt: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { locationX, locationY } = evt.nativeEvent;
    const colors = [item.color, '#fff', TEAL, PURPLE, BLUE];
    const newParticles: Particle[] = Array.from({ length: 14 }, (_, i) => {
      const id = particleIdRef.current++;
      const anim = new Animated.Value(0);
      const opacAnim = new Animated.Value(1);
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacAnim, { toValue: 0, duration: 650, useNativeDriver: true }),
      ]).start(() => setParticles(prev => prev.filter(p => p.id !== id)));
      return { id, x: locationX, y: locationY, anim, opacAnim, angle: (i / 14) * Math.PI * 2, color: colors[i % colors.length] };
    });
    setParticles(prev => [...prev, ...newParticles]);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.88}>
        <LinearGradient colors={item.gradient} style={styles.impactCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Svg style={StyleSheet.absoluteFill as any} width={150} height={110} pointerEvents="none">
            <Circle cx={150} cy={0} r={80} stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
            <Circle cx={0} cy={110} r={50} fill="rgba(255,255,255,0.04)" />
          </Svg>
          <Text style={styles.impactValue}>{item.value}</Text>
          <Text style={styles.impactLabel}>{item.label}</Text>
          <Text style={styles.impactSub}>{item.sub}</Text>
          {particles.map(p => (
            <Animated.View key={p.id} pointerEvents="none" style={{
              position: 'absolute', left: p.x - 3, top: p.y - 3, width: 6, height: 6,
              borderRadius: 3, backgroundColor: p.color, opacity: p.opacAnim,
              transform: [
                { translateX: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(p.angle) * 48] }) },
                { translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(p.angle) * 48] }) },
              ],
            }} />
          ))}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Wireframe Globe ─────────────────────────────────────────────────────────

function WireframeGlobe({ size = 210 }: { size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.38;
  const angle = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [dots, setDots] = useState([
    { x: cx + R, y: cy, color: BLUE },
    { x: cx - R * 0.5, y: cy - R * 0.85, color: PURPLE },
    { x: cx + R * 0.3, y: cy + R * 0.95, color: TEAL },
  ]);

  useEffect(() => {
    const id = angle.addListener(({ value }) => {
      setDots([
        { x: cx + R * Math.cos(value), y: cy + R * 0.3 * Math.sin(value), color: BLUE },
        { x: cx + R * 0.7 * Math.cos(value + (Math.PI * 2) / 3), y: cy + R * Math.sin(value + (Math.PI * 2) / 3), color: PURPLE },
        { x: cx + R * 0.5 * Math.cos(value + (Math.PI * 4) / 3), y: cy + R * 0.4 * Math.sin(value + (Math.PI * 4) / 3), color: TEAL },
      ]);
    });
    Animated.loop(Animated.timing(angle, { toValue: Math.PI * 2, duration: 7000, useNativeDriver: false })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.5, duration: 2000, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
    ])).start();
    return () => angle.removeListener(id);
  }, []);

  const latAngles = [-65, -48, -30, -14, 4, 20, 36, 52, 68];

  return (
    <View pointerEvents="none" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={R + 30} fill="rgba(0,85,255,0.05)" />
        <Circle cx={cx} cy={cy} r={R + 18} stroke="rgba(0,85,255,0.18)" strokeWidth="1" fill="none" />
        <Circle cx={cx} cy={cy} r={R + 8} stroke="rgba(14,165,233,0.12)" strokeWidth="1" fill="none" />
        <Circle cx={cx} cy={cy} r={R} fill="rgba(0,85,255,0.05)" />
        <Circle cx={cx} cy={cy} r={R} stroke="rgba(0,170,255,0.65)" strokeWidth="1.2" fill="none" />
        {latAngles.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const latY = cy + R * Math.sin(rad);
          const latRx = R * Math.cos(Math.abs(rad));
          const latRy = latRx * 0.28;
          return latRx > 4 ? (
            <Ellipse key={i} cx={cx} cy={latY} rx={latRx} ry={latRy}
              stroke={i % 3 === 0 ? 'rgba(14,165,233,0.45)' : 'rgba(0,120,255,0.28)'}
              strokeWidth="0.8" fill="none" />
          ) : null;
        })}
        <Ellipse cx={cx} cy={cy} rx={R * 0.18} ry={R} stroke="rgba(124,58,237,0.45)" strokeWidth="0.8" fill="none" />
        <Ellipse cx={cx} cy={cy} rx={R * 0.42} ry={R} stroke="rgba(0,120,255,0.35)" strokeWidth="0.8" fill="none" />
        <Ellipse cx={cx} cy={cy} rx={R * 0.68} ry={R} stroke="rgba(14,165,233,0.28)" strokeWidth="0.8" fill="none" />
        <Ellipse cx={cx} cy={cy} rx={R * 0.9} ry={R} stroke="rgba(0,85,255,0.2)" strokeWidth="0.8" fill="none" />
        <Circle cx={cx + R * 0.55} cy={cy - R * 0.25} r={2.5} fill={TEAL} opacity={0.85} />
        <Circle cx={cx - R * 0.4} cy={cy + R * 0.15} r={2} fill={AMBER} opacity={0.85} />
        <Circle cx={cx + R * 0.15} cy={cy + R * 0.55} r={2.5} fill={GREEN} opacity={0.85} />
        <Circle cx={cx - R * 0.55} cy={cy - R * 0.4} r={2} fill={PURPLE} opacity={0.85} />
        {dots.map((d, i) => (
          <React.Fragment key={i}>
            <Circle cx={d.x} cy={d.y} r={i === 0 ? 5 : 3.5} fill={d.color} opacity={0.95} />
            <Circle cx={d.x} cy={d.y} r={i === 0 ? 11 : 7} fill={d.color} opacity={0.18} />
          </React.Fragment>
        ))}
      </Svg>
      <Animated.View style={{
        position: 'absolute',
        left: cx - R - 22,
        top: cy - R - 22,
        width: (R + 22) * 2,
        height: (R + 22) * 2,
        borderRadius: (R + 22),
        borderWidth: 1,
        borderColor: 'rgba(0,85,255,0.3)',
        transform: [{ scale: pulseAnim }],
        opacity: pulseAnim.interpolate({ inputRange: [1, 1.5], outputRange: [0.6, 0] }),
      }} />
    </View>
  );
}

// ─── Data Ticker ──────────────────────────────────────────────────────────────

function DataTicker() {
  const anim = useRef(new Animated.Value(0)).current;
  const TICKER = '  247 PROJECTS  ◆  AED 340M+ FRAUD PREVENTED  ◆  180+ CLIENTS  ◆  4M USERS SERVED  ◆  6 COUNTRIES  ◆  99.9% UPTIME  ◆  ISO 27001 CERTIFIED  ◆  ';

  useEffect(() => {
    const run = () => {
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 22000, useNativeDriver: true }).start(({ finished }) => {
        if (finished) run();
      });
    };
    run();
  }, []);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [W, -W * 2.5] });

  return (
    <View style={{ overflow: 'hidden', height: 22, marginTop: 10 }}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <Text style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, letterSpacing: 1.8, fontWeight: '700' }}>
          {TICKER}{TICKER}
        </Text>
      </Animated.View>
    </View>
  );
}

// ─── Hero Badge ───────────────────────────────────────────────────────────────

function HeroBadge() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <View style={styles.heroBadge}>
      <Animated.View style={[styles.heroBadgeDot, { opacity: pulseAnim }]} />
      <Text style={styles.heroBadgeText}>UAE'S #1 ENTERPRISE AI FIRM</Text>
    </View>
  );
}

// ─── Shimmer Headline ─────────────────────────────────────────────────────────

function ShimmerHeadline({ text }: { text: string }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const lines = text.split('\n');

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, W] });

  return (
    <View style={{ overflow: 'hidden', marginBottom: 10 }}>
      <Text style={styles.heroHeadline}>{lines[0]}</Text>
      <Text style={[styles.heroHeadline, { color: BLUE }]}>{lines[1]}</Text>
      <Animated.View style={{
        position: 'absolute', top: 0, bottom: 0, width: 90,
        transform: [{ translateX }],
      }}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.18)', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

// ─── ParticleField ────────────────────────────────────────────────────────────

const PARTICLE_CONFIG = [
  { x: 0.08, y: 0.15, size: 2, color: BLUE, opacity: 0.5, dur: 5200 },
  { x: 0.85, y: 0.08, size: 3, color: PURPLE, opacity: 0.6, dur: 7800 },
  { x: 0.45, y: 0.3, size: 2, color: TEAL, opacity: 0.4, dur: 6400 },
  { x: 0.72, y: 0.55, size: 4, color: BLUE, opacity: 0.35, dur: 9100 },
  { x: 0.2, y: 0.65, size: 2, color: GREEN, opacity: 0.45, dur: 5800 },
  { x: 0.93, y: 0.35, size: 3, color: PURPLE, opacity: 0.55, dur: 8300 },
  { x: 0.35, y: 0.78, size: 2, color: TEAL, opacity: 0.4, dur: 6900 },
  { x: 0.6, y: 0.12, size: 3, color: AMBER, opacity: 0.5, dur: 7200 },
  { x: 0.15, y: 0.42, size: 2, color: BLUE, opacity: 0.45, dur: 10500 },
  { x: 0.78, y: 0.82, size: 4, color: GREEN, opacity: 0.3, dur: 8700 },
  { x: 0.52, y: 0.55, size: 2, color: PURPLE, opacity: 0.5, dur: 6100 },
  { x: 0.28, y: 0.22, size: 3, color: TEAL, opacity: 0.4, dur: 9500 },
  { x: 0.67, y: 0.7, size: 2, color: BLUE, opacity: 0.55, dur: 7600 },
  { x: 0.04, y: 0.85, size: 3, color: AMBER, opacity: 0.35, dur: 11200 },
  { x: 0.9, y: 0.62, size: 2, color: PURPLE, opacity: 0.5, dur: 8000 },
  { x: 0.41, y: 0.48, size: 4, color: GREEN, opacity: 0.3, dur: 6700 },
  { x: 0.56, y: 0.9, size: 2, color: TEAL, opacity: 0.45, dur: 9800 },
  { x: 0.25, y: 0.05, size: 3, color: BLUE, opacity: 0.6, dur: 5500 },
  { x: 0.82, y: 0.25, size: 2, color: AMBER, opacity: 0.4, dur: 12000 },
  { x: 0.12, y: 0.95, size: 3, color: GREEN, opacity: 0.35, dur: 7400 },
];

function ParticleField({ height }: { height: number }) {
  const anims = useRef(
    PARTICLE_CONFIG.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    PARTICLE_CONFIG.forEach((p, i) => {
      const { x, y, opacity } = anims[i];

      // Fade in
      Animated.timing(opacity, {
        toValue: p.opacity,
        duration: 1000 + i * 80,
        useNativeDriver: true,
      }).start();

      // X drift loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(x, { toValue: (Math.random() - 0.5) * 30, duration: p.dur, useNativeDriver: true }),
          Animated.timing(x, { toValue: (Math.random() - 0.5) * 25, duration: p.dur * 0.9, useNativeDriver: true }),
          Animated.timing(x, { toValue: 0, duration: p.dur * 1.1, useNativeDriver: true }),
        ])
      ).start();

      // Y drift loop (offset timing)
      Animated.loop(
        Animated.sequence([
          Animated.timing(y, { toValue: (Math.random() - 0.5) * 20, duration: p.dur * 1.2, useNativeDriver: true }),
          Animated.timing(y, { toValue: (Math.random() - 0.5) * 15, duration: p.dur, useNativeDriver: true }),
          Animated.timing(y, { toValue: 0, duration: p.dur * 0.8, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={[StyleSheet.absoluteFillObject, { height }]} pointerEvents="none">
      {PARTICLE_CONFIG.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: p.x * W,
            top: p.y * height,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: p.color,
            opacity: anims[i].opacity,
            transform: [
              { translateX: anims[i].x },
              { translateY: anims[i].y },
            ],
          }}
        />
      ))}
    </View>
  );
}

// ─── AnimatedCounter ──────────────────────────────────────────────────────────

function AnimatedCounter({
  target, suffix, label, color, duration = 1400,
}: {
  target: number; suffix: string; label: string; color: string; duration?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const id = anim.addListener(({ value }) => setDisplay(Math.round(value).toString()));
    Animated.timing(anim, {
      toValue: target,
      duration,
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(id);
  }, []);

  return (
    <View style={styles.counterItem}>
      <Text style={[styles.counterValue, { color }]}>
        {display}{suffix}
      </Text>
      <Text style={styles.counterLabel}>{label}</Text>
    </View>
  );
}

// ─── Industry Card (3D Tilt) ──────────────────────────────────────────────────

function IndustryCard({ item, index }: { item: typeof INDUSTRIES[0]; index: number }) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1, delay: index * 90, useNativeDriver: true, damping: 13, stiffness: 120,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration: 350, delay: index * 90, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.spring(tiltX, { toValue: 8, useNativeDriver: true, damping: 10, stiffness: 200 }),
      Animated.spring(tiltY, { toValue: -5, useNativeDriver: true, damping: 10, stiffness: 200 }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(tiltX, { toValue: 0, useNativeDriver: true, damping: 12, stiffness: 200 }),
      Animated.spring(tiltY, { toValue: 0, useNativeDriver: true, damping: 12, stiffness: 200 }),
    ]).start();
  };

  const cardW = (W - 60) / 2;

  return (
    <Animated.View
      style={[
        { opacity, width: cardW },
        {
          transform: [
            { scale },
            { perspective: 800 },
            {
              rotateX: tiltY.interpolate({
                inputRange: [-10, 10],
                outputRange: ['-10deg', '10deg'],
              }),
            },
            {
              rotateY: tiltX.interpolate({
                inputRange: [-10, 10],
                outputRange: ['-10deg', '10deg'],
              }),
            },
          ],
        },
      ]}
    >
      {/* Shadow layer for depth */}
      <View style={[styles.industryCardShadow, { width: cardW }]} />
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={item.gradient}
          style={[styles.industryCard, { width: cardW }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Svg style={StyleSheet.absoluteFill as any} width={cardW} height={120} pointerEvents="none">
            <Circle cx={cardW} cy={0} r={70} stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
            <Circle cx={cardW * 0.1} cy={120} r={40} stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          </Svg>
          <View style={styles.industryIconWrap}>
            {getIndustryIcon(item.iconType, 'rgba(255,255,255,0.95)')}
          </View>
          <Text style={styles.industryName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.industryCountRow}>
            <View style={[styles.industryCountDot, { backgroundColor: item.color }]} />
            <Text style={styles.industryCount}>{item.count}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Success Story ────────────────────────────────────────────────────────────

function SuccessStory() {
  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay: 250, useNativeDriver: true, damping: 14, stiffness: 110 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, delay: 250, useNativeDriver: true }),
    ]).start();

    // Progress bar fill
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1600,
      delay: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const cardW = W - 48;

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        activeOpacity={0.92}
      >
        <LinearGradient
          colors={['#065F46', '#059669', '#10B981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.storyCard}
        >
          <Svg style={StyleSheet.absoluteFill as any} width={cardW} height={180} pointerEvents="none">
            <Circle cx={cardW - 20} cy={-20} r={110} stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
            <Circle cx={cardW - 20} cy={-20} r={70} stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
            <Circle cx={30} cy={180} r={60} fill="rgba(0,0,0,0.08)" />
          </Svg>

          <View style={styles.storyBadge}>
            <Text style={styles.storyBadgeText}>CASE STUDY</Text>
          </View>

          <Text style={styles.storyClient}>Emirates NBD</Text>
          <Text style={styles.storyHeadline}>
            {"AI Fraud Detection prevented\nAED 340M in losses — 12 months"}
          </Text>

          {/* Animated Progress Bar */}
          <View
            style={styles.progressTrack}
            onLayout={(e) => setProgressWidth(e.nativeEvent.layout.width)}
          >
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, progressWidth],
                  }),
                },
              ]}
            />
          </View>

          <View style={styles.storyFooter}>
            <View style={styles.avatarRow}>
              <View style={[styles.teamAvatar, { zIndex: 1 }]}>
                <Text style={styles.teamAvatarText}>RA</Text>
              </View>
              <Text style={styles.teamLabel}>  Rasha Aljalam, CEO</Text>
            </View>
            <Text style={styles.storyLink}>Read Full Story →</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Glass Why Card ───────────────────────────────────────────────────────────

function GlassWhyCard({ item, isDark }: { item: typeof WHY_ITEMS[0]; isDark: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, damping: 14 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12 }).start();

  return (
    <Animated.View style={[styles.glassCardOuter, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <BlurView
          intensity={25}
          tint={isDark ? 'dark' : 'light'}
          style={styles.glassCardBlur}
        >
          <View style={[styles.glassCardInner, {
            backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.6)',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
          }]}>
            <View style={[styles.whyIconCircle, { backgroundColor: item.color + '20' }]}>
              {getWhyIcon(item.iconType, item.color)}
            </View>
            <Text style={[styles.whyTitle, { color: isDark ? '#fff' : '#0A1628' }]}>{item.title}</Text>
            <Text style={[styles.whyDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#475569' }]}>{item.desc}</Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Hero Section (with parallax) ────────────────────────────────────────────

function HeroContent({ scrollY, isDark }: { scrollY: Animated.Value; isDark: boolean }) {
  const orb1Scale = useRef(new Animated.Value(1)).current;
  const orb2Scale = useRef(new Animated.Value(1)).current;
  const orb3Scale = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(32)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, useNativeDriver: true, damping: 16, stiffness: 110 }),
    ]).start();

    Animated.timing(hintOpacity, { toValue: 0.65, duration: 600, delay: 1400, useNativeDriver: true }).start();

    Animated.loop(Animated.sequence([
      Animated.timing(orb1Scale, { toValue: 1.2, duration: 3200, useNativeDriver: true }),
      Animated.timing(orb1Scale, { toValue: 1, duration: 3200, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(orb2Scale, { toValue: 1.15, duration: 4100, useNativeDriver: true }),
      Animated.timing(orb2Scale, { toValue: 1, duration: 4100, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(orb3Scale, { toValue: 1.1, duration: 5600, useNativeDriver: true }),
      Animated.timing(orb3Scale, { toValue: 1, duration: 5600, useNativeDriver: true }),
    ])).start();
  }, []);

  const HERO_H = 440;

  const heroTranslate = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const ctaPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(route as any);
  };

  return (
    <View style={[styles.heroOuter, { height: HERO_H }]}>
      <LinearGradient
        colors={['#020818', '#0A1628', '#0D1B4B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Parallax content */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateY: heroTranslate }] },
        ]}
      >
        {/* Glowing orbs */}
        <Animated.View style={[styles.orb, styles.orb1, { transform: [{ scale: orb1Scale }] }]} />
        <Animated.View style={[styles.orb, styles.orb2, { transform: [{ scale: orb2Scale }] }]} />
        <Animated.View style={[styles.orb, styles.orb3, { transform: [{ scale: orb3Scale }] }]} />

        {/* SVG decorative ellipses */}
        <Svg
          style={StyleSheet.absoluteFill as any}
          width={W}
          height={HERO_H}
          pointerEvents="none"
        >
          <Ellipse cx={W * 0.88} cy={50} rx={100} ry={100} fill="rgba(124,58,237,0.18)" />
          <Ellipse cx={W * 0.08} cy={260} rx={80} ry={80} fill="rgba(14,165,233,0.12)" />
          <Ellipse cx={W * 0.5} cy={320} rx={150} ry={60} fill="rgba(0,85,255,0.08)" />
          <Circle cx={W * 0.5} cy={320} r={130} stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          <Circle cx={W * 0.5} cy={320} r={90} stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
        </Svg>

        {/* Neural Network */}
        <NeuralNetwork height={HERO_H} />
        {/* Particles */}
        <ParticleField height={HERO_H} />
      </Animated.View>

      {/* Hero UI (not parallaxed — stays in place) */}
      <View style={styles.heroContent}>
        {/* Top bar */}
        <View style={styles.heroTopBar}>
          <View style={styles.heroLogoRow}>
            <LinearGradient colors={[PURPLE, BLUE]} style={styles.heroLogoBadge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.heroLogoInitials}>WT</Text>
            </LinearGradient>
            <Text style={styles.heroLogoText}>WeThink.ae</Text>
          </View>
          <TouchableOpacity
            style={styles.heroGearBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/settings' as any); }}
          >
            <GearIcon color="#fff" size={18} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
          {/* Hero badge */}
          <HeroBadge />
          <ShimmerHeadline text={"The Middle East's\nLeading AI Partner"} />
          <Text style={styles.heroSub}>
            Transforming enterprises across the GCC with cutting-edge AI
          </Text>
          <View style={styles.heroCtas}>
            <TouchableOpacity
              style={styles.ctaSolid}
              onPress={() => ctaPress('/tools/consultation')}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaSolidText}>Book Free Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaOutline}
              onPress={() => ctaPress('/(tabs)/services')}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaOutlineText}>Solutions →</Text>
            </TouchableOpacity>
          </View>

          {/* Inline stat pills */}
          <View style={styles.heroPills}>
            {[
              { label: '99.9% Uptime', color: GREEN },
              { label: '247 Projects', color: PURPLE },
              { label: '6 Countries', color: TEAL },
            ].map((pill) => (
              <View key={pill.label} style={[styles.heroPill, { borderColor: pill.color + '40' }]}>
                <View style={[styles.heroPillDot, { backgroundColor: pill.color }]} />
                <Text style={[styles.heroPillText, { color: pill.color }]}>{pill.label}</Text>
              </View>
            ))}
          </View>

          <DataTicker />
        </Animated.View>
      </View>

      {/* Globe — top-right hero background */}
      <View style={styles.globeWrap} pointerEvents="none">
        <WireframeGlobe size={320} />
      </View>
    </View>
  );
}

// ─── Stats Grid (2×2) ────────────────────────────────────────────────────────

function StatsStrip({ colors }: { colors: any }) {
  const cardW = (W - 48 - 12) / 2;
  return (
    <View style={styles.statsGrid}>
      {STATS.map((s, i) => (
        <View
          key={s.label}
          style={[
            styles.statCard,
            { width: cardW, backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <View style={[styles.statAccentBar, { backgroundColor: s.color }]} />
          <AnimatedCounter
            target={s.target}
            suffix={s.suffix}
            label={s.label}
            color={s.color}
            duration={1200 + i * 150}
          />
        </View>
      ))}
    </View>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay: 100, useNativeDriver: true, damping: 14, stiffness: 100 }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <LinearGradient
        colors={['#1E0A4C', '#3B0764', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ctaBanner}
      >
        <Svg style={StyleSheet.absoluteFill as any} width={W - 48} height={160} pointerEvents="none">
          <Circle cx={W - 80} cy={80} r={90} fill="rgba(255,255,255,0.04)" />
          <Circle cx={20} cy={20} r={55} fill="rgba(255,255,255,0.03)" />
          <Ellipse cx={W * 0.5 - 24} cy={160} rx={120} ry={40} fill="rgba(0,0,0,0.15)" />
        </Svg>
        <Text style={styles.ctaBannerTitle}>Ready to transform your business?</Text>
        <Text style={styles.ctaBannerSub}>
          Join 180+ organizations powered by WeThink AI
        </Text>
        <TouchableOpacity
          style={styles.ctaBannerBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/(tabs)/chat' as any); }}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaBannerBtnText}>Schedule Free Consultation</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, colors }: { title: string; colors: any }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionAccentLine, { backgroundColor: colors.primary }]} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.scroll}
      >
        {/* Hero with parallax */}
        <HeroContent scrollY={scrollY} isDark={isDark} />

        {/* Stats Strip */}
        <View style={styles.section}>
          <StatsStrip colors={colors} />
        </View>

        {/* Impact Numbers */}
        <View style={styles.section}>
          <SectionHeader title="Proven Impact" colors={colors} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.impactRow}
          >
            {IMPACT_DATA.map((item, i) => (
              <ImpactCard key={i} item={item} index={i} />
            ))}
          </ScrollView>
        </View>

        {/* Industry Grid — 3D Tilt Cards */}
        <View style={styles.section}>
          <SectionHeader title="Industries We Serve" colors={colors} />
          <View style={styles.industryGrid}>
            {INDUSTRIES.map((item, i) => (
              <IndustryCard key={item.name} item={item} index={i} />
            ))}
          </View>
        </View>

        {/* Success Story */}
        <View style={styles.section}>
          <SectionHeader title="Success Story" colors={colors} />
          <View style={styles.padH}>
            <SuccessStory />
          </View>
        </View>

        {/* Why WeThink — Glass Cards */}
        <View style={styles.section}>
          <SectionHeader title="Why WeThink" colors={colors} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.whyRow}
          >
            {WHY_ITEMS.map((item, i) => (
              <GlassWhyCard key={i} item={item} isDark={isDark} />
            ))}
          </ScrollView>
        </View>

        {/* CTA Banner */}
        <View style={[styles.section, styles.padH]}>
          <CTABanner />
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const HERO_H = 440;

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },
  section: { marginTop: 28 },
  padH: { paddingHorizontal: 24 },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 18,
    gap: 10,
  },
  sectionAccentLine: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },
  sectionTitle: { fontSize: 21, fontWeight: '900', letterSpacing: -0.5 },

  // Hero
  heroOuter: {
    width: W,
    overflow: 'hidden',
  },
  heroContent: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: 24,
    paddingBottom: 32,
    flex: 1,
    justifyContent: 'space-between',
  },
  heroTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  heroLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroLogoBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLogoInitials: { color: '#fff', fontSize: 11, fontWeight: '900' },
  heroLogoText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  heroGearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(14,165,233,0.35)',
    backgroundColor: 'rgba(14,165,233,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEAL,
  },
  heroBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: TEAL,
    letterSpacing: 1.4,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    marginBottom: 4,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroPillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  heroPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroHeadline: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
    marginBottom: 22,
  },
  heroCtas: { flexDirection: 'row', gap: 12 },
  ctaSolid: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaSolidText: { fontSize: 13, fontWeight: '800', color: BLUE },
  ctaOutline: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  ctaOutlineText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  scrollHint: {
    marginTop: 16,
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Orbs
  orb: { position: 'absolute', borderRadius: 999 },
  orb1: {
    width: 240,
    height: 240,
    top: -100,
    right: -80,
    backgroundColor: 'rgba(124,58,237,0.22)',
  },
  orb2: {
    width: 180,
    height: 180,
    bottom: -60,
    left: -70,
    backgroundColor: 'rgba(14,165,233,0.15)',
  },
  orb3: {
    width: 120,
    height: 120,
    top: 100,
    left: W * 0.4,
    backgroundColor: 'rgba(0,85,255,0.12)',
  },

  // Stats Grid
  statsGrid: {
    marginHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    borderRadius: 20,
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 16,
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  statAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  counterItem: { alignItems: 'flex-start' },
  counterValue: { fontSize: 36, fontWeight: '900', letterSpacing: -1.5 },
  counterLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 4 },

  // Industry Cards
  industryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  industryCardShadow: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    right: 8,
    height: 120,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  industryCard: {
    height: 120,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  industryIconWrap: { position: 'absolute', top: 14, left: 14 },
  industryName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 17,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  industryCountRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  industryCountDot: { width: 5, height: 5, borderRadius: 2.5 },
  industryCount: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },

  // Success Story
  storyCard: {
    borderRadius: 22,
    padding: 22,
    paddingTop: 50,
    minHeight: 190,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  storyBadge: {
    position: 'absolute',
    top: 18,
    left: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  storyBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  storyClient: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  storyHeadline: {
    fontSize: 17,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.3,
    lineHeight: 23,
    marginBottom: 14,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  teamAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  teamLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: '600' },
  storyLink: { color: '#fff', fontSize: 13, fontWeight: '800' },

  // Impact Cards
  impactRow: { paddingHorizontal: 24, gap: 12, paddingBottom: 4 },
  impactCard: {
    width: 150,
    height: 110,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  impactValue: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 2 },
  impactLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  impactSub: { fontSize: 10, fontWeight: '500', color: 'rgba(255,255,255,0.55)', marginTop: 1 },

  // Glass Why Cards
  whyRow: { paddingHorizontal: 24, gap: 12, paddingBottom: 4 },
  glassCardOuter: {
    width: 175,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  glassCardBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  glassCardInner: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  whyIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  whyTitle: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  whyDesc: { fontSize: 12, lineHeight: 17, fontWeight: '500' },

  globeWrap: {
    position: 'absolute',
    right: -70,
    top: -30,
    opacity: 0.78,
  },

  // CTA Banner
  ctaBanner: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    overflow: 'hidden',
    gap: 8,
  },
  ctaBannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  ctaBannerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaBannerBtn: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 28,
    paddingVertical: 13,
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  ctaBannerBtnText: { color: PURPLE, fontSize: 14, fontWeight: '800' },
});
