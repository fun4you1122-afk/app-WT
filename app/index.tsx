import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Text, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Theme';

const { width: W, height: H } = Dimensions.get('window');

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const ring1Scale = useRef(new Animated.Value(0)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const particleRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(logoScale, { toValue: 1, duration: 900, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ]).start();

    // Pulse rings (3 repeats)
    const pulseRing = (scale: Animated.Value, opacity: Animated.Value, delay: number, peakOpacity: number) => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(scale, { toValue: 0, duration: 0, useNativeDriver: true }),
              Animated.timing(scale, { toValue: 2.5, duration: 1800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(opacity, { toValue: peakOpacity, duration: 200, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0, duration: 1600, useNativeDriver: true }),
            ]),
          ]),
          { iterations: 3 }
        ),
      ]).start();
    };
    pulseRing(ring1Scale, ring1Opacity, 800, 0.6);
    pulseRing(ring2Scale, ring2Opacity, 1100, 0.4);

    // Tagline
    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(taglineY, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    // Rotate particles
    Animated.loop(
      Animated.timing(particleRotate, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Navigate away after 3.2s
    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, { toValue: 0, duration: 500, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => {
        router.replace('/onboarding');
      });
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  const rotate = particleRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <LinearGradient colors={['#050A18', '#080E20', '#050A18']} style={StyleSheet.absoluteFillObject} />

      {/* Background glow */}
      <Svg width={W} height={H} style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Defs>
          <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#00D4FF" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={W / 2} cy={H / 2} r={W * 0.6} fill="url(#centerGlow)" />
      </Svg>

      {/* Rotating orbit particles */}
      <Animated.View style={[styles.orbitContainer, { transform: [{ rotate }] }]}>
        <Svg width={W} height={300}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r = 100;
            const cx = W / 2 + r * Math.cos(angle);
            const cy = 150 + r * Math.sin(angle);
            return <Circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 3 : 2} fill={i % 4 === 0 ? Colors.neonPurple : Colors.neonBlue} opacity={0.6} />;
          })}
        </Svg>
      </Animated.View>

      {/* Pulse rings */}
      <Animated.View style={[styles.ring, { borderColor: Colors.neonBlue, opacity: ring1Opacity, transform: [{ scale: ring1Scale }] }]} />
      <Animated.View style={[styles.ring, { borderColor: Colors.neonCyan, opacity: ring2Opacity, transform: [{ scale: ring2Scale }] }]} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <LinearGradient colors={[Colors.neonBlue, Colors.electricBlue]} style={styles.logoGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.logoText}>W</Text>
        </LinearGradient>
        <View style={styles.logoGlow} />
      </Animated.View>

      {/* Brand name */}
      <Animated.View style={[styles.brandContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Text style={styles.brandName}>
          <Text style={{ color: Colors.neonBlue }}>We</Text>
          <Text style={{ color: Colors.white }}>Think</Text>
        </Text>
        <View style={styles.brandDot} />
        <Text style={styles.brandTLD}>ae</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}>
        Powering Tomorrow's Intelligence
      </Animated.Text>

      {/* Loading bar */}
      <Animated.View style={[styles.loadingContainer, { opacity: taglineOpacity }]}>
        <View style={styles.loadingTrack}>
          <View style={[styles.loadingBar, { width: '70%' }]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#050A18' },
  orbitContainer: { position: 'absolute', alignSelf: 'center', top: H / 2 - 150 },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    alignSelf: 'center',
  },
  logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neonBlue,
    shadowOpacity: 0.8,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  logoText: { fontSize: 42, fontWeight: '800', color: Colors.white },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neonBlue,
    opacity: 0.08,
  },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 12 },
  brandName: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  brandDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.neonBlue, marginHorizontal: 2 },
  brandTLD: { fontSize: 20, fontWeight: '600', color: Colors.textMuted, alignSelf: 'flex-end', marginBottom: 4 },
  tagline: {
    ...Typography.bodyLG,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 40,
  },
  loadingContainer: { width: 160 },
  loadingTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: Colors.neonBlue,
    borderRadius: 1,
    shadowColor: Colors.neonBlue,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
