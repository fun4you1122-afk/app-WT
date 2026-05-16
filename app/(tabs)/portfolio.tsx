import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const FILTERS = ['All', 'Live', 'Active', 'Review'];

const PROJECTS = [
  {
    name: 'Emirates NBD Fraud AI', client: 'Emirates NBD',     initials: 'EN',
    status: 'Live',   progress: 100, color: '#059669',
    tags: ['ML', 'Fraud', 'RealTime'], team: ['RA','SR','MF'], due: 'Dec 2025',
  },
  {
    name: 'Dubai Smart City',      client: 'Dubai Municipality', initials: 'DM',
    status: 'Active', progress: 78,  color: '#0055FF',
    tags: ['IoT', 'Cloud', 'Dashboard'], team: ['PS','JC'], due: 'Feb 2026',
  },
  {
    name: 'ADNOC Predictive AI',   client: 'ADNOC',             initials: 'AD',
    status: 'Active', progress: 45,  color: '#D97706',
    tags: ['ML', 'Sensors', 'Ops'], team: ['RA','MF'], due: 'Apr 2026',
  },
  {
    name: 'Etisalat Customer AI',  client: 'Etisalat',          initials: 'ET',
    status: 'Review', progress: 90,  color: '#7C3AED',
    tags: ['NLP', 'CRM', 'Chat'], team: ['SR','JC'], due: 'Jan 2026',
  },
  {
    name: 'DEWA Energy Analytics', client: 'DEWA',              initials: 'DW',
    status: 'Active', progress: 30,  color: '#0EA5E9',
    tags: ['Analytics', 'BI', 'Cloud'], team: ['PS','RA'], due: 'Jun 2026',
  },
  {
    name: 'RTA Fleet AI',          client: 'RTA Dubai',         initials: 'RT',
    status: 'Review', progress: 15,  color: '#DC2626',
    tags: ['Vision', 'Edge', 'Auto'], team: ['MF','RA'], due: 'TBD',
  },
];

const STATUS_COLORS: Record<string, string> = {
  Live:   '#059669',
  Active: '#0055FF',
  Review: '#D97706',
};

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', color }: { target: number; suffix?: string; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    Animated.timing(anim, {
      toValue: target,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value }) => setDisplay(Math.round(value).toString()));
    return () => anim.removeListener(id);
  }, []);

  return (
    <Text style={[styles.counterValue, { color }]}>{display}{suffix}</Text>
  );
}

