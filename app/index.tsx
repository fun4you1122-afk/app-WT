import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop, Line, Path } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Theme';

const { width: W, height: H } = Dimensions.get('window');

function navigate() {
  router.replace('/onboarding');
}

export default function SplashScreen() {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const ringScale1 = useSharedValue(0);
  const ringOpacity1 = useSharedValue(0);
  const ringScale2 = useSharedValue(0);
  const ringOpacity2 = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(20);
  const screenOpacity = useSharedValue(1);
  const particleRotate = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoScale.value = withDelay(300, withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.5)) }));
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 700 }));

    // Pulse rings
    ringScale1.value = withDelay(800, withRepeat(
      withSequence(withTiming(0, { duration: 0 }), withTiming(2.5, { duration: 1800, easing: Easing.out(Easing.cubic) })),
      3, false
    ));
    ringOpacity1.value = withDelay(800, withRepeat(
      withSequence(withTiming(0.6, { duration: 200 }), withTiming(0, { duration: 1600 })),
      3, false
    ));

    ringScale2.value = withDelay(1100, withRepeat(
      withSequence(withTiming(0, { duration: 0 }), withTiming(2.5, { duration: 1800, easing: Easing.out(Easing.cubic) })),
      3, false
    ));
    ringOpacity2.value = withDelay(1100, withRepeat(
      withSequence(withTiming(0.4, { duration: 200 }), withTiming(0, { duration: 1600 })),
      3, false
    ));

    // Tagline
    taglineOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
    taglineY.value = withDelay(1200, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));

    // Rotate particles
    particleRotate.value = withRepeat(withTiming(360, { duration: 8000, easing: Easing.linear }), -1, false);

    // Navigate away
    screenOpacity.value = withDelay(3200, withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(navigate)();
    }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const ring1Style = useAnimatedStyle(() => ({
    opacity: ringOpacity1.value,
    transform: [{ scale: ringScale1.value }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    opacity: ringOpacity2.value,
    transform: [{ scale: ringScale2.value }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));
  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));
  const particleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${particleRotate.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
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
      <Animated.View style={[styles.orbitContainer, particleStyle]}>
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
      <Animated.View style={[styles.ring, ring1Style, { borderColor: Colors.neonBlue }]} />
      <Animated.View style={[styles.ring, ring2Style, { borderColor: Colors.neonCyan }]} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <LinearGradient colors={[Colors.neonBlue, Colors.electricBlue]} style={styles.logoGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.logoText}>W</Text>
        </LinearGradient>
        <View style={styles.logoGlow} />
      </Animated.View>

      {/* Brand name */}
      <Animated.View style={[styles.brandContainer, logoStyle]}>
        <Text style={styles.brandName}>
          <Text style={{ color: Colors.neonBlue }}>We</Text>
          <Text style={{ color: Colors.white }}>Think</Text>
        </Text>
        <View style={styles.brandDot} />
        <Text style={styles.brandTLD}>ae</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Powering Tomorrow's Intelligence
      </Animated.Text>

      {/* Loading bar */}
      <Animated.View style={[styles.loadingContainer, taglineStyle]}>
        <View style={styles.loadingTrack}>
          <Animated.View style={[styles.loadingBar, { width: '70%' }]} />
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
