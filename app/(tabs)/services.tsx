import React, { useRef, useEffect, useState } from 'react';
import {
  Animated, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Dimensions, Platform, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'strategy',
    name: 'AI Strategy & Consulting',
    color: '#0055FF',
    gradient: ['#0D1B4B', '#0055FF'] as const,
    desc: 'We assess your readiness and build a custom AI roadmap tailored to your business goals.',
    tags: ['AI Roadmap', 'Digital Maturity', 'ROI Analysis'],
    iconType: 'chart',
  },
  {
    id: 'development',
    name: 'Custom AI Development',
    color: '#7C3AED',
    gradient: ['#2E1B5E', '#7C3AED'] as const,
    desc: 'Bespoke ML models, NLP systems and computer vision solutions built for your enterprise.',
    tags: ['Machine Learning', 'NLP Arabic', 'Computer Vision'],
    iconType: 'code',
  },
  {
    id: 'data',
    name: 'Data Engineering',
    color: '#059669',
    gradient: ['#064E3B', '#059669'] as const,
    desc: 'End-to-end data pipelines, lakes and real-time analytics to power your AI initiatives.',
    tags: ['Data Lake', 'Real-time', 'ETL/ELT'],
    iconType: 'database',
  },
  {
    id: 'integration',
    name: 'AI Integration',
    color: '#D97706',
    gradient: ['#451A03', '#D97706'] as const,
    desc: 'Connect AI capabilities to your existing enterprise systems with minimal disruption.',
    tags: ['ERP Integration', 'API Layer', 'Legacy Modernisation'],
    iconType: 'connect',
  },
];

const ENGAGEMENT_MODELS = [
  {
    id: 'project',
    name: 'Project-Based',
    desc: 'Fixed scope, defined outcomes',
    range: 'AED 50K – 500K',
    color: '#0055FF',
    badge: null,
  },
  {
    id: 'retainer',
    name: 'Retainer',
    desc: 'Ongoing AI partnership',
    range: 'AED 30K / month',
    color: '#7C3AED',
    badge: 'Most Popular',
  },
  {
    id: 'staff',
    name: 'Staff Augmentation',
    desc: 'Expert team extension',
    range: 'AED 15K / resource',
    color: '#059669',
    badge: null,
  },
];

