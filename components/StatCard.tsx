import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Typography, Spacing, Radius } from '../constants/Theme';

interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  glowColor?: string;
  icon?: string;
  delay?: number;
}

export default function StatCard({ value, label, sublabel, trend, trendValue, glowColor = Colors.neonBlue, icon, delay = 0 }: StatCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const trendColor = trend === 'up' ? Colors.success : trend === 'down' ? Colors.error : Colors.textMuted as string;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <LinearGradient
        colors={[`${glowColor}18`, `${glowColor}06`, 'transparent']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.border, { backgroundColor: `${glowColor}30` }]} />
      <View style={styles.content}>
        {icon && (
          <Animated.View style={[styles.iconWrapper, { transform: [{ scale: pulse }], backgroundColor: `${glowColor}20`, borderColor: `${glowColor}40` }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </Animated.View>
        )}
        <View style={styles.textBlock}>
          <Text style={[styles.value, { color: glowColor, textShadowColor: glowColor, textShadowRadius: 10 }]}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
          {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
        {trend && trendValue && (
          <View style={[styles.trendBadge, { backgroundColor: `${trendColor}20` }]}>
            <Text style={[styles.trendText, { color: trendColor }]}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: Spacing.md,
  },
  border: { position: 'absolute', top: 0, left: 0, right: 0, height: 1 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  textBlock: { flex: 1 },
  value: { ...Typography.headingLG, fontWeight: '700' },
  label: { ...Typography.bodyMD, color: '#475569', marginTop: 2 },
  sublabel: { ...Typography.bodySM, color: '#94A3B8', marginTop: 1 },
  trendBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  trendText: { ...Typography.caption, fontWeight: '600' },
});
