import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export default function AnimatedBackground() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={[styles.blob, { top: -60, right: -60, backgroundColor: '#E8EFFE', width: 200, height: 200, borderRadius: 100 }]} />
      <View style={[styles.blob, { bottom: 100, left: -80, backgroundColor: '#EDE9FE', width: 240, height: 240, borderRadius: 120 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute', opacity: 0.6 },
});