const FREE_TOOLS = [
  { id: 'ai-chat', name: 'AI Assistant', color: '#7C3AED', gradient: ['#2E1B5E', '#7C3AED'] as const },
  { id: 'cost-estimator', name: 'Cost Estimator', color: '#059669', gradient: ['#064E3B', '#059669'] as const },
  { id: 'roi-calculator', name: 'ROI Calculator', color: '#D97706', gradient: ['#451A03', '#D97706'] as const },
  { id: 'quiz', name: 'Readiness Quiz', color: '#0055FF', gradient: ['#0D1B4B', '#0055FF'] as const },
  { id: 'project-tracker', name: 'Project Tracker', color: '#DC2626', gradient: ['#450A0A', '#DC2626'] as const },
  { id: 'consultation', name: 'Book a Call', color: '#0EA5E9', gradient: ['#0C4A6E', '#0EA5E9'] as const },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function ChartIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M18 20V10M12 20V4M6 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CodeIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function ArrowIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12H19M13 6L19 12L13 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ToolArrowIcon({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M7 17L17 7M7 7H17V17" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, index, colors }: { service: typeof SERVICES[0]; index: number; colors: any }) {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, delay: index * 100, useNativeDriver: true, damping: 15, stiffness: 120 }),
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: service.color, opacity, transform: [{ translateY }] }]}>
      {/* Icon area */}
      <View style={styles.serviceCardHeader}>
        <LinearGradient colors={service.gradient} style={styles.serviceIconWrap} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
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
          <ArrowIcon color={service.color} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
      <Text style={[styles.serviceDesc, { color: colors.textSecondary }]}>{service.desc}</Text>

      {/* Capability tags */}
      <View style={styles.tagsRow}>
        {service.tags.map(tag => (
          <View key={tag} style={[styles.tag, { backgroundColor: service.color + '15', borderColor: service.color + '40' }]}>
            <Text style={[styles.tagText, { color: service.color }]}>{tag}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── Engagement Model Card ────────────────────────────────────────────────────
function EngagementCard({ model, colors }: { model: typeof ENGAGEMENT_MODELS[0]; colors: any }) {
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/tools/consultation' as any); }}
      activeOpacity={0.85}
      style={[styles.engCard, { backgroundColor: colors.surface, borderColor: model.badge ? model.color : colors.border }]}
    >
      {model.badge && (
        <View style={[styles.popularBadge, { backgroundColor: model.color }]}>
          <Text style={styles.popularBadgeText}>{model.badge}</Text>
        </View>
      )}
      <View style={[styles.engDot, { backgroundColor: model.color }]} />
      <Text style={[styles.engName, { color: colors.text }]}>{model.name}</Text>
      <Text style={[styles.engDesc, { color: colors.textMuted }]}>{model.desc}</Text>
      <Text style={[styles.engRange, { color: model.color }]}>{model.range}</Text>
    </TouchableOpacity>
  );
}

// ─── Tool Card ────────────────────────────────────────────────────────────────
function ToolCard({ tool }: { tool: typeof FREE_TOOLS[0] }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, damping: 15, stiffness: 300 }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 250 }).start();

  return (
    <Animated.View style={[styles.toolCard, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push(('/tools/' + tool.id) as any); }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.toolCardInner}
      >
        <LinearGradient colors={tool.gradient} style={styles.toolGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Svg style={StyleSheet.absoluteFill as any} width={(W - 72) / 2} height={76} pointerEvents="none">
            <Circle cx={(W - 72) / 2} cy={0} r={50} fill="rgba(255,255,255,0.06)" />
          </Svg>
          <Text style={styles.toolName} numberOfLines={2}>{tool.name}</Text>
          <View style={styles.toolArrow}>
            <ToolArrowIcon color="rgba(255,255,255,0.9)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ServicesScreen() {
  const { colors } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ── */}
        <Animated.View style={{ opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}>
          <LinearGradient colors={['#0055FF', '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
            <Svg style={StyleSheet.absoluteFill as any} width={W} height={160} pointerEvents="none">
              <Ellipse cx={W * 0.85} cy={30} rx={80} ry={80} fill="rgba(255,255,255,0.08)" />
              <Circle cx={W * 0.1} cy={130} r={50} fill="rgba(255,255,255,0.05)" />
            </Svg>
            <View style={styles.headerInner}>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>Enterprise Solutions</Text>
              </View>
              <Text style={styles.headerTitle}>Our Solutions</Text>
              <Text style={styles.headerSubtitle}>AI-powered services built for enterprise scale</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Service Cards ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What We Build</Text>
          <View style={styles.serviceList}>
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} colors={colors} />
            ))}
          </View>
        </View>

        {/* ── Engagement Models ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Engagement Models</Text>
          <Text style={[styles.sectionSub, { color: colors.textMuted }]}>How clients work with WeThink</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.engRow}>
            {ENGAGEMENT_MODELS.map(m => (
              <EngagementCard key={m.id} model={m} colors={colors} />
            ))}
          </ScrollView>
        </View>

        {/* ── Free Tools ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Try Our Free Tools</Text>
          <Text style={[styles.sectionSub, { color: colors.textMuted }]}>AI-powered tools available right now</Text>
          <View style={styles.toolGrid}>
            {FREE_TOOLS.map(t => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </View>
        </View>

        {/* ── CTA ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <LinearGradient colors={['#020818', '#0055FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaBanner}>
            <Svg style={StyleSheet.absoluteFill as any} width={W - 48} height={110} pointerEvents="none">
              <Circle cx={W - 60} cy={55} r={70} fill="rgba(255,255,255,0.04)" />
            </Svg>
            <Text style={styles.ctaTitle}>Custom solution needed?</Text>
            <Text style={styles.ctaSub}>Book a free 30-min discovery call with our team</Text>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/tools/consultation' as any); }}
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
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  sectionSub: { fontSize: 13, fontWeight: '500', marginBottom: 16 },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 32,
    overflow: 'hidden',
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
  headerTitle: { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1, lineHeight: 38, marginBottom: 8 },
  headerSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 20 },

  // Service cards
  serviceList: { gap: 14, marginTop: 16 },
  serviceCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  serviceCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  serviceIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  exploreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  exploreText: { fontSize: 14, fontWeight: '700' },
  serviceName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, marginBottom: 6 },
  serviceDesc: { fontSize: 13, lineHeight: 19, marginBottom: 14 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },

  // Engagement models
  engRow: { paddingBottom: 4, gap: 12 },
  engCard: {
    width: 170,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  popularBadge: { position: 'absolute', top: 0, right: 0, paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 12 },
  popularBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  engDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 12 },
  engName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2, marginBottom: 4 },
  engDesc: { fontSize: 12, lineHeight: 17, marginBottom: 12 },
  engRange: { fontSize: 13, fontWeight: '700' },

  // Tool grid
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  toolCard: { width: (W - 72) / 2 },
  toolCardInner: { borderRadius: 16, overflow: 'hidden' },
  toolGradient: { height: 76, padding: 14, overflow: 'hidden', justifyContent: 'flex-end' },
  toolName: { color: '#fff', fontSize: 13, fontWeight: '800', lineHeight: 17 },
  toolArrow: { position: 'absolute', top: 10, right: 10 },

  // CTA
  ctaBanner: { borderRadius: 22, padding: 24, overflow: 'hidden', gap: 6 },
  ctaTitle: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  ctaSub: { color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  ctaBtn: { alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 11 },
  ctaBtnText: { color: '#0055FF', fontSize: 14, fontWeight: '800' },
});
