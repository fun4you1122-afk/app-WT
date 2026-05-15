import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/Colors';

const { width: W, height: H } = Dimensions.get('window');

function FloatingOrb({ x, y, size, color, delay }: { x: number; y: number; size: number; color: string; delay: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 3000 + delay * 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(20, { duration: 3000 + delay * 500, easing: Easing.inOut(Easing.sin) })
      ),
      -1, true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000 + delay * 400 }),
        withTiming(0.3, { duration: 2000 + delay * 400 })
      ),
      -1, true
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 4000 + delay * 300, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.9, { duration: 4000 + delay * 300, easing: Easing.inOut(Easing.sin) })
      ),
      -1, true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.orb, style, { left: x, top: y, width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />
  );
}

export default function AnimatedBackground() {
  const rotateAnim = useSharedValue(0);

  useEffect(() => {
    rotateAnim.value = withRepeat(withTiming(360, { duration: 20000, easing: Easing.linear }), -1, false);
  }, []);

  const rotStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <LinearGradient colors={['#050A18', '#080E20', '#050A18']} style={StyleSheet.absoluteFillObject} />
      <Svg width={W} height={H} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="glow1" cx="30%" cy="25%" r="40%">
            <Stop offset="0%" stopColor="#00D4FF" stopOpacity="0.12" />
            <Stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="glow2" cx="75%" cy="65%" r="45%">
            <Stop offset="0%" stopColor="#BF5FFF" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#BF5FFF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="glow3" cx="55%" cy="88%" r="35%">
            <Stop offset="0%" stopColor="#0066FF" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={W * 0.3} cy={H * 0.25} r={W * 0.4} fill="url(#glow1)" />
        <Circle cx={W * 0.75} cy={H * 0.65} r={W * 0.45} fill="url(#glow2)" />
        <Circle cx={W * 0.55} cy={H * 0.88} r={W * 0.35} fill="url(#glow3)" />
        {/* Grid lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Line key={`h${i}`} x1={0} y1={(H / 8) * i} x2={W} y2={(H / 8) * i} stroke="rgba(0,212,255,0.03)" strokeWidth={1} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <Line key={`v${i}`} x1={(W / 6) * i} y1={0} x2={(W / 6) * i} y2={H} stroke="rgba(0,212,255,0.03)" strokeWidth={1} />
        ))}
        {/* Circuit paths */}
        <Path d={`M ${W * 0.1} ${H * 0.3} L ${W * 0.3} ${H * 0.3} L ${W * 0.3} ${H * 0.5} L ${W * 0.6} ${H * 0.5}`} stroke="rgba(0,212,255,0.06)" strokeWidth={1} fill="none" />
        <Path d={`M ${W * 0.7} ${H * 0.2} L ${W * 0.7} ${H * 0.4} L ${W * 0.9} ${H * 0.4}`} stroke="rgba(191,95,255,0.06)" strokeWidth={1} fill="none" />
        <Path d={`M ${W * 0.2} ${H * 0.7} L ${W * 0.5} ${H * 0.7} L ${W * 0.5} ${H * 0.9}`} stroke="rgba(0,102,255,0.06)" strokeWidth={1} fill="none" />
        {/* Circuit nodes */}
        <Circle cx={W * 0.3} cy={H * 0.3} r={3} fill="rgba(0,212,255,0.2)" />
        <Circle cx={W * 0.3} cy={H * 0.5} r={3} fill="rgba(0,212,255,0.2)" />
        <Circle cx={W * 0.6} cy={H * 0.5} r={3} fill="rgba(0,212,255,0.2)" />
        <Circle cx={W * 0.7} cy={H * 0.4} r={3} fill="rgba(191,95,255,0.2)" />
        <Circle cx={W * 0.5} cy={H * 0.7} r={3} fill="rgba(0,102,255,0.2)" />
      </Svg>
      <FloatingOrb x={W * 0.1} y={H * 0.1} size={80} color="rgba(0,212,255,0.06)" delay={0} />
      <FloatingOrb x={W * 0.65} y={H * 0.15} size={120} color="rgba(191,95,255,0.06)" delay={1} />
      <FloatingOrb x={W * 0.05} y={H * 0.55} size={60} color="rgba(0,102,255,0.08)" delay={2} />
      <FloatingOrb x={W * 0.75} y={H * 0.7} size={100} color="rgba(0,212,255,0.05)" delay={1.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: { position: 'absolute' },
});
