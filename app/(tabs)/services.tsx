import React, { useRef, useEffect, useState } from 'react';
import {
  Animated, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Dimensions, Platform, StatusBar, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Ellipse, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

// ─── New Animated Components ──────────────────────────────────────────────────

function GlitchBadge({ text }: { text: string }) {
  const sweepAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweepAnim, { toValue: 2, duration: 1800, useNativeDriver: true, delay: 0 }),
        Animated.timing(sweepAnim, { toValue: -1, duration: 0, useNativeDriver: true }),
        Animated.delay(2200),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={{ alignSelf: 'flex-start', marginBottom: 12 }}>
      <View style={{
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}>
        {/* sweep shimmer line */}
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 30,
          backgroundColor: 'rgba(255,255,255,0.25)',
          transform: [{ translateX: sweepAnim.interpolate({ inputRange: [-1, 2], outputRange: [-30, 120] }) }],
        }} />
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' }} />
        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1.2 }}>{text}</Text>
      </View>
    </View>
  );
}

function WaveformBar({ barCount = 14, color = '#fff', height = 36 }: { barCount?: number; color?: string; height?: number }) {
  const anims = useRef(Array.from({ length: barCount }, () => new Animated.Value(Math.random() * 0.6 + 0.2))).current;

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random() * 0.7 + 0.3,
            duration: 300 + Math.random() * 400,
            useNativeDriver: true,
            delay: i * 40,
          }),
          Animated.timing(anim, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: 300 + Math.random() * 300,
            useNativeDriver: true,
          }),
        ])
      )
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, height }}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 3,
            height: height,
            borderRadius: 2,
            backgroundColor: color,
            opacity: 0.85,
            transform: [{ scaleY: anim }],
          }}
        />
      ))}
    </View>
  );
}

function MorphingBlob({ color, size = 160, opacity = 0.15 }: { color: string; size?: number; opacity?: number }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 2200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.9, duration: 2200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={{
      width: size, height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      opacity,
      transform: [{ scale: pulseAnim }],
    }} />
  );
}

function CircuitLines({ width: W2, height: H2 = 120, color = 'rgba(255,255,255,0.12)' }: { width: number; height?: number; color?: string }) {
  return (
    <Svg width={W2} height={H2} style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none">
      {/* Horizontal lines */}
      <Path d={`M 0 ${H2*0.3} H ${W2*0.3} V ${H2*0.7} H ${W2*0.6} V ${H2*0.4} H ${W2}`} stroke={color} strokeWidth="1" fill="none" />
      <Path d={`M 0 ${H2*0.7} H ${W2*0.4} V ${H2*0.5} H ${W2}`} stroke={color} strokeWidth="1" fill="none" />
      {/* Vertical bits */}
      <Path d={`M ${W2*0.3} 0 V ${H2*0.3}`} stroke={color} strokeWidth="1" fill="none" />
      <Path d={`M ${W2*0.6} ${H2*0.4} V ${H2}`} stroke={color} strokeWidth="1" fill="none" />
      {/* Nodes */}
      <Circle cx={W2*0.3} cy={H2*0.3} r={3} fill={color} />
      <Circle cx={W2*0.6} cy={H2*0.4} r={3} fill={color} />
      <Circle cx={W2*0.4} cy={H2*0.7} r={2} fill={color} />
      <Circle cx={W2*0.3} cy={H2*0.7} r={2} fill={color} />
    </Svg>
  );
}

function ScanBeam({ width: W2, height: H2 }: { width: number; height: number }) {
  const scanAnim = useRef(new Animated.Value(-2)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: H2 + 2, duration: 2400, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.timing(scanAnim, { toValue: -2, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0, right: 0,
        height: 2,
        backgroundColor: 'rgba(0,200,255,0.35)',
        shadowColor: '#00C8FF',
        shadowOpacity: 0.8,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        transform: [{ translateY: scanAnim }],
      }}
    />
  );
}

const { width: W } = Dimensions.get('window');