// ── Progress ring (small) ─────────────────────────────────────────────────────
function ProgressRing({ progress, color, index }: { progress: number; color: string; index: number }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const [dashLen, setDashLen] = useState(0);
  const R = 22;
  const STROKE = 5;
  const CIRC = 2 * Math.PI * R;
  const size = (R + STROKE) * 2 + 4;
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    const delay = 400 + index * 60;
    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: progress / 100,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, delay);
    const id = anim.addListener(({ value }) => setDashLen(value * CIRC));
    return () => {
      clearTimeout(timer);
      anim.removeListener(id);
    };
  }, []);

  return (
    <View style={styles.progressRingWrap}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={R} stroke={colors.borderLight} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={cx} cy={cy} r={R}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${dashLen} ${CIRC}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          rotation="-90"
          origin={`${cx},${cy}`}
        />
      </Svg>
      <View style={styles.progressRingCenter}>
        <Text style={[styles.progressRingText, { color }]}>{progress}%</Text>
      </View>
    </View>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { colors } = useTheme();
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const statusColor = STATUS_COLORS[project.status] || '#64748B';

  return (
    <Animated.View style={[
      styles.projectCard,
      { opacity, transform: [{ translateY }], backgroundColor: colors.surface, shadowColor: colors.shadow },
    ]}>
      {/* Colored left border */}
      <View style={[styles.cardBorder, { backgroundColor: project.color }]} />

      <View style={styles.cardBody}>
        {/* Top row: name + status badge */}
        <View style={styles.cardTopRow}>
          <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={2}>{project.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{project.status}</Text>
          </View>
        </View>

        {/* Client row: circle initials + progress ring */}
        <View style={styles.cardMidRow}>
          <View style={styles.clientRow}>
            <View style={[styles.clientCircle, { backgroundColor: project.color }]}>
              <Text style={styles.clientInitials}>{project.initials}</Text>
            </View>
            <Text style={[styles.clientName, { color: colors.textSecondary }]} numberOfLines={1}>
              {project.client}
            </Text>
          </View>
          <ProgressRing progress={project.progress} color={project.color} index={index} />
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {project.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: project.color + '18' }]}>
              <Text style={[styles.tagText, { color: project.color }]}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Footer: team avatars + due date */}
        <View style={styles.cardFooter}>
          <View style={styles.teamRow}>
            {project.team.map((initials, ti) => (
              <View
                key={ti}
                style={[
                  styles.teamAvatar,
                  { backgroundColor: project.color, marginLeft: ti > 0 ? -8 : 0, zIndex: project.team.length - ti },
                ]}
              >
                <Text style={styles.teamAvatarText}>{initials}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.dueDate, { color: colors.textMuted }]}>Due {project.due}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function PortfolioScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const filtered = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.status === filter);

  const switchFilter = (f: string) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
      setFilter(f);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Portfolio</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Our AI solutions</Text>
        </View>

        {/* ── Summary Row ── */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Total Projects', target: 247, suffix: '',    color: '#0055FF' },
            { label: 'Success Rate',   target: 96,  suffix: '%',   color: '#059669' },
            { label: 'Avg Delivery',   target: 12,  suffix: 'wk',  color: '#7C3AED' },
          ].map((item) => (
            <View key={item.label} style={[styles.summaryCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
              <AnimatedCounter target={item.target} suffix={item.suffix} color={item.color} />
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Filter Tabs ── */}
        <View style={styles.filterWrap}>
          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => switchFilter(f)}
                style={styles.filterTab}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterText,
                  { color: filter === f ? colors.primary : colors.textSecondary },
                  filter === f && styles.filterTextActive,
                ]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.filterUnderlineTrack, { backgroundColor: colors.borderLight }]} />
        </View>

        {/* ── Project Cards ── */}
        <Animated.View style={{ opacity: fadeAnim, gap: 14, marginTop: 4 }}>
          {filtered.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 56 : 40 },

  // Header
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 30, fontWeight: '900', letterSpacing: -0.8 },
  headerSub: { fontSize: 14, marginTop: 4 },

  // Summary row
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  summaryCard: {
    flex: 1, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 10,
    alignItems: 'center',
    shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  counterValue: { fontSize: 24, fontWeight: '900', letterSpacing: -0.8 },
  summaryLabel: { fontSize: 10, fontWeight: '500', marginTop: 4, textAlign: 'center' },

  // Filter tabs
  filterWrap: { marginBottom: 20 },
  filterRow: { flexDirection: 'row', gap: 4 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 10 },
  filterText: { fontSize: 14, fontWeight: '500' },
  filterTextActive: { fontWeight: '700' },
  filterUnderlineTrack: { height: 2, borderRadius: 1, marginTop: 2 },

  // Project card
  projectCard: {
    borderRadius: 18, flexDirection: 'row', overflow: 'hidden',
    shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  cardBorder: { width: 4 },
  cardBody: { flex: 1, padding: 16, gap: 10 },

  // Card top
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  cardName: { flex: 1, fontSize: 15, fontWeight: '800', lineHeight: 20, letterSpacing: -0.2 },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  statusText: { fontSize: 10, fontWeight: '700' },

  // Card mid
  cardMidRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  clientCircle: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  clientInitials: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  clientName: { fontSize: 12, fontWeight: '500', flex: 1 },

  // Progress ring
  progressRingWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  progressRingCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  progressRingText: { fontSize: 9, fontWeight: '800' },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: '700' },

  // Footer
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamRow: { flexDirection: 'row', alignItems: 'center' },
  teamAvatar: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  teamAvatarText: { fontSize: 8, fontWeight: '800', color: '#FFFFFF' },
  dueDate: { fontSize: 11, fontWeight: '500' },
});
