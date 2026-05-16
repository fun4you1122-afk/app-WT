import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Animated, Easing, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const STATUS_COLORS: Record<string, string> = {
  Completed: '#059669',
  Active: '#0055FF',
  Review: '#7C3AED',
  'On Hold': '#DC2626',
};

const PROJECTS = [
  { name: 'Emirates NBD AI Fraud Detection', client: 'Emirates NBD', status: 'Completed', progress: 100, team: ['AK', 'SR', 'MF'], due: 'Dec 2025', color: '#059669' },
  { name: 'Dubai Smart City Dashboard', client: 'Dubai Municipality', status: 'Active', progress: 78, team: ['PS', 'JC'], due: 'Feb 2026', color: '#0055FF' },
  { name: 'ADNOC Predictive Maintenance', client: 'ADNOC', status: 'Active', progress: 45, team: ['AK', 'MF', 'RA'], due: 'Apr 2026', color: '#D97706' },
  { name: 'Etisalat Customer AI', client: 'Etisalat', status: 'Review', progress: 90, team: ['SR', 'JC'], due: 'Jan 2026', color: '#7C3AED' },
  { name: 'DEWA Energy Analytics', client: 'DEWA', status: 'Active', progress: 30, team: ['PS', 'AK'], due: 'Jun 2026', color: '#0EA5E9' },
  { name: 'RTA Autonomous Fleet AI', client: 'RTA Dubai', status: 'On Hold', progress: 15, team: ['MF', 'RA'], due: 'TBD', color: '#DC2626' },
];

const AVATAR_COLORS = ['#7C3AED', '#0055FF', '#059669', '#D97706', '#DC2626', '#0EA5E9'];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { colors } = useTheme();
  const barAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.timing(cardAnim, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
        Animated.timing(barAnim, { toValue: project.progress, duration: 900 + index * 80, useNativeDriver: false, easing: Easing.out(Easing.cubic) }),
      ]),
    ]).start();
  }, []);

  const barWidth = barAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const statusColor = STATUS_COLORS[project.status] ?? '#94A3B8';

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.surface, opacity: cardAnim, transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
      <View style={[styles.cardAccent, { backgroundColor: project.color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.projectName, { color: colors.text }]} numberOfLines={1}>{project.name}</Text>
            <Text style={[styles.clientName, { color: colors.textMuted }]}>{project.client}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{project.status}</Text>
          </View>
        </View>

        <View style={[styles.barTrack, { backgroundColor: colors.borderLight }]}>
          <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: project.color }]} />
        </View>
        <Text style={[styles.progressLabel, { color: project.color }]}>{project.progress}% complete</Text>

        <View style={styles.footer}>
          <View style={styles.teamRow}>
            {project.team.map((initials, i) => (
              <View key={i} style={[styles.avatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length], marginLeft: i > 0 ? -8 : 0 }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.due, { color: colors.textMuted }]}>📅 {project.due}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function ProjectTrackerScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const FILTERS = ['All', 'Active', 'Review', 'Completed', 'On Hold'];

  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.status === filter);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#0055FF', '#0EA5E9']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Tracker</Text>
        <Text style={styles.headerSub}>{PROJECTS.length} active engagements</Text>
      </LinearGradient>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} onPress={() => { setFilter(f); Haptics.selectionAsync(); }}
            style={[styles.filterBtn, { backgroundColor: filter === f ? colors.primary : 'transparent' }]}>
            <Text style={[styles.filterText, { color: filter === f ? '#fff' : colors.textMuted }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Total', count: PROJECTS.length, color: colors.primary },
            { label: 'Active', count: PROJECTS.filter(p => p.status === 'Active').length, color: '#0055FF' },
            { label: 'Done', count: PROJECTS.filter(p => p.status === 'Completed').length, color: '#059669' },
          ].map((s, i) => (
            <View key={i} style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.summaryCount, { color: s.color }]}>{s.count}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {filtered.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
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
  filterBar: { borderBottomWidth: 1 },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '600' },
  scroll: { padding: 16, gap: 12 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  summaryCount: { fontSize: 28, fontWeight: '800' },
  summaryLabel: { fontSize: 12, fontWeight: '500' },
  card: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 14, gap: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  projectName: { fontSize: 14, fontWeight: '700' },
  clientName: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  barTrack: { height: 5, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 11, fontWeight: '600' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  avatarText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  due: { fontSize: 12 },
});
