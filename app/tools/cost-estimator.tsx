import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const SERVICES = [
  { name: 'AI Model Development', price: 85000, icon: '🤖' },
  { name: 'Cloud Migration', price: 45000, icon: '☁️' },
  { name: 'Cybersecurity Audit', price: 28000, icon: '🛡️' },
  { name: 'Data Analytics Platform', price: 62000, icon: '📊' },
  { name: 'Mobile App Development', price: 120000, icon: '📱' },
  { name: 'API Integration Suite', price: 38000, icon: '🔗' },
  { name: 'Training & Onboarding', price: 15000, icon: '🎓' },
  { name: 'Maintenance & Support', price: 12000, icon: '🔧' },
];

function formatAED(value: number): string {
  return 'AED ' + value.toLocaleString('en-US');
}

function AnimatedTotal({ target }: { target: number }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(target)).current;
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    const listener = anim.addListener(({ value }) => setDisplay(Math.round(value)));
    Animated.timing(anim, {
      toValue: target,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
    return () => anim.removeListener(listener);
  }, [target]);

  return (
    <Text style={[styles.totalValue, { color: '#059669' }]}>
      {formatAED(display)}
    </Text>
  );
}

export default function CostEstimatorScreen() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const checkAnims = useRef(SERVICES.map(() => new Animated.Value(0))).current;

  const toggleService = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
        Animated.timing(checkAnims[index], { toValue: 0, duration: 200, useNativeDriver: true }).start();
      } else {
        next.add(index);
        Animated.spring(checkAnims[index], { toValue: 1, useNativeDriver: true, friction: 6 }).start();
      }
      return next;
    });
  };

  const total = Array.from(selected).reduce((sum, i) => sum + SERVICES[i].price, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cost Estimator</Text>
        <View style={{ width: 36 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Services</Text>
        <Text style={[styles.sectionSub, { color: colors.textMuted }]}>Tap to add services to your estimate</Text>

        <View style={styles.servicesList}>
          {SERVICES.map((service, i) => {
            const isSelected = selected.has(i);
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.serviceCard,
                  {
                    backgroundColor: isSelected ? '#059669' : colors.surface,
                    borderColor: isSelected ? '#059669' : colors.borderLight,
                  },
                ]}
                onPress={() => toggleService(i)}
                activeOpacity={0.85}
              >
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.serviceName, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                    {service.name}
                  </Text>
                  <Text style={[styles.servicePrice, { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textMuted }]}>
                    {formatAED(service.price)}
                  </Text>
                </View>
                <Animated.View
                  style={[
                    styles.checkCircle,
                    {
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : colors.borderLight,
                      transform: [{ scale: checkAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                    },
                  ]}
                >
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
        <View style={styles.totalRow}>
          <View>
            <Text style={[styles.totalLabel, { color: colors.textMuted }]}>
              {selected.size} service{selected.size !== 1 ? 's' : ''} selected
            </Text>
            <AnimatedTotal target={total} />
          </View>
          <TouchableOpacity
            style={[styles.quoteBtn, { backgroundColor: '#059669', opacity: selected.size > 0 ? 1 : 0.5 }]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
            disabled={selected.size === 0}
          >
            <Text style={styles.quoteBtnText}>Request Quote</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  sectionSub: { fontSize: 13, marginBottom: 20 },
  servicesList: { gap: 10 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  serviceIcon: { fontSize: 24 },
  serviceName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  servicePrice: { fontSize: 13, fontWeight: '500' },
  checkCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
  },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontSize: 12, fontWeight: '500', marginBottom: 2 },
  totalValue: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  quoteBtn: { borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14 },
  quoteBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
