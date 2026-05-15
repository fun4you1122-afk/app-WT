import React, { useState, useRef, useEffect } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const FILTERS = ['All', 'Finance', 'Government', 'Energy', 'Retail', 'Healthcare'];

const PROJECTS = [
  { name: 'Fraud Detection Platform', client: 'Emirates NBD', industry: 'Finance', status: 'Live', color: '#059669', impact: '94% fraud reduction', metric: '$2.4B protected', completion: 100 },
  { name: 'Smart City Command Center', client: 'Dubai Municipality', industry: 'Government', status: 'Live', color: '#0055FF', impact: '2,000+ IoT sensors', metric: '40% efficiency gain', completion: 100 },
  { name: 'Predictive Maintenance AI', client: 'ADNOC', industry: 'Energy', status: 'Active', color: '#D97706', impact: '78% downtime reduction', metric: 'AED 180M saved/yr', completion: 85 },
  { name: 'Customer Intelligence', client: 'Noon.com', industry: 'Retail', status: 'Active', color: '#7C3AED', impact: '3x recommendation accuracy', metric: '+30% revenue lift', completion: 72 },
  { name: 'Network Optimization AI', client: 'Etisalat by e&', industry: 'Retail', status: 'In Progress', color: '#0EA5E9', impact: '60% ticket reduction', metric: '99.97% uptime', completion: 55 },
  { name: 'Clinical Decision Support', client: 'Cleveland Clinic Abu Dhabi', industry: 'Healthcare', status: 'In Progress', color: '#DC2626', impact: '42% faster diagnosis', metric: '15,000+ patients', completion: 40 },
  { name: 'Digital Oilfield Platform', client: 'DEWA', industry: 'Energy', status: 'Completed', color: '#059669', impact: 'AED 500M efficiency', metric: '300+ wells monitored', completion: 100 },
  { name: 'Retail Analytics Suite', client: 'Majid Al Futtaim', industry: 'Retail', status: 'Live', color: '#6366F1', impact: '28% inventory reduction', metric: '25 malls covered', completion: 100 },
];

const STATUS_COLORS: Record<string, string> = {
  'Live': '#059669',
  'Active': '#0055FF',
  'In Progress': '#D97706',
  'Completed': '#64748B',
};

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 60),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
    Animated.sequence([
      Animated.delay(index * 60 + 500),
      Animated.timing(widthAnim, { toValue: project.completion, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, []);

  const barWidth = widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const statusColor = STATUS_COLORS[project.status] || '#64748B';

  return (
    <Animated.View style={[styles.projectCard, { opacity, transform: [{ translateY }], backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <View style={[styles.projectAccent, { backgroundColor: project.color }]} />
      <View style={styles.projectBody}>
        <View style={styles.projectTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.projectName, { color: colors.text }]} numberOfLines={2}>{project.name}</Text>
            <Text style={[styles.projectClient, { color: colors.textSecondary }]} numberOfLines={1}>{project.client}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{project.status}</Text>
          </View>
        </View>
        <View style={[styles.industryTag, { backgroundColor: project.color + '14' }]}>
          <Text style={[styles.industryText, { color: project.color }]}>{project.industry}</Text>
        </View>
        <Text style={[styles.impactText, { color: colors.text }]} numberOfLines={1}>✦ {project.impact}</Text>
        <Text style={[styles.metricText, { color: colors.textSecondary }]} numberOfLines={1}>{project.metric}</Text>
        <View style={styles.progressSection}>
          <View style={[styles.progressTrack, { backgroundColor: colors.borderLight }]}>
            <Animated.View style={[styles.progressBar, { width: barWidth, backgroundColor: project.color }]} />
          </View>
          <Text style={[styles.progressLabel, { color: project.color }]}>{project.completion}%</Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.viewCase, { color: project.color }]}>View Case Study →</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function PortfolioScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.industry === filter);

  const switchFilter = (f: string) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
      setFilter(f);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Portfolio</Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>32 successful projects across UAE &amp; GCC</Text>
          </View>
        </View>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ gap: 8, paddingRight: 24 }}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => switchFilter(f)}
              style={[
                styles.filterTab,
                { backgroundColor: colors.surface, borderColor: colors.border },
                filter === f && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={[
                styles.filterText,
                { color: colors.textSecondary },
                filter === f && { color: '#FFFFFF', fontWeight: '600' },
              ]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured project */}
        <LinearGradient colors={['#0055FF', '#003ECC']} style={styles.featuredCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>⭐ Flagship Project</Text>
          </View>
          <Text style={styles.featuredTitle}>Emirates NBD{'\n'}AI Fraud Detection</Text>
          <Text style={styles.featuredDesc}>World-class real-time fraud detection processing 2M+ transactions daily with 94% accuracy.</Text>
          <View style={styles.featuredMetrics}>
            {[['94%', 'Accuracy'], ['$2.4B', 'Protected'], ['2M+', 'Daily TXNs']].map(([val, lbl]) => (
              <View key={lbl} style={styles.featuredMetric}>
                <Text style={styles.featuredMetricVal}>{val}</Text>
                <Text style={styles.featuredMetricLbl}>{lbl}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Projects */}
        <Animated.View style={{ opacity: fadeAnim, gap: 12 }}>
          {filtered.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
        </Animated.View>

        {/* Stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          {[['180+', 'Clients'], ['12', 'Countries'], ['98%', 'Success Rate'], ['5★', 'Rating']].map(([val, lbl]) => (
            <View key={lbl} style={styles.statItem}>
              <Text style={[styles.statVal, { color: colors.primary }]}>{val}</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>{lbl}</Text>
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
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, marginTop: 2 },
  filterScroll: { marginBottom: 20 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '500' },
  featuredCard: { borderRadius: 20, padding: 22, marginBottom: 20 },
  featuredBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  featuredBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  featuredTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, lineHeight: 28 },
  featuredDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 16 },
  featuredMetrics: { flexDirection: 'row', gap: 24 },
  featuredMetric: { alignItems: 'center' },
  featuredMetricVal: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  featuredMetricLbl: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  projectCard: { borderRadius: 16, flexDirection: 'row', overflow: 'hidden', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  projectAccent: { width: 4 },
  projectBody: { flex: 1, padding: 14, gap: 6 },
  projectTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  projectName: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  projectClient: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexShrink: 0 },
  statusText: { fontSize: 10, fontWeight: '700' },
  industryTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  industryText: { fontSize: 10, fontWeight: '600' },
  impactText: { fontSize: 12, fontWeight: '600' },
  metricText: { fontSize: 12 },
  progressSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressTrack: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 2 },
  progressLabel: { fontSize: 11, fontWeight: '700', minWidth: 30, textAlign: 'right' },
  viewCase: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  statsRow: { marginTop: 24, borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-around', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '800' },
  statLbl: { fontSize: 11, marginTop: 2 },
});
