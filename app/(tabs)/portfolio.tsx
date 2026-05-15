import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing, Radius } from '../../constants/Theme';

const { width: W } = Dimensions.get('window');

const INDUSTRIES = ['All', 'Finance', 'Government', 'Energy', 'Healthcare', 'Retail'];

const PROJECTS = [
  { client: 'Emirates NBD', clientInitials: 'EN', title: 'AI-Powered Fraud Detection Platform', description: 'Real-time transaction monitoring system using deep learning models to detect fraudulent activity across 14M+ accounts.', industry: 'Finance', metrics: [{ label: 'Fraud Reduction', value: '94%' }, { label: 'Processing Speed', value: '<2ms' }, { label: 'Accuracy', value: '99.7%' }], tags: ['Deep Learning', 'Real-time', 'FinTech'], glowColor: Colors.neonBlue, year: '2024', featured: true },
  { client: 'Dubai Smart City', clientInitials: 'DSC', title: 'Urban Intelligence Command Center', description: 'Unified city management platform integrating 2,000+ IoT sensors, traffic systems, and emergency response networks.', industry: 'Government', metrics: [{ label: 'Response Time', value: '-60%' }, { label: 'Sensors', value: '2,000+' }, { label: 'Coverage', value: '100%' }], tags: ['IoT', 'Smart City', 'Real-time Analytics'], glowColor: Colors.neonCyan, year: '2024', featured: true },
  { client: 'ADNOC', clientInitials: 'ADN', title: 'Predictive Maintenance AI System', description: 'Machine learning platform predicting equipment failures 72 hours in advance across 50+ oil & gas facilities.', industry: 'Energy', metrics: [{ label: 'Downtime Reduction', value: '78%' }, { label: 'Facilities', value: '50+' }, { label: 'ROI', value: '340%' }], tags: ['Predictive ML', 'Industrial IoT', 'Energy'], glowColor: Colors.warning, year: '2023', featured: false },
  { client: 'Dubai Health Authority', clientInitials: 'DHA', title: 'Clinical AI Diagnostics Suite', description: 'Medical imaging AI platform assisting radiologists with automated detection across 15 critical conditions.', industry: 'Healthcare', metrics: [{ label: 'Diagnostic Speed', value: '+85%' }, { label: 'Conditions', value: '15+' }, { label: 'Precision', value: '97.3%' }], tags: ['Medical AI', 'Computer Vision', 'Healthcare'], glowColor: Colors.success, year: '2024', featured: false },
  { client: 'Majid Al Futtaim', clientInitials: 'MAF', title: 'Omnichannel AI Commerce Engine', description: 'Personalization engine powering recommendations, dynamic pricing, and inventory optimization for 25M+ customers.', industry: 'Retail', metrics: [{ label: 'Revenue Lift', value: '+31%' }, { label: 'Customers', value: '25M+' }, { label: 'Conversion', value: '+45%' }], tags: ['Recommendation AI', 'Personalization', 'Retail'], glowColor: Colors.neonPurple, year: '2023', featured: false },
];

