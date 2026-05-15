import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Typography, Spacing, Radius } from '../constants/Theme';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  tags?: string[];
  glowColor?: string;
  delay?: number;
  onPress?: () => void;
}

export default function ServiceCard({ icon, title, description, tags, glowColor = Colors.neonBlue, delay = 0, onPress }: ServiceCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

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
          Animated.timing(iconScale, { toValue: 1.1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(iconScale, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={styles.card}>
          <LinearGradient
            colors={[`${glowColor}15`, 'transparent']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={[styles.topBorder, { backgroundColor: glowColor }]} />
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: iconScale }], backgroundColor: `${glowColor}15`, borderColor: `${glowColor}30` }]}>
            <Text style={styles.icon}>{icon}</Text>
          </Animated.View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {tags && (
            <View style={styles.tags}>
              {tags.map((tag, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: `${glowColor}15`, borderColor: `${glowColor}30` }]}>
                  <Text style={[styles.tagText, { color: glowColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.arrow}>
            <Text style={[styles.arrowText, { color: glowColor }]}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  topBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, opacity: 0.6 },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  icon: { fontSize: 26 },
  title: { ...Typography.headingSM, color: Colors.textPrimary, marginBottom: Spacing.xs },
  description: { ...Typography.bodyMD, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  tagText: { ...Typography.caption, fontWeight: '600' },
  arrow: { alignSelf: 'flex-end' },
  arrowText: { fontSize: 20, fontWeight: '600' },
});
