import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const DAYS_AHEAD = 14;
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const BOOKED_SLOTS = new Set([1, 3, 5]);

function getDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function ConsultationScreen() {
  const { colors } = useTheme();
  const days = getDays();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [booked, setBooked] = useState(false);
  const successScale = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(Array.from({ length: 8 }, () => ({
    y: new Animated.Value(0),
    x: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;

  const handleBook = () => {
    if (!name || !email || selectedSlot === null) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setBooked(true);
    Animated.spring(successScale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 120 }).start();
    confettiAnims.forEach((c, i) => {
      const angle = (i / confettiAnims.length) * Math.PI * 2;
      Animated.sequence([
        Animated.delay(i * 60),
        Animated.parallel([
          Animated.timing(c.opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(c.y, { toValue: -80 - Math.random() * 40, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
          Animated.timing(c.x, { toValue: (Math.cos(angle) * 60), duration: 500, useNativeDriver: true }),
        ]),
        Animated.timing(c.opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  if (booked) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Consultation</Text>
          <View style={{ width: 36 }} />
        </LinearGradient>
        <View style={styles.successContainer}>
          {confettiAnims.map((c, i) => (
            <Animated.View
              key={i}
              style={[
                styles.confettiDot,
                {
                  backgroundColor: ['#059669', '#0055FF', '#D97706', '#DC2626', '#7C3AED', '#0EA5E9', '#F59E0B', '#10B981'][i],
                  transform: [{ translateY: c.y }, { translateX: c.x }],
                  opacity: c.opacity,
                },
              ]}
            />
          ))}
          <Animated.View style={[styles.successCircle, { backgroundColor: '#D1FAE5', transform: [{ scale: successScale }] }]}>
            <Text style={styles.successCheck}>✓</Text>
          </Animated.View>
          <Text style={[styles.successTitle, { color: colors.text }]}>Booking Confirmed!</Text>
          <Text style={[styles.successSub, { color: colors.textSecondary }]}>
            {`Your consultation is booked for\n${DAY_NAMES[days[selectedDay].getDay()]}, ${days[selectedDay].getDate()} at ${TIME_SLOTS[selectedSlot!]}`}
          </Text>
          <Text style={[styles.successEmail, { color: colors.textMuted }]}>
            A confirmation has been sent to {email}
          </Text>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: '#DC2626' }]} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Consultation</Text>
        <View style={{ width: 36 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select a Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
          {days.map((day, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.dayCard,
                {
                  backgroundColor: selectedDay === i ? '#DC2626' : colors.surface,
                  borderColor: selectedDay === i ? '#DC2626' : colors.borderLight,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedDay(i);
                setSelectedSlot(null);
              }}
            >
              <Text style={[styles.dayName, { color: selectedDay === i ? 'rgba(255,255,255,0.8)' : colors.textMuted }]}>
                {DAY_NAMES[day.getDay()]}
              </Text>
              <Text style={[styles.dayNum, { color: selectedDay === i ? '#FFFFFF' : colors.text }]}>
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select a Time</Text>
        <View style={styles.slotsGrid}>
          {TIME_SLOTS.map((slot, i) => {
            const isBooked = BOOKED_SLOTS.has(i);
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.slotCard,
                  {
                    backgroundColor: isBooked
                      ? colors.borderLight
                      : selectedSlot === i
                      ? '#DC2626'
                      : colors.surface,
                    borderColor: isBooked
                      ? colors.borderLight
                      : selectedSlot === i
                      ? '#DC2626'
                      : colors.border,
                    opacity: isBooked ? 0.5 : 1,
                  },
                ]}
                onPress={() => {
                  if (!isBooked) {
                    Haptics.selectionAsync();
                    setSelectedSlot(i);
                  }
                }}
                disabled={isBooked}
              >
                <Text style={[styles.slotText, { color: selectedSlot === i ? '#FFFFFF' : isBooked ? colors.textMuted : colors.text }]}>
                  {slot}
                </Text>
                {isBooked && <Text style={[styles.bookedLabel, { color: colors.textMuted }]}>Booked</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Details</Text>
        <View style={styles.formGroup}>
          <TextInput
            style={[styles.formInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Full Name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.formInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Email Address"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.bookBtn,
            { backgroundColor: '#DC2626', opacity: name && email && selectedSlot !== null ? 1 : 0.5 },
          ]}
          onPress={handleBook}
          disabled={!name || !email || selectedSlot === null}
        >
          <Text style={styles.bookBtnText}>Confirm Booking</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14, letterSpacing: -0.2 },
  daysRow: { gap: 10, paddingRight: 20, marginBottom: 24 },
  dayCard: { width: 56, alignItems: 'center', paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, gap: 4 },
  dayName: { fontSize: 11, fontWeight: '600' },
  dayNum: { fontSize: 18, fontWeight: '800' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  slotCard: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', minWidth: 70 },
  slotText: { fontSize: 14, fontWeight: '700' },
  bookedLabel: { fontSize: 9, fontWeight: '500', marginTop: 1 },
  formGroup: { gap: 12, marginBottom: 20 },
  formInput: { borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1 },
  bookBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  bookBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  successCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  successCheck: { fontSize: 48, color: '#059669' },
  successTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -0.4 },
  successSub: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  successEmail: { fontSize: 13, textAlign: 'center' },
  doneBtn: { borderRadius: 16, paddingHorizontal: 40, paddingVertical: 14, marginTop: 8 },
  doneBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  confettiDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6 },
});
