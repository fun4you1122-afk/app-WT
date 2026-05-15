import React, { useCallback, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Typography, Radius } from '../constants/Theme';

interface NeonButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function NeonButton({ title, onPress, variant = 'primary', size = 'md', style, icon, fullWidth }: NeonButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
    ]).start();
    onPress?.();
  }, [onPress]);

  const gradients: Record<string, readonly [string, string]> = {
    primary: [Colors.neonBlue, Colors.electricBlue],
    secondary: [Colors.neonPurple, Colors.neonPink],
    ghost: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)'],
    danger: [Colors.error, '#CC0033'],
  };

  const heights: Record<string, number> = { sm: 40, md: 52, lg: 64 };
  const fontSizes: Record<string, object> = { sm: Typography.bodySM, md: Typography.bodyMD, lg: Typography.bodyLG };

  const glowColors: Record<string, string> = {
    primary: Colors.neonBlue,
    secondary: Colors.neonPurple,
    ghost: 'transparent',
    danger: Colors.error,
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} style={fullWidth ? { width: '100%' } : undefined}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={gradients[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            { height: heights[size], borderRadius: Radius.lg },
            variant === 'ghost' && styles.ghostBorder,
            { shadowColor: glowColors[variant], shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
            style,
          ]}
        >
          {icon && <>{icon}</>}
          <Text style={[styles.label, fontSizes[size], { marginLeft: icon ? 8 : 0 }]}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  label: {
    color: Colors.white,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
