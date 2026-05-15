import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Svg, { Circle, Polyline } from 'react-native-svg';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import StatCard from '../../components/StatCard';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing, Radius } from '../../constants/Theme';

const { width: W } = Dimensions.get('window');

const STATS = [
  { value: '247', label: 'Active Projects', icon: '⚡', trend: 'up' as const, trendValue: '+12%', glowColor: Colors.neonBlue, delay: 100 },
  { value: '38', label: 'AI Models', icon: '🧠', trend: 'up' as const, trendValue: '+5', glowColor: Colors.neonPurple, delay: 200 },
  { value: '4.2M', label: 'Revenue AED', icon: '◈', trend: 'up' as const, trendValue: '+18%', glowColor: Colors.success, delay: 300 },
  { value: '180+', label: 'Enterprise Clients', icon: '◉', trend: 'up' as const, trendValue: '+22', glowColor: Colors.neonCyan, delay: 400 },
];

const ACTIVITIES = [
  { time: '2m ago', action: 'AI Model deployed', detail: 'NLP Engine v3.2 → Production', color: Colors.neonBlue },
  { time: '14m ago', action: 'Client onboarded', detail: 'Emirates NBD — Digital Transformation', color: Colors.success },
  { time: '1h ago', action: 'Sprint completed', detail: 'Smart City Analytics — Phase 2', color: Colors.neonPurple },
  { time: '3h ago', action: 'Report generated', detail: 'Q4 AI Performance Report', color: Colors.neonCyan },
  { time: '5h ago', action: 'Integration live', detail: 'Dubai Government API — Connected', color: Colors.warning },
];

const QUICK_ACTIONS = [
  { icon: '⚡', label: 'New Project', color: Colors.neonBlue },
  { icon: '🤖', label: 'AI Studio', color: Colors.neonPurple },
  { icon: '📊', label: 'Analytics', color: Colors.success, onPress: '/(tabs)/analytics' },
  { icon: '💬', label: 'AI Chat', color: Colors.neonPink, onPress: '/(tabs)/chat' },
];

