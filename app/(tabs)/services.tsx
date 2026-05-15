import React, { useState, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const CATEGORIES = ['All', 'AI & ML', 'Cloud', 'Security', 'Digital', 'Consulting'];

const SERVICES = [
  { icon: '🧠', title: 'AI & Machine Learning', desc: 'Custom ML models, NLP, computer vision and predictive analytics for enterprise.', price: '15,000', category: 'AI & ML', color: '#0055FF', bg: '#E8EFFE', popular: true },
  { icon: '☁️', title: 'Cloud Architecture', desc: 'AWS, Azure & GCP migrations, Kubernetes, serverless and multi-cloud strategies.', price: '8,000', category: 'Cloud', color: '#0EA5E9', bg: '#E0F2FE', popular: false },
  { icon: '🛡️', title: 'Cybersecurity', desc: 'Zero-trust architecture, SOC setup, penetration testing and compliance.', price: '12,000', category: 'Security', color: '#DC2626', bg: '#FEE2E2', popular: false },
  { icon: '🚀', title: 'Digital Transformation', desc: 'End-to-end digitization, process automation and change management.', price: '20,000', category: 'Digital', color: '#7C3AED', bg: '#EDE9FE', popular: true },
  { icon: '📊', title: 'Data Analytics', desc: 'BI dashboards, data warehousing, real-time analytics and reporting.', price: '6,000', category: 'AI & ML', color: '#D97706', bg: '#FEF3C7', popular: false },
  { icon: '🌐', title: 'IoT Solutions', desc: 'Connected device ecosystems, edge computing and IoT platform integration.', price: '18,000', category: 'Digital', color: '#059669', bg: '#D1FAE5', popular: false },
  { icon: '⛓️', title: 'Blockchain', desc: 'Smart contracts, DeFi solutions and enterprise blockchain implementation.', price: '25,000', category: 'Consulting', color: '#6366F1', bg: '#EEF2FF', popular: false },
  { icon: '💼', title: 'IT Consulting', desc: 'Strategic technology advisory, vendor evaluation and digital roadmaps.', price: '5,000', category: 'Consulting', color: '#64748B', bg: '#F1F5F9', popular: false },
];

export default function ServicesScreen() {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const filtered = activeCategory === 'All' ? SERVICES : SERVICES.filter(s => s.category === activeCategory);

  const switchCategory = (cat: string) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setActiveCategory(cat);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Our Services</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Enterprise solutions for the digital age</Text>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={{ gap: 8, paddingRight: 24 }}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => switchCategory(cat)}
              style={[
                styles.tab,
                { backgroundColor: colors.surface, borderColor: colors.border },
                activeCategory === cat && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeCategory === cat && { color: '#FFFFFF', fontWeight: '600' },
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Hero Card */}
        <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🏆 Featured 2025</Text>
          </View>
          <Text style={styles.heroTitle}>WeThink AI Suite{'\n'}Enterprise Edition</Text>
          <Text style={styles.heroDesc}>Complete AI transformation platform. ML models, analytics, automation and more — unified for UAE enterprises.</Text>
          <View style={styles.heroBottom}>
            <Text style={styles.heroPrice}>From AED 50,000/yr</Text>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Get Demo →</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Service Cards */}
        <Animated.View style={{ opacity: fadeAnim, gap: 12 }}>
          {filtered.map((svc, i) => (
            <View key={i} style={[styles.serviceCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
              <View style={[styles.serviceIconWrap, { backgroundColor: svc.bg }]}>
                <Text style={{ fontSize: 26 }}>{svc.icon}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceTopRow}>
                  <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={1}>{svc.title}</Text>
                  {svc.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.serviceDesc, { color: colors.textSecondary }]} numberOfLines={2}>{svc.desc}</Text>
                <View style={styles.serviceBottom}>
                  <Text style={[styles.servicePrice, { color: svc.color }]}>From AED {svc.price}</Text>
                  <TouchableOpacity>
                    <Text style={[styles.exploreBtn, { color: svc.color }]}>Explore →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Bottom CTA */}
        <View style={[styles.ctaCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          <Text style={[styles.ctaTitle, { color: colors.text }]}>Ready to transform your business?</Text>
          <Text style={[styles.ctaSubtitle, { color: colors.textSecondary }]}>Our experts are available 24/7 for a consultation.</Text>
          <TouchableOpacity style={styles.ctaBtn}>
            <LinearGradient colors={['#0055FF', '#003ECC']} style={styles.ctaBtnGrad}>
              <Text style={styles.ctaBtnText}>Book Free Consultation</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  headerSubtitle: { fontSize: 14, marginTop: 2 },
  tabsScroll: { marginBottom: 20 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 13, fontWeight: '500' },
  heroCard: { borderRadius: 20, padding: 22, marginBottom: 20 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  heroBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, lineHeight: 28 },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 16 },
  heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroPrice: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  heroBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  heroBtnText: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  serviceCard: { borderRadius: 16, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  serviceIconWrap: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  serviceInfo: { flex: 1 },
  serviceTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  serviceTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  popularBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  popularText: { fontSize: 10, color: '#D97706', fontWeight: '700' },
  serviceDesc: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  serviceBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  servicePrice: { fontSize: 12, fontWeight: '700' },
  exploreBtn: { fontSize: 13, fontWeight: '600' },
  ctaCard: { marginTop: 24, borderRadius: 20, padding: 24, alignItems: 'center', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  ctaTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  ctaSubtitle: { fontSize: 13, textAlign: 'center', marginBottom: 18 },
  ctaBtn: { width: '100%' },
  ctaBtnGrad: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
