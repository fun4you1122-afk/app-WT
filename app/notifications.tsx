import React, { useState, useRef, useCallback } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

// ─── Data ────────────────────────────────────────────────────────────────────

type NotifType = 'reply' | 'like' | 'trending' | 'ai' | 'mention';

interface Notification {
  id: string;
  type: NotifType;
  icon: string;
  text: string;
  time: string;
  read: boolean;
  section: 'today' | 'week' | 'earlier';
}

const INITIAL_NOTIFS: Notification[] = [
  // Today
  {
    id: 'n1',
    type: 'reply',
    icon: '💬',
    text: "Sarah Al-Rashid replied to your post 'Is AI replacing creativity?'",
    time: '5m ago',
    read: false,
    section: 'today',
  },
  {
    id: 'n2',
    type: 'like',
    icon: '❤️',
    text: '47 people liked your discussion on autonomous vehicles',
    time: '1h ago',
    read: false,
    section: 'today',
  },
  {
    id: 'n3',
    type: 'trending',
    icon: '🔥',
    text: 'Your post is trending in the AI category!',
    time: '2h ago',
    read: false,
    section: 'today',
  },
  {
    id: 'n4',
    type: 'ai',
    icon: '🤖',
    text: 'AI Insight: Your debate has a 78% positive sentiment score',
    time: '3h ago',
    read: true,
    section: 'today',
  },
  // This Week
  {
    id: 'n5',
    type: 'reply',
    icon: '💬',
    text: 'Mohammed Al-Farsi replied to your comment',
    time: '1d ago',
    read: true,
    section: 'week',
  },
  {
    id: 'n6',
    type: 'mention',
    icon: '🤝',
    text: "Priya Sharma mentioned you in 'UAE Banking AI'",
    time: '2d ago',
    read: true,
    section: 'week',
  },
  {
    id: 'n7',
    type: 'like',
    icon: '❤️',
    text: '234 people liked your poll on AI in schools',
    time: '3d ago',
    read: true,
    section: 'week',
  },
  {
    id: 'n8',
    type: 'trending',
    icon: '🔥',
    text: 'Your discussion ranked #2 this week in Business',
    time: '4d ago',
    read: true,
    section: 'week',
  },
  // Earlier
  {
    id: 'n9',
    type: 'ai',
    icon: '🤖',
    text: "AI Summary ready for 'Autonomous Vehicles in Gulf'",
    time: '1w ago',
    read: true,
    section: 'earlier',
  },
  {
    id: 'n10',
    type: 'reply',
    icon: '💬',
    text: 'James Chen started following you',
    time: '1w ago',
    read: true,
    section: 'earlier',
  },
  {
    id: 'n11',
    type: 'like',
    icon: '❤️',
    text: 'Your post reached 1,000 views!',
    time: '2w ago',
    read: true,
    section: 'earlier',
  },
  {
    id: 'n12',
    type: 'ai',
    icon: '🤖',
    text: 'Weekly AI Digest: Here are 5 trending discussions',
    time: '2w ago',
    read: true,
    section: 'earlier',
  },
];

const CATEGORIES: { label: string; value: NotifType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Replies', value: 'reply' },
  { label: 'Likes', value: 'like' },
  { label: 'Trending', value: 'trending' },
  { label: 'AI', value: 'ai' },
];

const SECTION_LABELS: Record<string, string> = {
  today: 'Today',
  week: 'This Week',
  earlier: 'Earlier',
};

// ─── Swipeable notification row ───────────────────────────────────────────────

function NotifRow({
  notif,
  onDelete,
  onMarkRead,
  colors,
}: {
  notif: Notification;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const swipeRef = useRef<Swipeable>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(1)).current;

  const handleDelete = useCallback(() => {
    swipeRef.current?.close();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => onDelete(notif.id));
  }, [notif.id, onDelete]);

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={handleDelete}
      style={[styles.deleteAction, { backgroundColor: colors.error }]}
      activeOpacity={0.85}
    >
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );

  const iconBg = {
    reply: colors.primaryLight,
    like: colors.errorLight,
    trending: colors.warningLight,
    ai: colors.accentLight,
    mention: colors.successLight,
  }[notif.type];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        maxHeight: heightAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 200],
        }),
        overflow: 'hidden',
        marginBottom: 8,
      }}
    >
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        rightThreshold={60}
        overshootRight={false}
        friction={2}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (!notif.read) onMarkRead(notif.id);
          }}
          style={[
            styles.notifCard,
            {
              backgroundColor: colors.surface,
              borderColor: notif.read ? colors.borderLight : colors.primary,
              shadowColor: colors.shadow,
            },
            !notif.read && styles.notifUnread,
          ]}
        >
          {!notif.read && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
          <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
            <Text style={styles.iconEmoji}>{notif.icon}</Text>
          </View>
          <View style={styles.notifBody}>
            <View style={styles.notifTopRow}>
              <Text
                style={[
                  styles.notifText,
                  {
                    color: colors.text,
                    fontWeight: notif.read ? '400' : '600',
                  },
                ]}
                numberOfLines={2}
              >
                {notif.text}
              </Text>
            </View>
            <Text style={[styles.notifTime, { color: colors.textMuted }]}>
              {notif.time}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<NotifType | 'all'>('all');
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const deleteNotif = useCallback((id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }, []);

  const filtered =
    filter === 'all' ? notifs : notifs.filter(n => n.type === filter);

  const sections: Array<{ key: string; label: string; data: Notification[] }> = [
    { key: 'today', label: 'Today', data: filtered.filter(n => n.section === 'today') },
    { key: 'week', label: 'This Week', data: filtered.filter(n => n.section === 'week') },
    { key: 'earlier', label: 'Earlier', data: filtered.filter(n => n.section === 'earlier') },
  ].filter(s => s.data.length > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.error }]}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={[styles.markAllText, { color: colors.primary }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </View>

      {/* Category filter pills */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map(cat => {
            const active = filter === cat.value;
            return (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setFilter(cat.value)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: active ? colors.primary : colors.inputBg,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: active ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Notification list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {sections.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              All caught up!
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              No notifications in this category.
            </Text>
          </View>
        ) : (
          sections.map(section => (
            <View key={section.key}>
              {/* Section header */}
              <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                  {section.label}
                </Text>
                <View style={[styles.sectionLine, { backgroundColor: colors.borderLight }]} />
              </View>
              {section.data.map(notif => (
                <NotifRow
                  key={notif.id}
                  notif={notif}
                  onDelete={deleteNotif}
                  onMarkRead={markRead}
                  colors={colors}
                />
              ))}
            </View>
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 70 },
  backText: { fontSize: 15, fontWeight: '500' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  unreadBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: { fontSize: 11, color: '#FFFFFF', fontWeight: '700' },
  headerRight: { width: 70, alignItems: 'flex-end' },
  markAllText: { fontSize: 12.5, fontWeight: '600' },
  filterBar: { borderBottomWidth: 1 },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterPillText: { fontSize: 13, fontWeight: '500' },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: 1 },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    position: 'relative',
  },
  notifUnread: { borderLeftWidth: 3 },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: { fontSize: 20 },
  notifBody: { flex: 1, gap: 4 },
  notifTopRow: { paddingRight: 16 },
  notifText: { fontSize: 14, lineHeight: 20 },
  notifTime: { fontSize: 11.5 },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderRadius: 14,
    marginLeft: 8,
    marginBottom: 8,
  },
  deleteActionText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14 },
});
