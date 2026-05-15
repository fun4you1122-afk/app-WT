import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function NeonButton({ title, onPress, variant = 'primary', size = 'md', style, icon, fullWidth }: NeonButtonProps) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(1);

  const handlePress = useCallback(() => {
    scale.value = withSequence(withTiming(0.95, { duration: 100 }), withTiming(1, { duration: 200, easing: Easing.out(Easing.back(2)) }));
    glow.value = withSequence(withTiming(1.5, { duration: 150 }), withTiming(1, { duration: 300 }));
    onPress?.();
  }, [onPress]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
    <AnimatedTouchable onPress={handlePress} activeOpacity={1} style={[animStyle, fullWidth && { width: '100%' }]}>
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
    </AnimatedTouchable>
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
