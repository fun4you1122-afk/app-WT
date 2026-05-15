import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import ServiceCard from '../../components/ServiceCard';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing, Radius } from '../../constants/Theme';

const { width: W } = Dimensions.get('window');

const FILTERS = ['All', 'AI & ML', 'Cloud', 'Security', 'Dev'];

const SERVICES = [
  { icon: '🧠', title: 'AI & Machine Learning', description: 'Build intelligent systems with custom ML models, NLP, computer vision, and predictive analytics tailored for enterprise.', tags: ['Deep Learning', 'NLP', 'Computer Vision'], glowColor: Colors.neonBlue, category: 'AI & ML' },
  { icon: '☁️', title: 'Cloud Architecture', description: 'Design and deploy scalable, resilient cloud infrastructure on AWS, Azure, and Google Cloud with zero-downtime deployments.', tags: ['AWS', 'Azure', 'Kubernetes'], glowColor: Colors.neonCyan, category: 'Cloud' },
  { icon: '🛡️', title: 'Cybersecurity Solutions', description: 'Protect your digital assets with advanced threat detection, penetration testing, and compliance frameworks for UAE regulations.', tags: ['Threat Detection', 'Compliance', 'Zero Trust'], glowColor: Colors.error, category: 'Security' },
  { icon: '📱', title: 'Smart App Development', description: 'Create next-generation mobile and web applications with cutting-edge UX, AI integration, and enterprise-grade performance.', tags: ['React Native', 'Flutter', 'PWA'], glowColor: Colors.neonPurple, category: 'Dev' },
  { icon: '📊', title: 'Data Analytics Platform', description: 'Transform raw data into actionable insights with real-time dashboards, BI reporting, and AI-powered forecasting engines.', tags: ['BI', 'Real-time', 'Forecasting'], glowColor: Colors.success, category: 'AI & ML' },
  { icon: '🚀', title: 'Digital Transformation', description: 'End-to-end digital transformation programs that modernize legacy systems and accelerate innovation across your enterprise.', tags: ['Strategy', 'Automation', 'Integration'], glowColor: Colors.warning, category: 'Dev' },
];

export default function ServicesScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? SERVICES : SERVICES.filter(s => s.category === activeFilter);

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>WHAT WE DO</Text>
          <Text style={styles.title}>Our <Text style={{ color: Colors.neonBlue }}>Services</Text></Text>
          <Text style={styles.description}>Cutting-edge technology solutions built for the modern UAE enterprise landscape.</Text>
        </View>
        <TouchableOpacity activeOpacity={0.9} style={{ marginBottom: Spacing.lg }}>
          <LinearGradient colors={['rgba(0,212,255,0.2)', 'rgba(0,102,255,0.15)', 'rgba(191,95,255,0.1)']} style={styles.featuredBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={[styles.featuredBorder, { backgroundColor: Colors.neonBlue }]} />
            <View style={styles.featuredContent}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>✦ FEATURED</Text>
              </View>
              <Text style={styles.featuredTitle}>Enterprise AI Suite 2025</Text>
              <Text style={styles.featuredDesc}>Our flagship AI platform — combining ML, NLP, and analytics in one powerful enterprise solution.</Text>
              <Text style={[styles.featuredCTAText, { color: Colors.neonBlue }]}>Learn more →</Text>
            </View>
            <View style={styles.featuredIcon}><Text style={{ fontSize: 48 }}>🤖</Text></View>
          </LinearGradient>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
          {FILTERS.map((f) => (
            <TouchableOpacity key={f} onPress={() => setActiveFilter(f)} style={[styles.filterBtn, activeFilter === f && { backgroundColor: `${Colors.neonBlue}20`, borderColor: `${Colors.neonBlue}50` }]}>
              <Text style={[styles.filterText, activeFilter === f && { color: Colors.neonBlue }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.cards}>
          {filtered.map((service, i) => <ServiceCard key={service.title} {...service} delay={i * 80} />)}
        </View>
        <GlassCard style={styles.ctaCard} glowColor={Colors.neonPurple} delay={400}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Ready to Transform?</Text>
            <Text style={styles.ctaDesc}>Let's discuss how WeThink can elevate your business with AI.</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <LinearGradient colors={[Colors.neonBlue, Colors.electricBlue]} style={styles.ctaButtonGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.ctaButtonText}>Get a Free Consultation →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  header: { marginBottom: Spacing.lg },
  subtitle: { ...Typography.label, color: Colors.neonBlue, letterSpacing: 2, marginBottom: 8 },
  title: { ...Typography.displayMD, color: Colors.white, fontWeight: '800', marginBottom: 12, lineHeight: 38 },
  description: { ...Typography.bodyLG, color: Colors.textSecondary, lineHeight: 26 },
  featuredBanner: { borderRadius: Radius.xl, borderWidth: 1, borderColor: `${Colors.neonBlue}30`, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: Spacing.lg },
  featuredBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, opacity: 0.7 },
  featuredContent: { flex: 1, marginRight: 16 },
  featuredBadge: { backgroundColor: `${Colors.neonBlue}20`, borderWidth: 1, borderColor: `${Colors.neonBlue}40`, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
  featuredBadgeText: { ...Typography.caption, color: Colors.neonBlue, fontWeight: '700', letterSpacing: 1.5 },
  featuredTitle: { ...Typography.headingMD, color: Colors.white, marginBottom: 8 },
  featuredDesc: { ...Typography.bodySM, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  featuredCTAText: { ...Typography.bodyMD, fontWeight: '600' },
  featuredIcon: { alignItems: 'center', justifyContent: 'center' },
  filters: { marginBottom: Spacing.md },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  filterText: { ...Typography.bodyMD, color: Colors.textMuted, fontWeight: '500' },
  cards: { gap: Spacing.md, marginBottom: Spacing.lg },
  ctaCard: { padding: Spacing.xl },
  ctaContent: { alignItems: 'center' },
  ctaTitle: { ...Typography.headingLG, color: Colors.white, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  ctaDesc: { ...Typography.bodyMD, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg },
  ctaButton: { width: '100%' },
  ctaButtonGrad: { height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.neonBlue, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  ctaButtonText: { ...Typography.bodyLG, color: Colors.white, fontWeight: '700' },
});
