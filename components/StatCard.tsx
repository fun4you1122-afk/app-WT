import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
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
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const pulse = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));
    pulse.value = withDelay(delay + 700, withRepeat(withSequence(withTiming(1.08, { duration: 2000 }), withTiming(1, { duration: 2000 })), -1, true));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const trendColor = trend === 'up' ? Colors.success : trend === 'down' ? Colors.error : Colors.textMuted;

  return (
    <Animated.View style={[styles.container, cardStyle]}>
      <LinearGradient
        colors={[`${glowColor}18`, `${glowColor}06`, 'transparent']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.border, { backgroundColor: `${glowColor}30` }]} />
      <View style={styles.content}>
        {icon && (
          <Animated.View style={[styles.iconWrapper, pulseStyle, { backgroundColor: `${glowColor}20`, borderColor: `${glowColor}40` }]}>
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
  label: { ...Typography.bodyMD, color: Colors.textSecondary, marginTop: 2 },
  sublabel: { ...Typography.bodySM, color: Colors.textMuted, marginTop: 1 },
  trendBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  trendText: { ...Typography.caption, fontWeight: '600' },
});
