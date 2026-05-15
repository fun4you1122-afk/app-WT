import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(16)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const dotScale1 = useRef(new Animated.Value(0)).current;
  const dotScale2 = useRef(new Animated.Value(0)).current;
  const dotScale3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoScale, { toValue: 1, duration: 700, easing: Easing.out(Easing.back(1.3)), useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(taglineY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    // Loading dots
    const animDot = (val: Animated.Value, delay: number) => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.loop(Animated.sequence([
          Animated.timing(val, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]), { iterations: 5 }),
      ]).start();
    };
    animDot(dotScale1, 900);
    animDot(dotScale2, 1100);
    animDot(dotScale3, 1300);

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
        router.replace('/onboarding');
      });
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.logoGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.logoLetter}>W</Text>
        </LinearGradient>
        <View style={styles.logoShadow} />
      </Animated.View>

      <Animated.View style={{ opacity: taglineOpacity, transform: [{ translateY: taglineY }], alignItems: 'center' }}>
        <Text style={styles.brand}>
          <Text style={{ color: '#0055FF' }}>We</Text>
          <Text style={{ color: '#0A1628' }}>Think</Text>
          <Text style={{ color: '#94A3B8' }}>.ae</Text>
        </Text>
        <Text style={styles.tagline}>Powering Tomorrow's Intelligence</Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { backgroundColor: '#0055FF', opacity: dotScale1 }]} />
        <Animated.View style={[styles.dot, { backgroundColor: '#7C3AED', opacity: dotScale2 }]} />
        <Animated.View style={[styles.dot, { backgroundColor: '#0EA5E9', opacity: dotScale3 }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FF', alignItems: 'center', justifyContent: 'center', gap: 20 },
  logoWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  logoGradient: { width: 88, height: 88, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowColor: '#0055FF', shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
  logoShadow: { position: 'absolute', width: 88, height: 20, bottom: -12, borderRadius: 44, backgroundColor: '#0055FF', opacity: 0.15, transform: [{ scaleX: 0.8 }] },
  logoLetter: { fontSize: 44, fontWeight: '900', color: '#FFFFFF' },
  brand: { fontSize: 34, fontWeight: '800', letterSpacing: -1, marginBottom: 6 },
  tagline: { fontSize: 14, color: '#475569', letterSpacing: 0.3, fontWeight: '500' },
  dotsRow: { position: 'absolute', bottom: 80, flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
