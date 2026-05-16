import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PanResponder,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');
const SLIDER_WIDTH = W - 40 - 40;

function CustomSlider({ value, onValueChange, min = 0, max = 100, color }: {
  value: number;
  onValueChange: (v: number) => void;
  min?: number;
  max?: number;
  color: string;
}) {
  const { colors } = useTheme();
  const thumbX = useRef(new Animated.Value(((value - min) / (max - min)) * SLIDER_WIDTH)).current;
  const [thumbPos, setThumbPos] = useState(((value - min) / (max - min)) * SLIDER_WIDTH);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Haptics.selectionAsync();
      },
      onPanResponderMove: (_, gestureState) => {
        const x = Math.max(0, Math.min(SLIDER_WIDTH, gestureState.moveX - 20));
        setThumbPos(x);
        const v = Math.round(min + (x / SLIDER_WIDTH) * (max - min));
        onValueChange(v);
      },
    })
  ).current;

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <View style={styles.sliderContainer}>
      <View style={[styles.sliderTrack, { backgroundColor: colors.borderLight }]}>
        <View style={[styles.sliderFill, { width: `${pct}%`, backgroundColor: color }]} />
        <View
          {...panResponder.panHandlers}
          style={[styles.sliderThumb, { backgroundColor: color, left: `${pct}%`, marginLeft: -12 }]}
        />
      </View>
    </View>
  );
}

function ResultCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.resultCard, { backgroundColor: colors.surface, borderLeftColor: color }]}>
      <Text style={[styles.resultLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.resultValue, { color }]}>
        {value}
        {unit && <Text style={[styles.resultUnit, { color: colors.textSecondary }]}>{' '}{unit}</Text>}
      </Text>
    </View>
  );
}

export default function ROICalculatorScreen() {
  const { colors } = useTheme();
  const [employees, setEmployees] = useState('50');
  const [monthlySpend, setMonthlySpend] = useState('20000');
  const [automationPct, setAutomationPct] = useState(60);

  const empNum = parseInt(employees) || 0;
  const spendNum = parseInt(monthlySpend) || 0;
  const monthlySavings = spendNum * (automationPct / 100);
  const annualSavings = monthlySavings * 12;
  const implementationCost = empNum * 1500;
  const roi = implementationCost > 0 ? (annualSavings / implementationCost) * 100 : 0;
  const payback = monthlySavings > 0 ? implementationCost / monthlySavings : 0;

  const formatNum = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#D97706', '#F59E0B']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ROI Calculator</Text>
        <View style={{ width: 36 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Input Your Data</Text>

        <View style={[styles.inputCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Number of employees affected</Text>
          <TextInput
            style={[styles.textInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
            value={employees}
            onChangeText={setEmployees}
            keyboardType="numeric"
            placeholder="50"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={[styles.inputCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Monthly spend on manual processes (AED)</Text>
          <TextInput
            style={[styles.textInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
            value={monthlySpend}
            onChangeText={setMonthlySpend}
            keyboardType="numeric"
            placeholder="20000"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={[styles.inputCard, { backgroundColor: colors.surface }]}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Expected automation %</Text>
            <Text style={[styles.sliderValue, { color: '#D97706' }]}>{automationPct}%</Text>
          </View>
          <CustomSlider value={automationPct} onValueChange={setAutomationPct} color="#D97706" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>Your Results</Text>

        <View style={styles.resultsGrid}>
          <ResultCard label="Monthly Savings" value={'AED ' + formatNum(monthlySavings)} color="#059669" />
          <ResultCard label="Annual Savings" value={'AED ' + formatNum(annualSavings)} color="#059669" />
          <ResultCard label="Implementation Cost" value={'AED ' + formatNum(implementationCost)} color="#D97706" />
          <ResultCard label="ROI" value={formatNum(roi) + '%'} color={roi >= 100 ? '#059669' : '#D97706'} />
          <ResultCard label="Payback Period" value={payback > 0 ? formatNum(payback) : '—'} unit={payback > 0 ? 'months' : ''} color="#0055FF" />
        </View>

        {roi > 0 && (
          <View style={[styles.summaryBanner, { backgroundColor: roi >= 100 ? '#D1FAE5' : '#FEF3C7' }]}>
            <Text style={[styles.summaryText, { color: roi >= 100 ? '#059669' : '#D97706' }]}>
              {roi >= 100
                ? `Great ROI! Your investment pays back in ${formatNum(payback)} months.`
                : `Positive returns expected within ${formatNum(payback)} months.`}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  content: { padding: 20, paddingBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3, marginBottom: 14 },
  inputCard: { borderRadius: 16, padding: 16, marginBottom: 12, gap: 10 },
  inputLabel: { fontSize: 13, fontWeight: '600' },
  textInput: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
  },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderValue: { fontSize: 16, fontWeight: '800' },
  sliderContainer: { height: 40, justifyContent: 'center', paddingHorizontal: 0 },
  sliderTrack: { height: 6, borderRadius: 3, position: 'relative' },
  sliderFill: { height: '100%', borderRadius: 3 },
  sliderThumb: { position: 'absolute', width: 24, height: 24, borderRadius: 12, top: -9 },
  resultsGrid: { gap: 10, marginBottom: 16 },
  resultCard: { borderRadius: 14, padding: 16, borderLeftWidth: 4, gap: 4 },
  resultLabel: { fontSize: 12, fontWeight: '500' },
  resultValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  resultUnit: { fontSize: 14, fontWeight: '500' },
  summaryBanner: { borderRadius: 14, padding: 16, alignItems: 'center' },
  summaryText: { fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 20 },
});