// ─── Brand Colors ─────────────────────────────────────────────────────────────
const BLUE = '#0055FF';
const PURPLE = '#7C3AED';
const TEAL = '#0EA5E9';
const GREEN = '#059669';
const AMBER = '#D97706';
const RED = '#DC2626';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'strategy',
    name: 'AI Strategy & Consulting',
    color: BLUE,
    gradient: ['#0D1B4B', '#0055FF'] as const,
    desc: 'We assess your digital maturity and build a custom AI roadmap tailored to your business goals and timeline.',
    tags: ['AI Roadmap', 'Digital Maturity', 'ROI Analysis'],
    iconType: 'chart',
  },
  {
    id: 'development',
    name: 'Custom AI Development',
    color: PURPLE,
    gradient: ['#2E1B5E', '#7C3AED'] as const,
    desc: 'Bespoke ML models, Arabic NLP systems and computer vision solutions built for Gulf enterprise requirements.',
    tags: ['ML Models', 'NLP Arabic', 'Computer Vision'],
    iconType: 'code',
  },
  {
    id: 'data',
    name: 'Data Engineering',
    color: GREEN,
    gradient: ['#064E3B', '#059669'] as const,
    desc: 'End-to-end data pipelines, lakes and real-time analytics to power your AI initiatives at enterprise scale.',
    tags: ['Data Lakes', 'Real-time Analytics', 'ETL/ELT'],
    iconType: 'database',
  },
  {
    id: 'integration',
    name: 'AI Integration',
    color: AMBER,
    gradient: ['#451A03', '#D97706'] as const,
    desc: 'Seamlessly connect AI capabilities to your existing ERP, legacy systems and API infrastructure.',
    tags: ['ERP Integration', 'API Layer', 'Legacy Modernisation'],
    iconType: 'connect',
  },
];

const ENGAGEMENT_MODELS = [
  {
    id: 'project',
    name: 'Project-Based',
    desc: 'Fixed scope, defined outcomes & milestones',
    range: 'AED 50K – 500K',
    color: BLUE,
    badge: null,
    gradient: ['#0D1B4B', '#0055FF'] as const,
  },
  {
    id: 'retainer',
    name: 'Retainer',
    desc: 'Ongoing AI partnership & advisory',
    range: 'AED 30K / month',
    color: PURPLE,
    badge: 'Most Popular',
    gradient: ['#2E1B5E', '#7C3AED'] as const,
  },
  {
    id: 'staff',
    name: 'Staff Augmentation',
    desc: 'Expert team extension, on-demand',
    range: 'AED 15K / resource',
    color: GREEN,
    badge: null,
    gradient: ['#064E3B', '#059669'] as const,
  },
];

