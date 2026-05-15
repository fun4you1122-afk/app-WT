import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/Colors';

const { width: W, height: H } = Dimensions.get('window');

function FloatingOrb({ x, y, size, color, delay }: { x: number; y: number; size: number; color: string; delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -20, duration: 3000 + delay * 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 20, duration: 3000 + delay * 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 2000 + delay * 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 2000 + delay * 400, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 4000 + delay * 300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: 4000 + delay * 300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          left: x, top: y, width: size, height: size, borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    />
  );
}

export default function AnimatedBackground() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

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
