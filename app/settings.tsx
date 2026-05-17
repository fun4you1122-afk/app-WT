import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function Icon({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <View style={[styles.settingIcon, { backgroundColor: bg }]}>
      {children}
    </View>
  );
}

const ic = (color: string, size = 18) => ({ color, size });

function UserIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>;
}
function MailIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M2 7l10 7 10-7" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>;
}
function PhoneIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22 2 2 0 012 .04h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z" stroke={color} strokeWidth="1.7" fill={color + '20'} />
  </Svg>;
}
function BuildingIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="1" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M9 22V10h6v12M3 9h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>;
}
function GlobeIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>;
}
function BellIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill={color + '20'} />
    <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>;
}
function BarChartIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="1.6" fill={color + '20'} />
    <Rect x="10" y="8" width="4" height="13" rx="1" stroke={color} strokeWidth="1.6" fill={color + '20'} />
    <Rect x="17" y="4" width="4" height="17" rx="1" stroke={color} strokeWidth="1.6" fill={color + '20'} />
  </Svg>;
}
function LockIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M8 11V7a4 4 0 118 0v4" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>;
}
function FingerprintIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 10a2 2 0 10-2 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path d="M10 14c0 1 .5 3 2 3s2-2 2-3V12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path d="M6 10a6 6 0 016-6 6 6 0 016 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path d="M6 14c0 3.31 2.69 6 6 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>;
}
function ShieldIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function FileIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M14 2v6h6M8 12h8M8 16h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>;
}
function MoonIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth="1.7" fill={color + '20'} />
  </Svg>;
}
function CurrencyIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M12 7v1M12 16v1" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Path d="M9.5 10C9.5 8.9 10.6 8 12 8s2.5 1 2.5 2c0 1.4-1.5 2-3 2s-2.5.6-2.5 2c0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>;
}
function ClockIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M12 7v5l3 3" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function ChatIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15c0 1.1-.9 2-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={color} strokeWidth="1.7" fill={color + '20'} />
  </Svg>;
}
function BugIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 6a4 4 0 018 0v6a4 4 0 01-8 0V6z" stroke={color} strokeWidth="1.6" fill={color + '20'} />
    <Path d="M2 12h4M18 12h4M6 8l-3-3M18 8l3-3M6 16l-3 3M18 16l3 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>;
}
function StarIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="1.7" fill={color + '20'} />
  </Svg>;
}
function InfoIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" fill={color + '20'} />
    <Path d="M12 17v-6M12 8v-.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>;
}
function HammerIcon({ color, size = 18 }: { color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14.7 6.3l-9.4 9.4a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l9.4-9.4" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
    <Path d="M15 4l5 5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Path d="M5 20l2-2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Path d="M13 5l-3-3-2 2 3 3" stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill={color + '20'} />
  </Svg>;
}

// ── Setting row ────────────────────────────────────────────────────────────────
interface RowProps {
  IconEl: React.ReactNode;
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

function SettingRow({ IconEl, label, value, hasToggle, toggleValue, onToggle, onPress, showArrow = true, danger }: RowProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: danger ? colors.errorLight : colors.borderLight }]}>
        {IconEl}
      </View>
      <Text style={[styles.settingLabel, { color: danger ? colors.error : colors.text }]} numberOfLines={1}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: colors.textMuted }]} numberOfLines={1}>{value}</Text>}
        {hasToggle && (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.textInverse}
          />
        )}
        {showArrow && !hasToggle && <Text style={[styles.arrow, { color: colors.border }]}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/onboarding') },
    ]);
  };

  const P = colors.primary;
  const G = '#059669';
  const R = '#DC2626';
  const O = '#D97706';
  const Pu = '#7C3AED';
  const B = '#0EA5E9';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile Card */}
        <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.profileCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>RA</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Rasha Aljalam</Text>
            <Text style={styles.profileRole}>CEO · WeThink.ae</Text>
            <Text style={styles.profileOrg}>WeThink.ae · Dubai, UAE</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Account */}
        <SectionCard title="Account">
          <SettingRow IconEl={<UserIcon color={P} />} label="Personal Information" value="Rasha" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<MailIcon color={B} />} label="Email Address" value="rasha@wethink.ae" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<PhoneIcon color={G} />} label="Phone Number" value="+971 50 XXX XXXX" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<BuildingIcon color={O} />} label="Organization" value="WeThink.ae" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<GlobeIcon color={Pu} />} label="Language" value="English" onPress={() => {}} />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications">
          <SettingRow IconEl={<BellIcon color={P} />} label="Push Notifications" hasToggle toggleValue={pushNotifs} onToggle={setPushNotifs} showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<MailIcon color={B} />} label="Email Notifications" hasToggle toggleValue={emailNotifs} onToggle={setEmailNotifs} showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<BarChartIcon color={G} />} label="Weekly Reports" hasToggle toggleValue={analytics} onToggle={setAnalytics} showArrow={false} />
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security & Privacy">
          <SettingRow IconEl={<LockIcon color={R} />} label="Change Password" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<FingerprintIcon color={O} />} label="Biometric Login" hasToggle toggleValue={biometrics} onToggle={setBiometrics} showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<ShieldIcon color={G} />} label="Two-Factor Authentication" value="Enabled" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<FileIcon color={Pu} />} label="Privacy Policy" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<FileIcon color={B} />} label="Terms of Service" onPress={() => {}} />
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences">
          <SettingRow IconEl={<MoonIcon color={Pu} />} label="Dark Mode" hasToggle toggleValue={isDark} onToggle={toggleTheme} showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<CurrencyIcon color={G} />} label="Currency" value="AED" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<ClockIcon color={O} />} label="Timezone" value="GST (UTC+4)" onPress={() => {}} />
        </SectionCard>

        {/* Support */}
        <SectionCard title="Support">
          <SettingRow IconEl={<ChatIcon color={B} />} label="Chat with Support" onPress={() => router.push('/(tabs)/chat')} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<PhoneIcon color={G} />} label="Call Us" value="+971 4 XXX XXXX" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<BugIcon color={R} />} label="Report a Bug" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<StarIcon color={O} />} label="Rate the App" onPress={() => {}} />
        </SectionCard>

        {/* About */}
        <SectionCard title="About">
          <SettingRow IconEl={<InfoIcon color={B} />} label="App Version" value="1.0.0" showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<HammerIcon color={Pu} />} label="Build" value="2025.05.15" showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow IconEl={<GlobeIcon color={G} />} label="Website" value="wethink.ae" onPress={() => {}} />
        </SectionCard>

        {/* Sign Out */}
        <TouchableOpacity onPress={handleLogout} style={[styles.signOutBtn, { backgroundColor: colors.errorLight }]}>
          <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.footer, { color: colors.textMuted }]}>WeThink.ae © 2025 · Made with ❤️ in Dubai</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 60 },
  backText: { fontSize: 15, fontWeight: '500' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 24, gap: 0 },
  profileCard: { borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28 },
  profileAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  profileRole: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  profileOrg: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 1 },
  editBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  editBtnText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  sectionWrap: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 },
  sectionCard: { borderRadius: 16, overflow: 'hidden', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 14, maxWidth: 120 },
  arrow: { fontSize: 20, fontWeight: '300' },
  divider: { height: 1 },
  signOutBtn: { borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 16 },
  signOutText: { fontSize: 15, fontWeight: '700' },
  footer: { fontSize: 12, textAlign: 'center', marginBottom: 4 },
});
