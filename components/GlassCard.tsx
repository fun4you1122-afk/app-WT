import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Radius } from '../constants/Theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  intensity?: number;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
}

export default function GlassCard({ children, style, glowColor = Colors.neonBlue, intensity = 20, onPress, animated = true, delay = 0 }: GlassCardProps) {
  const opacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(animated ? 30 : 0)).current;

  useEffect(() => {
    if (!animated) return;
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const content = (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }, style]}>
      <LinearGradient
        colors={[`${glowColor}20`, `${glowColor}05`, 'transparent']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFillObject} />
      <LinearGradient
        colors={[`${glowColor}40`, 'transparent', 'transparent', `${glowColor}20`]}
        style={styles.border}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {children}
    </Animated.View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.85}>{content}</TouchableOpacity>;
  }
  return content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  border: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
  },
});