function ProjectCard({ project, delay = 0 }: { project: typeof PROJECTS[0]; delay?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <GlassCard glowColor={project.glowColor} animated={false} style={styles.projectCard}>
        <View style={[styles.projectTopBorder, { backgroundColor: project.glowColor }]} />
        {project.featured && (
          <View style={[styles.featuredBadge, { backgroundColor: `${project.glowColor}20`, borderColor: `${project.glowColor}40` }]}>
            <Text style={[styles.featuredBadgeText, { color: project.glowColor }]}>✦ FEATURED PROJECT</Text>
          </View>
        )}
        <View style={styles.projectHeader}>
          <View style={[styles.clientLogo, { backgroundColor: `${project.glowColor}20`, borderColor: `${project.glowColor}40` }]}>
            <Text style={[styles.clientInitials, { color: project.glowColor }]}>{project.clientInitials}</Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{project.client}</Text>
            <View style={styles.projectMeta}>
              <View style={[styles.industryBadge, { backgroundColor: `${project.glowColor}15`, borderColor: `${project.glowColor}25` }]}>
                <Text style={[styles.industryText, { color: project.glowColor }]}>{project.industry}</Text>
              </View>
              <Text style={styles.projectYear}>{project.year}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.projectDesc}>{project.description}</Text>
        <View style={styles.metrics}>
          {project.metrics.map((m, i) => (
            <View key={i} style={styles.metric}>
              <Text style={[styles.metricValue, { color: project.glowColor }]}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.tags}>
          {project.tags.map((tag, i) => (
            <View key={i} style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }]}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export default function PortfolioScreen() {
  const [activeIndustry, setActiveIndustry] = useState('All');
  const filtered = activeIndustry === 'All' ? PROJECTS : PROJECTS.filter(p => p.industry === activeIndustry);
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>OUR WORK</Text>
          <Text style={styles.title}>Client <Text style={{ color: Colors.neonPurple }}>Portfolio</Text></Text>
          <Text style={styles.headerDesc}>Delivering transformative AI and technology solutions to UAE's leading organizations.</Text>
        </View>
        <View style={styles.trustRow}>
          {[['180+', 'Clients'], ['95%', 'Satisfaction'], ['50+', 'Awards'], ['8+', 'Years']].map(([v, l], i) => (
            <View key={i} style={styles.trustItem}>
              <Text style={styles.trustValue}>{v}</Text>
              <Text style={styles.trustLabel}>{l}</Text>
            </View>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
          {INDUSTRIES.map((ind) => (
            <TouchableOpacity key={ind} onPress={() => setActiveIndustry(ind)} style={[styles.filterBtn, activeIndustry === ind && { backgroundColor: `${Colors.neonPurple}20`, borderColor: `${Colors.neonPurple}50` }]}>
              <Text style={[styles.filterText, activeIndustry === ind && { color: Colors.neonPurple }]}>{ind}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.cards}>
          {filtered.map((project, i) => <ProjectCard key={project.title} project={project} delay={i * 100} />)}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { marginBottom: Spacing.lg },
  subtitle: { ...Typography.label, color: Colors.neonPurple, letterSpacing: 2, marginBottom: 8 },
  title: { ...Typography.displayMD, color: Colors.white, fontWeight: '800', marginBottom: 12 },
  headerDesc: { ...Typography.bodyLG, color: Colors.textSecondary, lineHeight: 26 },
  trustRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: Radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: Spacing.md, marginBottom: Spacing.lg, justifyContent: 'space-around' },
  trustItem: { alignItems: 'center' },
  trustValue: { ...Typography.headingLG, color: Colors.neonPurple, fontWeight: '700', textShadowColor: Colors.neonPurple, textShadowRadius: 8 },
  trustLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  filters: { marginBottom: Spacing.md },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  filterText: { ...Typography.bodyMD, color: Colors.textMuted, fontWeight: '500' },
  cards: { gap: Spacing.md },
  projectCard: { padding: Spacing.lg, overflow: 'hidden' },
  projectTopBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, opacity: 0.7 },
  featuredBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, marginBottom: Spacing.md },
  featuredBadgeText: { ...Typography.caption, fontWeight: '700', letterSpacing: 1 },
  projectHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: 12 },
  clientLogo: { width: 48, height: 48, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  clientInitials: { fontSize: 14, fontWeight: '700' },
  clientInfo: { flex: 1 },
  clientName: { ...Typography.headingSM, color: Colors.textPrimary, marginBottom: 4 },
  projectMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  industryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  industryText: { ...Typography.caption, fontWeight: '600' },
  projectYear: { ...Typography.caption, color: Colors.textMuted },
  projectTitle: { ...Typography.headingMD, color: Colors.white, marginBottom: Spacing.sm },
  projectDesc: { ...Typography.bodyMD, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  metrics: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, justifyContent: 'space-around' },
  metric: { alignItems: 'center' },
  metricValue: { ...Typography.headingMD, fontWeight: '700' },
  metricLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  tagText: { ...Typography.caption, color: Colors.textSecondary },
});