const FREE_TOOLS = [
  { id: 'ai-chat', name: 'ChatGPT', sub: 'OpenAI', color: PURPLE, gradient: ['#2E1B5E', '#7C3AED'] as const, url: 'https://chatgpt.com' },
  { id: 'gemini', name: 'Gemini', sub: 'Google AI', color: BLUE, gradient: ['#0D1B4B', '#0055FF'] as const, url: 'https://gemini.google.com' },
  { id: 'huggingface', name: 'Hugging Face', sub: 'Open AI Models', color: AMBER, gradient: ['#451A03', '#D97706'] as const, url: 'https://huggingface.co' },
  { id: 'uaeai', name: 'UAE AI Office', sub: 'National Strategy', color: GREEN, gradient: ['#064E3B', '#059669'] as const, url: 'https://ai.gov.ae' },
  { id: 'perplexity', name: 'Perplexity AI', sub: 'AI Search', color: TEAL, gradient: ['#0C4A6E', '#0EA5E9'] as const, url: 'https://www.perplexity.ai' },
  { id: 'consultation', name: 'Book a Call', sub: 'With WeThink', color: RED, gradient: ['#450A0A', '#DC2626'] as const, url: 'mailto:info@wethink.ae' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function ChartIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M18 20V10M12 20V4M6 20V14" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2 20H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function CodeIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 4L10 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function DatabaseIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="5" rx="9" ry="3" stroke={color} strokeWidth="1.8" />
      <Path d="M3 5V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V5" stroke={color} strokeWidth="1.8" />
      <Path d="M3 12C3 13.66 7.03 15 12 15C16.97 15 21 13.66 21 12" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

function ConnectIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle cx="5" cy="6" r="3" stroke={color} strokeWidth="1.8" />
      <Circle cx="19" cy="6" r="3" stroke={color} strokeWidth="1.8" />
      <Circle cx="5" cy="18" r="3" stroke={color} strokeWidth="1.8" />
      <Circle cx="19" cy="18" r="3" stroke={color} strokeWidth="1.8" />
      <Path d="M8 6H16M8 18H16M5 9V15M19 9V15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function getServiceIcon(iconType: string, color: string) {
  switch (iconType) {
    case 'chart': return <ChartIcon color={color} />;
    case 'code': return <CodeIcon color={color} />;
    case 'database': return <DatabaseIcon color={color} />;
    case 'connect': return <ConnectIcon color={color} />;
    default: return null;
  }
}

function ArrowRightIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12H19M13 6L19 12L13 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ToolDiagonalArrow({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M7 17L17 7M7 7H17V17" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Service Card (animated left border reveal + slide up) ────────────────────

function ServiceCard({ service, index, colors }: { service: typeof SERVICES[0]; index: number; colors: any }) {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 110,
        useNativeDriver: true,
        damping: 15,
        stiffness: 110,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 110,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, damping: 14 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12 }).start();

  return (
    <Animated.View
      style={[
        styles.serviceCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: service.color,
          opacity,
          transform: [{ translateY }, { scale }],
          shadowColor: service.color,
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/tools/consultation' as any);
        }}
        activeOpacity={1}
      >
        <View style={styles.serviceCardTop}>
          <LinearGradient
            colors={service.gradient}
            style={styles.serviceIconWrap}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {getServiceIcon(service.iconType, '#fff')}
          </LinearGradient>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/tools/consultation' as any);
            }}
            style={styles.exploreBtn}
            activeOpacity={0.7}
          >
            <Text style={[styles.exploreText, { color: service.color }]}>Explore</Text>
            <ArrowRightIcon color={service.color} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
        <Text style={[styles.serviceDesc, { color: colors.textSecondary }]}>{service.desc}</Text>

        <View style={styles.tagsRow}>
          {service.tags.map(tag => (
            <View
              key={tag}
              style={[
                styles.tag,
                { backgroundColor: service.color + '15', borderColor: service.color + '40' },
              ]}
            >
              <Text style={[styles.tagText, { color: service.color }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Engagement Model Card ────────────────────────────────────────────────────

function EngagementCard({ model, colors }: { model: typeof ENGAGEMENT_MODELS[0]; colors: any }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, damping: 14 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/tools/consultation' as any);
        }}
        activeOpacity={1}
        style={[
          styles.engCard,
          {
            backgroundColor: colors.surface,
            borderColor: model.badge ? model.color + '80' : colors.border,
            shadowColor: model.badge ? model.color : colors.shadow,
          },
        ]}
      >
        {/* Gradient strip */}
        <LinearGradient
          colors={model.gradient}
          style={styles.engGradientStrip}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />

        {model.badge && (
          <View style={[styles.popularBadge, { backgroundColor: model.color }]}>
            <Text style={styles.popularBadgeText}>{model.badge}</Text>
          </View>
        )}

        <Text style={[styles.engName, { color: colors.text }]}>{model.name}</Text>
        <Text style={[styles.engDesc, { color: colors.textMuted }]}>{model.desc}</Text>
        <View style={styles.engRangeRow}>
          <View style={[styles.engRangeDot, { backgroundColor: model.color }]} />
          <Text style={[styles.engRange, { color: model.color }]}>{model.range}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Tool Card ────────────────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: typeof FREE_TOOLS[0] }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, damping: 15, stiffness: 300 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 250 }).start();

  const cardW = W - 48;

  return (
    <Animated.View style={[styles.toolCard, { width: cardW, transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Linking.openURL(tool.url);
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[styles.toolCardInner, {
          width: cardW,
          backgroundColor: '#0F172A',
          borderColor: tool.color + '40',
          borderWidth: 1,
          borderRadius: 16,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 14,
        }]}
      >
        <View style={{
          width: 40, height: 40, borderRadius: 12,
          backgroundColor: tool.color + '20',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tool.color }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.toolName, { color: '#fff' }]} numberOfLines={1}>{tool.name}</Text>
          <Text style={[styles.toolSub, { color: 'rgba(148,163,184,0.8)', marginTop: 2 }]} numberOfLines={1}>{tool.sub}</Text>
        </View>
        <ToolDiagonalArrow color={tool.color} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ServicesScreen() {
  const { colors } = useTheme();
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, useNativeDriver: true, damping: 16, stiffness: 120 }),
    ]).start();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Animated Header ── */}
        <Animated.View style={{ opacity: headerFade, transform: [{ translateY: headerSlide }] }}>
          <LinearGradient
            colors={['#0055FF', '#0EA5E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Svg style={StyleSheet.absoluteFill as any} width={W} height={180} pointerEvents="none">
              <Ellipse cx={W * 0.88} cy={30} rx={90} ry={90} fill="rgba(255,255,255,0.09)" />
              <Ellipse cx={W * 0.12} cy={150} rx={60} ry={60} fill="rgba(255,255,255,0.05)" />
              <Circle cx={W * 0.55} cy={-10} r={40} fill="rgba(255,255,255,0.06)" />
              <Circle cx={W * 0.3} cy={190} r={30} stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
            </Svg>
            <CircuitLines width={W} height={180} />
            {/* Morphing blobs */}
            <View style={{ position: 'absolute', top: -40, right: -40, overflow: 'hidden' }}>
              <MorphingBlob color={BLUE} size={140} opacity={0.12} />
            </View>
            <View style={{ position: 'absolute', bottom: -20, left: -20, overflow: 'hidden' }}>
              <MorphingBlob color={PURPLE} size={100} opacity={0.10} />
            </View>
            <View style={styles.headerInner}>
              <GlitchBadge text="ENTERPRISE SOLUTIONS" />
              <Text style={styles.headerTitle}>Our Solutions</Text>
              <Text style={styles.headerSubtitle}>
                AI-powered services built for enterprise scale across the Gulf
              </Text>
              <WaveformBar barCount={28} color="rgba(255,255,255,0.5)" height={32} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Service Cards ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>What We Build</Text>
          </View>
          <View style={styles.serviceList}>
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} colors={colors} />
            ))}
          </View>
        </View>

        {/* ── Engagement Models ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: PURPLE }]} />
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>How We Work</Text>
              <Text style={[styles.sectionSub, { color: colors.textMuted }]}>
                Flexible engagement models for every need
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.engRow}
          >
            {ENGAGEMENT_MODELS.map(m => (
              <EngagementCard key={m.id} model={m} colors={colors} />
            ))}
          </ScrollView>
        </View>

        {/* ── Free Tools ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: GREEN }]} />
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Try Free Tools</Text>
              <Text style={[styles.sectionSub, { color: colors.textMuted }]}>
                AI tools available right now — no sign-up required
              </Text>
            </View>
          </View>
          <View style={styles.toolGrid}>
            {FREE_TOOLS.map(t => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </View>
        </View>

        {/* ── Bottom CTA ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <LinearGradient
            colors={['#020818', '#0D1B4B', '#0055FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaBanner}
          >
            <Svg style={StyleSheet.absoluteFill as any} width={W - 48} height={120} pointerEvents="none">
              <Circle cx={W - 80} cy={60} r={80} fill="rgba(255,255,255,0.04)" />
              <Circle cx={20} cy={120} r={50} fill="rgba(255,255,255,0.03)" />
            </Svg>
            <Text style={styles.ctaTitle}>Start Your AI Journey</Text>
            <Text style={styles.ctaSub}>Book a free discovery call — get a custom proposal within 48 hours</Text>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/tools/consultation' as any);
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaBtnText}>Book Free Consultation</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },
  section: { marginTop: 28, paddingHorizontal: 24 },

  sectionTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  sectionAccent: { width: 4, height: 22, borderRadius: 2, marginTop: 2 },
  sectionTitle: { fontSize: 21, fontWeight: '900', letterSpacing: -0.5 },
  sectionSub: { fontSize: 12, fontWeight: '500', marginTop: 3 },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 36,
    overflow: 'hidden',
    minHeight: 180,
  },
  headerInner: { paddingHorizontal: 24, zIndex: 1 },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  headerBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  headerTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 8,
  },
  headerSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 20 },

  // Service Cards
  serviceList: { gap: 14 },
  serviceCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 18,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  serviceCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  serviceIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  exploreText: { fontSize: 14, fontWeight: '700' },
  serviceName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 7,
  },
  serviceDesc: { fontSize: 13.5, lineHeight: 20, marginBottom: 14 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },

  // Engagement Models
  engRow: { paddingBottom: 4, gap: 12 },
  engCard: {
    width: 170,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    paddingBottom: 18,
  },
  engGradientStrip: {
    height: 5,
    marginBottom: 14,
  },
  popularBadge: {
    position: 'absolute',
    top: 5,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 18,
  },
  popularBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  engName: { fontSize: 16, fontWeight: '900', letterSpacing: -0.3, marginBottom: 5, paddingHorizontal: 14 },
  engDesc: { fontSize: 12, lineHeight: 17, marginBottom: 14, paddingHorizontal: 14 },
  engRangeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14 },
  engRangeDot: { width: 7, height: 7, borderRadius: 3.5 },
  engRange: { fontSize: 13, fontWeight: '800' },

  // Tool Grid
  toolGrid: { flexDirection: 'column', gap: 10 },
  toolCard: {},
  toolCardInner: {},
  toolGradient: {
    height: 84,
    padding: 14,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  toolName: { fontSize: 14, fontWeight: '800', lineHeight: 17 },
  toolSub: { fontSize: 11, fontWeight: '500' },
  toolArrowWrap: { position: 'absolute', top: 10, right: 10 },

  // CTA
  ctaBanner: { borderRadius: 24, padding: 26, overflow: 'hidden', gap: 6 },
  ctaTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  ctaSub: { color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  ctaBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 22,
    paddingVertical: 12,
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  ctaBtnText: { color: BLUE, fontSize: 14, fontWeight: '800' },
});
