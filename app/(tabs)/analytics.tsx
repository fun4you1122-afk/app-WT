import React, { useRef, useEffect, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Polyline, Line, G, Text as SvgText } from 'react-native-svg';

const { width: W } = Dimensions.get('window');

const PERIODS = ['Week', 'Month', 'Quarter', 'Year'];

const REVENUE_DATA = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 72 },
  { month: 'Apr', value: 88 },
  { month: 'May', value: 95 },
  { month: 'Jun', value: 82 },
  { month: 'Jul', value: 105 },
  { month: 'Aug', value: 118 },
];

const KPIS = [
  { label: 'Revenue', value: 'AED 4.2B', change: '+18%', up: true, color: '#0055FF', bg: '#E8EFFE' },
  { label: 'Growth', value: '34%', change: '+8pp', up: true, color: '#059669', bg: '#D1FAE5' },
  { label: 'Projects', value: '247', change: '+29', up: true, color: '#7C3AED', bg: '#EDE9FE' },
  { label: 'NPS Score', value: '72', change: '+5', up: true, color: '#D97706', bg: '#FEF3C7' },
];

const PIPELINE = [
  { stage: 'Prospects', count: 148, color: '#94A3B8', pct: 100 },
  { stage: 'Qualified', count: 89, color: '#0EA5E9', pct: 60 },
  { stage: 'Proposal', count: 54, color: '#7C3AED', pct: 37 },
  { stage: 'Negotiation', count: 31, color: '#D97706', pct: 21 },
  { stage: 'Won', count: 18, color: '#059669', pct: 12 },
];

const TECH_STACK = [
  { tech: 'Machine Learning', pct: 38, color: '#0055FF' },
  { tech: 'Cloud Services', pct: 24, color: '#0EA5E9' },
  { tech: 'Cybersecurity', pct: 18, color: '#7C3AED' },
  { tech: 'Data Analytics', pct: 12, color: '#D97706' },
  { tech: 'Other', pct: 8, color: '#94A3B8' },
];

const COUNTRIES = [
  { name: 'UAE', flag: '🇦🇪', projects: 142, pct: 100 },
  { name: 'Saudi Arabia', flag: '🇸🇦', projects: 48, pct: 34 },
  { name: 'Qatar', flag: '🇶🇦', projects: 28, pct: 20 },
  { name: 'Kuwait', flag: '🇰🇼', projects: 18, pct: 13 },
  { name: 'Bahrain', flag: '🇧🇭', projects: 11, pct: 8 },
];

