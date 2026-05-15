import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import { Colors } from '../constants/Colors';
import { Typography, Spacing, Radius } from '../constants/Theme';

const NOTIFICATIONS = [
  { id: '1', type: 'success', icon: '✅', title: 'AI Model Deployed', message: 'NLP Engine v3.2 successfully deployed to production with 99.7% accuracy.', time: '2 min ago', read: false, color: Colors.success },
  { id: '2', type: 'info', icon: '🔔', title: 'New Client Onboarded', message: 'Emirates NBD has been successfully onboarded. Project kickoff scheduled for tomorrow.', time: '14 min ago', read: false, color: Colors.neonBlue },
  { id: '3', type: 'warning', icon: '⚠️', title: 'Server Load Alert', message: 'ML processing cluster at 87% capacity. Consider scaling up resources.', time: '1h ago', read: false, color: Colors.warning },
  { id: '4', type: 'info', icon: '📊', title: 'Monthly Report Ready', message: 'Your Q4 2024 AI Performance Report is now available for review.', time: '3h ago', read: true, color: Colors.neonPurple },
  { id: '5', type: 'success', icon: '🚀', title: 'Sprint Completed', message: 'Smart City Analytics Phase 2 has been completed ahead of schedule.', time: '5h ago', read: true, color: Colors.success },
  { id: '6', type: 'info', icon: '🤝', title: 'Partnership Agreement', message: 'New strategic partnership with Microsoft Azure finalized for UAE expansion.', time: '1d ago', read: true, color: Colors.neonCyan },
  { id: '7', type: 'alert', icon: '🛡️', title: 'Security Scan Complete', message: 'Weekly security scan completed. No vulnerabilities detected across all systems.', time: '1d ago', read: true, color: Colors.success },
  { id: '8', type: 'info', icon: '💡', title: 'AI Insight Available', message: 'New predictive insight: Client retention likely to increase by 23% with recommended actions.', time: '2d ago', read: true, color: Colors.neonBlue },
];

function NotificationItem({ notif, delay }: { notif: typeof NOTIFICATIONS[0]; delay: number }) {
  const [read, setRead] = useState(notif.read);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity onPress={() => setRead(true)} activeOpacity={0.85}>
        <View style={[styles.notifCard, !read && styles.unreadCard]}>
          {!read && <View style={[styles.unreadBar, { backgroundColor: notif.color }]} />}
          <View style={[styles.notifIcon, { backgroundColor: `${notif.color}15`, borderColor: `${notif.color}30` }]}>
            <Text style={{ fontSize: 18 }}>{notif.icon}</Text>
          </View>
          <View style={styles.notifContent}>
            <View style={styles.notifHeader}>
              <Text style={[styles.notifTitle, !read && { color: Colors.white }]}>{notif.title}</Text>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
            <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.headerSub}>{unreadCount} unread</Text>}
        </View>
        <TouchableOpacity style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Unread section */}
        {unreadCount > 0 && (
          <>
            <Text style={styles.sectionLabel}>NEW</Text>
            <View style={styles.section}>
              {NOTIFICATIONS.filter(n => !n.read).map((n, i) => (
                <NotificationItem key={n.id} notif={n} delay={i * 60} />
              ))}
            </View>
          </>
        )}

        {/* Earlier section */}
        <Text style={styles.sectionLabel}>EARLIER</Text>
        <View style={styles.section}>
          {NOTIFICATIONS.filter(n => n.read).map((n, i) => (
            <NotificationItem key={n.id} notif={n} delay={unreadCount * 60 + i * 60} />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20 },
  backText: { fontSize: 20, color: Colors.textPrimary, fontWeight: '600' },
  headerTitle: { ...Typography.headingMD, color: Colors.white, textAlign: 'center' },
  headerSub: { ...Typography.caption, color: Colors.neonBlue, textAlign: 'center', marginTop: 2 },
  markAllBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(0,212,255,0.1)', borderRadius: Radius.full, borderWidth: 1, borderColor: `${Colors.neonBlue}25` },
  markAllText: { ...Typography.caption, color: Colors.neonBlue, fontWeight: '600' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, letterSpacing: 2, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  section: { gap: Spacing.sm, marginBottom: Spacing.md },
  notifCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: Spacing.md,
    overflow: 'hidden',
  },
  unreadCard: {
    backgroundColor: 'rgba(0,212,255,0.04)',
    borderColor: 'rgba(0,212,255,0.12)',
  },
  unreadBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderTopLeftRadius: Radius.xl, borderBottomLeftRadius: Radius.xl },
  notifIcon: { width: 44, height: 44, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  notifTitle: { ...Typography.bodyMD, color: Colors.textSecondary, fontWeight: '600', flex: 1, marginRight: 8 },
  notifTime: { ...Typography.caption, color: Colors.textMuted, flexShrink: 0 },
  notifMessage: { ...Typography.bodySM, color: Colors.textMuted, lineHeight: 18 },
});
