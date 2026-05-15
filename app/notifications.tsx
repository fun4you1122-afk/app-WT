import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';

const NOTIFS = [
  { id: '1', icon: '✅', title: 'Deployment Successful', body: 'Emirates NBD Fraud Detection v2.4 is now live in production.', time: '2h ago', category: 'System', read: false, color: '#059669', bg: '#D1FAE5' },
  { id: '2', icon: '🚀', title: 'New AI Model Ready', body: 'WeThink NLP Model v3.2 has completed training. Accuracy: 96.4%', time: '5h ago', category: 'AI', read: false, color: '#0055FF', bg: '#E8EFFE' },
  { id: '3', icon: '📋', title: 'Proposal Submitted', body: 'Etisalat digital transformation proposal has been sent for review.', time: '1d ago', category: 'Sales', read: false, color: '#7C3AED', bg: '#EDE9FE' },
  { id: '4', icon: '🤝', title: 'Partnership Signed', body: 'DEWA strategic partnership agreement executed. Value: AED 45M', time: '2d ago', category: 'Business', read: true, color: '#D97706', bg: '#FEF3C7' },
  { id: '5', icon: '📈', title: 'Revenue Milestone', body: 'Q2 2025 revenue target exceeded by 18%. Total: AED 1.2B', time: '3d ago', category: 'Finance', read: true, color: '#059669', bg: '#D1FAE5' },
  { id: '6', icon: '⚠️', title: 'Server Maintenance', body: 'Scheduled maintenance on Analytics cluster tonight 2:00–4:00 AM GST.', time: '3d ago', category: 'System', read: true, color: '#D97706', bg: '#FEF3C7' },
  { id: '7', icon: '🏆', title: 'Award Received', body: 'WeThink named "Best AI Company UAE 2025" by Forbes Middle East.', time: '5d ago', category: 'Business', read: true, color: '#0055FF', bg: '#E8EFFE' },
  { id: '8', icon: '👤', title: 'New Team Member', body: 'Dr. Sarah Al-Hassan joined as Head of AI Research.', time: '1w ago', category: 'HR', read: true, color: '#7C3AED', bg: '#EDE9FE' },
];

const CATEGORIES = ['All', 'System', 'AI', 'Sales', 'Business', 'Finance'];

export default function NotificationsScreen() {
  const [filter, setFilter] = useState('All');
  const [notifs, setNotifs] = useState(NOTIFS);

  const filtered = filter === 'All' ? notifs : notifs.filter(n => n.category === filter);
  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadBadgeText}>{unreadCount}</Text></View>}
        </View>
        {unreadCount > 0
          ? <TouchableOpacity onPress={markAllRead} style={{ width: 80, alignItems: 'flex-end' }}><Text style={styles.markAll}>Mark all read</Text></TouchableOpacity>
          : <View style={{ width: 80 }} />
        }
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ gap: 8, paddingHorizontal: 24, paddingRight: 24 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setFilter(cat)} style={[styles.filterTab, filter === cat && styles.filterActive]}>
            <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔔</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No notifications in this category.</Text>
          </View>
        ) : filtered.map(notif => (
          <TouchableOpacity key={notif.id} onPress={() => markRead(notif.id)} activeOpacity={0.85}>
            <View style={[styles.notifCard, !notif.read && styles.notifUnread]}>
              {!notif.read && <View style={styles.unreadDot} />}
              <View style={[styles.iconWrap, { backgroundColor: notif.bg }]}>
                <Text style={{ fontSize: 20 }}>{notif.icon}</Text>
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifTop}>
                  <Text style={[styles.notifTitle, !notif.read && { fontWeight: '700' }]} numberOfLines={1}>{notif.title}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
                <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
                <View style={[styles.catTag, { backgroundColor: notif.bg }]}>
                  <Text style={[styles.catText, { color: notif.color }]}>{notif.category}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backBtn: { width: 80 },
  backText: { fontSize: 15, color: '#0055FF', fontWeight: '500' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0A1628' },
  unreadBadge: { backgroundColor: '#DC2626', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  unreadBadgeText: { fontSize: 11, color: '#FFFFFF', fontWeight: '700' },
  markAll: { fontSize: 13, color: '#0055FF', fontWeight: '600' },
  filterScroll: { paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  filterTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F4F6FF', borderWidth: 1, borderColor: '#E2E8F0' },
  filterActive: { backgroundColor: '#0055FF', borderColor: '#0055FF' },
  filterText: { fontSize: 12, fontWeight: '500', color: '#475569' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },
  scroll: { padding: 24, gap: 10 },
  notifCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start', shadowColor: '#0A1628', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1, position: 'relative' },
  notifUnread: { borderLeftWidth: 3, borderLeftColor: '#0055FF' },
  unreadDot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#0055FF' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifContent: { flex: 1, gap: 4 },
  notifTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { fontSize: 14, color: '#0A1628', fontWeight: '500', flex: 1, marginRight: 8 },
  notifTime: { fontSize: 11, color: '#94A3B8', flexShrink: 0 },
  notifBody: { fontSize: 13, color: '#475569', lineHeight: 19 },
  catTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  catText: { fontSize: 10, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0A1628', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#475569' },
});
