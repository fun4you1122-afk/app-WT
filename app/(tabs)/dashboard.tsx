import React, { useRef, useEffect, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - 48 - 12) / 2;

const STATS = [
  { value: '247', label: 'Active Projects', trend: '+12%', color: '#0055FF', bg: '#E8EFFE', trendUp: true },
  { value: '38', label: 'AI Models', trend: '+5', color: '#7C3AED', bg: '#EDE9FE', trendUp: true },
  { value: '4.2B', label: 'Revenue AED', trend: '+18%', color: '#059669', bg: '#D1FAE5', trendUp: true },
  { value: '180+', label: 'Enterprise Clients', trend: '+22', color: '#D97706', bg: '#FEF3C7', trendUp: true },
];

const QUICK_ACTIONS = [
  { label: 'Book Demo', icon: '📅', color: '#0055FF', bg: '#E8EFFE' },
  { label: 'AI Chat', icon: '🤖', color: '#7C3AED', bg: '#EDE9FE' },
  { label: 'Services', icon: '⚡', color: '#059669', bg: '#D1FAE5' },
  { label: 'Case Studies', icon: '📊', color: '#D97706', bg: '#FEF3C7' },
];

const PROJECTS = [
  { name: 'Emirates NBD Fraud AI', client: 'Emirates NBD', status: 'Live', statusColor: '#059669', progress: 100, color: '#059669' },
  { name: 'Dubai Smart City Platform', client: 'Dubai Municipality', status: 'Active', statusColor: '#0055FF', progress: 78, color: '#0055FF' },
  { name: 'ADNOC Predictive Maintenance', client: 'ADNOC', status: 'In Progress', statusColor: '#D97706', progress: 45, color: '#D97706' },
];

const ACTIVITIES = [
  { icon: '✅', text: 'Emirates NBD deployment completed', time: '2h ago' },
  { icon: '🚀', text: 'New AI model v3.2 deployed', time: '5h ago' },
  { icon: '📋', text: 'Etisalat proposal submitted', time: '1d ago' },
  { icon: '🤝', text: 'DEWA partnership signed', time: '2d ago' },
  { icon: '📈', text: 'Q2 revenue target exceeded', time: '3d ago' },
];

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
    Animated.sequence([
      Animated.delay(index * 80 + 500),
      Animated.timing(widthAnim, { toValue: 100, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statCard, { opacity, transform: [{ scale }], backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <View style={[styles.statIconBg, { backgroundColor: stat.bg }]}>
        <View style={[styles.statDot, { backgroundColor: stat.color }]} />
      </View>
      <Text style={[styles.statValue, { color: stat.color }]} numberOfLines={1}>{stat.value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]} numberOfLines={1}>{stat.label}</Text>
      <View style={styles.statTrendRow}>
        <Text style={[styles.statTrend, { color: stat.trendUp ? '#059669' : '#DC2626' }]}>↑ {stat.trend}</Text>
      </View>
    </Animated.View>
  );
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  const { colors } = useTheme();
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(widthAnim, { toValue: project.progress, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, []);
  const animWidth = widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.projectCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <View style={[styles.projectBorder, { backgroundColor: project.color }]} />
      <View style={styles.projectContent}>
        <View style={styles.projectHeader}>
          <Text style={[styles.projectName, { color: colors.text }]} numberOfLines={1}>{project.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: project.statusColor + '18' }]}>
            <Text style={[styles.statusText, { color: project.statusColor }]}>{project.status}</Text>
          </View>
        </View>
        <Text style={[styles.projectClient, { color: colors.textSecondary }]}>{project.client}</Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.borderLight }]}>
          <Animated.View style={[styles.progressBar, { width: animWidth, backgroundColor: project.color }]} />
        </View>
        <Text style={[styles.progressLabel, { color: project.color }]}>{project.progress}% complete</Text>
      </View>
    </View>
  );
}

export default function Dashboard() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(headerY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scroll}
      >

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting},</Text>
            <Text style={[styles.userName, { color: colors.text }]}>Rasha 👋</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/notifications');
              }}
            >
              <Text style={{ fontSize: 20 }}>🔔</Text>
              <View style={[styles.notifDot, { borderColor: colors.surface }]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/settings');
              }}
            >
              <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.avatarGrad}>
                <Text style={styles.avatarText}>A</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Status */}
        <View style={[styles.statusBar, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          <View style={styles.statusDot} />
          <Text style={[styles.statusText2, { color: colors.textSecondary }]}>All Systems Operational</Text>
          <View style={[styles.statusDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.statusText2, { color: colors.primary, fontWeight: '600' }]}>99.9% Uptime</Text>
        </View>

        {/* Stats */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickScroll}
          contentContainerStyle={{ gap: 10, paddingRight: 24 }}
        >
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.quickCard, { backgroundColor: a.bg }]}
              onPress={() => {
                if (a.label === 'AI Chat') router.push('/(tabs)/chat');
                else if (a.label === 'Services') router.push('/(tabs)/services');
              }}
            >
              <Text style={{ fontSize: 22 }}>{a.icon}</Text>
              <Text style={[styles.quickLabel, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Projects */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Projects</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/portfolio')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 10 }}>
          {PROJECTS.map((p, i) => <ProjectCard key={i} project={p} />)}
        </View>

        {/* Activity Feed */}
        <Text style={[styles.sectionTitle, { marginTop: 24, color: colors.text }]}>Recent Activity</Text>
        <View style={[styles.activityCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          {ACTIVITIES.map((a, i) => (
            <View key={i} style={[styles.activityRow, i < ACTIVITIES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}>
              <Text style={{ fontSize: 18 }}>{a.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.activityText, { color: colors.text }]} numberOfLines={1}>{a.text}</Text>
                <Text style={[styles.activityTime, { color: colors.textMuted }]}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 56 : 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  greeting: { fontSize: 14, fontWeight: '400' },
  userName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626', borderWidth: 1.5 },
  avatar: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden' },
  avatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  statusBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 24, gap: 8, shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669' },
  statusText2: { fontSize: 13, fontWeight: '500' },
  statusDivider: { width: 1, height: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 24 },
  seeAll: { fontSize: 13, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { width: CARD_W, height: 110, borderRadius: 16, padding: 14, justifyContent: 'space-between', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  statIconBg: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statDot: { width: 10, height: 10, borderRadius: 5 },
  statValue: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  statTrendRow: { flexDirection: 'row' },
  statTrend: { fontSize: 11, fontWeight: '600' },
  quickScroll: { marginBottom: 0 },
  quickCard: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, alignItems: 'center', gap: 6, minWidth: 84 },
  quickLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  projectCard: { borderRadius: 14, flexDirection: 'row', overflow: 'hidden', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  projectBorder: { width: 4 },
  projectContent: { flex: 1, padding: 14, gap: 4 },
  projectHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  projectName: { fontSize: 14, fontWeight: '600', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '600' },
  projectClient: { fontSize: 12 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 2 },
  progressLabel: { fontSize: 11, fontWeight: '500' },
  activityCard: { borderRadius: 16, overflow: 'hidden', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  activityText: { fontSize: 13, fontWeight: '500' },
  activityTime: { fontSize: 11, marginTop: 1 },
});