function RevenueChart() {
  const chartW = W - 48;
  const chartH = 140;
  const maxVal = Math.max(...REVENUE_DATA.map(d => d.value));
  const pts = REVENUE_DATA.map((d, i) => ({
    x: (i / (REVENUE_DATA.length - 1)) * (chartW - 32) + 16,
    y: chartH - 24 - ((d.value / maxVal) * (chartH - 40)),
  }));
  const polylinePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M${pts[0].x},${chartH - 24} ${pts.map(p => `L${p.x},${p.y}`).join(' ')} L${pts[pts.length - 1].x},${chartH - 24} Z`;

  const animProg = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animProg, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, []);

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Revenue Trend</Text>
        <Text style={styles.chartValue}>AED 4.2B</Text>
      </View>
      <Svg width={chartW} height={chartH}>
        <Path d={areaPath} fill="#0055FF" opacity="0.08" />
        <Polyline points={polylinePoints} fill="none" stroke="#0055FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="4" fill="#0055FF" />
        ))}
        {REVENUE_DATA.map((d, i) => (
          <SvgText key={i} x={pts[i].x} y={chartH - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{d.month}</SvgText>
        ))}
      </Svg>
    </View>
  );
}

function PipelineBar({ item, index }: { item: typeof PIPELINE[0]; index: number }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.timing(widthAnim, { toValue: item.pct, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, []);
  const barWidth = widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.pipelineRow}>
      <Text style={styles.pipelineStage} numberOfLines={1}>{item.stage}</Text>
      <View style={styles.pipelineTrack}>
        <Animated.View style={[styles.pipelineBar, { width: barWidth, backgroundColor: item.color }]} />
      </View>
      <Text style={[styles.pipelineCount, { color: item.color }]}>{item.count}</Text>
    </View>
  );
}

function TechRow({ item, index }: { item: typeof TECH_STACK[0]; index: number }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.timing(widthAnim, { toValue: item.pct, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, []);
  const bw = widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.techRow}>
      <View style={[styles.techDot, { backgroundColor: item.color }]} />
      <Text style={styles.techName} numberOfLines={1}>{item.tech}</Text>
      <View style={styles.techTrack}>
        <Animated.View style={[styles.techBar, { width: bw, backgroundColor: item.color }]} />
      </View>
      <Text style={[styles.techPct, { color: item.color }]}>{item.pct}%</Text>
    </View>
  );
}

function CountryRow({ item, index }: { item: typeof COUNTRIES[0]; index: number }) {
  const wa = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80 + 300),
      Animated.timing(wa, { toValue: item.pct, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, []);
  const bw = wa.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.countryRow}>
      <Text style={{ fontSize: 20 }}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <View style={styles.countryTrack}>
        <Animated.View style={[styles.countryBar, { width: bw }]} />
      </View>
      <Text style={styles.countryCount}>{item.projects}</Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState('Month');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={styles.periodRow}>
            {PERIODS.map(p => (
              <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[styles.periodBtn, period === p && styles.periodActive]}>
                <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {KPIS.map((k, i) => (
            <View key={i} style={[styles.kpiCard, { backgroundColor: k.bg }]}>
              <Text style={[styles.kpiValue, { color: k.color }]} numberOfLines={1}>{k.value}</Text>
              <Text style={styles.kpiLabel} numberOfLines={1}>{k.label}</Text>
              <Text style={[styles.kpiChange, { color: k.up ? '#059669' : '#DC2626' }]}>↑ {k.change}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Chart */}
        <RevenueChart />

        {/* Pipeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sales Pipeline</Text>
          {PIPELINE.map((item, i) => <PipelineBar key={i} item={item} index={i} />)}
        </View>

        {/* Tech Stack */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Revenue by Service</Text>
          {TECH_STACK.map((t, i) => <TechRow key={i} item={t} index={i} />)}
        </View>

        {/* Geographic Presence */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Geographic Presence</Text>
          {COUNTRIES.map((c, i) => <CountryRow key={i} item={c} index={i} />)}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const CARD_W = (W - 48 - 12) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FF' },
  scroll: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 56 : 40 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#0A1628', letterSpacing: -0.5, marginBottom: 12 },
  periodRow: { flexDirection: 'row', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 4 },
  periodBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  periodActive: { backgroundColor: '#0055FF' },
  periodText: { fontSize: 13, fontWeight: '500', color: '#475569' },
  periodTextActive: { color: '#FFFFFF', fontWeight: '600' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  kpiCard: { width: CARD_W, padding: 14, borderRadius: 14 },
  kpiValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  kpiLabel: { fontSize: 11, color: '#475569', marginTop: 2, fontWeight: '500' },
  kpiChange: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  chartCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#0A1628', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  chartTitle: { fontSize: 15, fontWeight: '700', color: '#0A1628' },
  chartValue: { fontSize: 15, fontWeight: '700', color: '#0055FF' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#0A1628', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0A1628', marginBottom: 14 },
  pipelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  pipelineStage: { width: 90, fontSize: 12, color: '#475569', fontWeight: '500' },
  pipelineTrack: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  pipelineBar: { height: '100%', borderRadius: 3 },
  pipelineCount: { width: 28, fontSize: 12, fontWeight: '700', textAlign: 'right' },
  techRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  techDot: { width: 8, height: 8, borderRadius: 4 },
  techName: { width: 100, fontSize: 12, color: '#475569', fontWeight: '500' },
  techTrack: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  techBar: { height: '100%', borderRadius: 3 },
  techPct: { width: 32, fontSize: 12, fontWeight: '700', textAlign: 'right' },
  countryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  countryName: { width: 80, fontSize: 12, color: '#475569', fontWeight: '500' },
  countryTrack: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  countryBar: { height: '100%', borderRadius: 3, backgroundColor: '#0055FF' },
  countryCount: { width: 28, fontSize: 12, fontWeight: '700', color: '#0A1628', textAlign: 'right' },
});