function MiniChart({ color }: { color: string }) {
  const data = [30, 55, 40, 70, 60, 85, 75, 90, 80, 95];
  const w = W - 80, h = 60;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / 100) * h}`).join(' ');
  return (
    <Svg width={w} height={h}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <Circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (v / 100) * h} r={i === data.length - 1 ? 4 : 2} fill={color} opacity={i === data.length - 1 ? 1 : 0.4} />
      ))}
    </Svg>
  );
}

function PulsingDot({ color }: { color: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.8, duration: 800, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
    ])).start();
  }, []);
  return <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, transform: [{ scale }], opacity }} />;
}

export default function DashboardScreen() {
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(headerY, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.headerTitle}>
              <Text style={{ color: Colors.neonBlue }}>We</Text>
              <Text>Think</Text>
              <Text style={styles.headerDot}> ·</Text>
              <Text style={styles.headerSub}> ae</Text>
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>3</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/settings')}>
              <LinearGradient colors={[Colors.neonBlue, Colors.electricBlue]} style={styles.avatarGradient}>
                <Text style={styles.avatarText}>W</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Status Banner */}
        <GlassCard style={styles.statusBanner} glowColor={Colors.success} delay={50}>
          <View style={styles.statusInner}>
            <PulsingDot color={Colors.success} />
            <Text style={styles.statusText}>All Systems Operational  •  99.9% Uptime</Text>
            <Text style={[styles.statusBadge, { color: Colors.success }]}>LIVE</Text>
          </View>
        </GlassCard>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <View key={i} style={styles.statItem}><StatCard {...stat} /></View>
          ))}
        </View>

        {/* Performance Chart */}
        <GlassCard style={styles.chartCard} glowColor={Colors.neonBlue} delay={500}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>AI Performance</Text>
            <View style={[styles.liveBadge, { backgroundColor: `${Colors.success}20`, borderColor: `${Colors.success}30` }]}>
              <PulsingDot color={Colors.success} />
              <Text style={[styles.liveText, { color: Colors.success }]}>Live</Text>
            </View>
          </View>
          <Text style={styles.chartValue}>95.2%<Text style={styles.chartUnit}> accuracy</Text></Text>
          <View style={styles.chartArea}><MiniChart color={Colors.neonBlue} /></View>
          <View style={styles.chartMeta}>
            {['1D', '1W', '1M', '3M', 'YTD'].map((p, i) => (
              <TouchableOpacity key={p} style={[styles.periodBtn, i === 1 && { backgroundColor: `${Colors.neonBlue}20`, borderColor: `${Colors.neonBlue}30` }]}>
                <Text style={[styles.periodText, i === 1 && { color: Colors.neonBlue }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionItem} onPress={() => action.onPress && router.push(action.onPress as any)} activeOpacity={0.8}>
              <LinearGradient colors={[`${action.color}20`, `${action.color}08`]} style={styles.actionGradient}>
                <View style={[styles.actionIconWrap, { backgroundColor: `${action.color}20`, borderColor: `${action.color}30` }]}>
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity Feed */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <GlassCard style={styles.activityCard} glowColor={Colors.neonPurple} delay={600}>
          {ACTIVITIES.map((item, i) => (
            <View key={i} style={[styles.activityItem, i < ACTIVITIES.length - 1 && styles.activityDivider]}>
              <View style={[styles.activityDot, { backgroundColor: `${item.color}25`, borderColor: item.color }]}>
                <Text style={{ fontSize: 8, color: item.color }}>●</Text>
              </View>
              <View style={styles.activityContent}>
                <View style={styles.activityRow}>
                  <Text style={styles.activityAction}>{item.action}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
                <Text style={styles.activityDetail}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { ...Typography.bodySM, color: Colors.textMuted, marginBottom: 2 },
  headerTitle: { ...Typography.displayMD, color: Colors.white, fontWeight: '800' },
  headerDot: { color: Colors.neonBlue },
  headerSub: { fontSize: 16, color: Colors.textMuted, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  notifIcon: { fontSize: 18 },
  notifBadge: { position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { fontSize: 8, color: Colors.white, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  avatarGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: Colors.white },
  statusBanner: { marginBottom: Spacing.lg, padding: Spacing.md },
  statusInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusText: { ...Typography.bodyMD, color: Colors.textSecondary, flex: 1 },
  statusBadge: { ...Typography.caption, fontWeight: '700', letterSpacing: 1 },
  sectionTitle: { ...Typography.headingSM, color: Colors.textSecondary, marginBottom: Spacing.md, marginTop: Spacing.md, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: 11 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  statItem: { width: (W - Spacing.md * 2 - Spacing.sm) / 2 },
  chartCard: { padding: Spacing.lg, marginBottom: Spacing.md },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { ...Typography.headingSM, color: Colors.textPrimary },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  liveText: { ...Typography.caption, fontWeight: '600' },
  chartValue: { ...Typography.displayMD, color: Colors.neonBlue, fontWeight: '700', marginBottom: 16, textShadowColor: Colors.neonBlue, textShadowRadius: 10 },
  chartUnit: { fontSize: 14, color: Colors.textMuted, fontWeight: '400' },
  chartArea: { marginBottom: 12 },
  chartMeta: { flexDirection: 'row', gap: 8 },
  periodBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: 'transparent' },
  periodText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  actionItem: { width: (W - Spacing.md * 2 - Spacing.sm) / 2, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  actionGradient: { padding: Spacing.md, alignItems: 'flex-start' },
  actionIconWrap: { width: 44, height: 44, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionIcon: { fontSize: 22 },
  actionLabel: { ...Typography.bodyMD, color: Colors.textPrimary, fontWeight: '600' },
  activityCard: { padding: Spacing.md, marginBottom: Spacing.md },
  activityItem: { flexDirection: 'row', gap: 12, paddingVertical: 10 },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  activityDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  activityContent: { flex: 1 },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  activityAction: { ...Typography.bodyMD, color: Colors.textPrimary, fontWeight: '600', flex: 1 },
  activityTime: { ...Typography.caption, color: Colors.textMuted },
  activityDetail: { ...Typography.bodySM, color: Colors.textSecondary },
});
