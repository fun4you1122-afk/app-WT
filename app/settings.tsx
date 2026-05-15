import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  showArrow?: boolean;
  color?: string;
  danger?: boolean;
}

function SettingRow({ icon, label, value, hasToggle, toggleValue, onToggle, onPress, showArrow = true, danger }: SettingRowProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: danger ? colors.errorLight : colors.borderLight }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
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
            <Text style={styles.profileAvatarText}>A</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Ahmad Al-Mansoori</Text>
            <Text style={styles.profileRole}>Enterprise Administrator</Text>
            <Text style={styles.profileOrg}>WeThink.ae · Dubai, UAE</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Account */}
        <SectionCard title="Account">
          <SettingRow icon="👤" label="Personal Information" value="Ahmad" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="📧" label="Email Address" value="ahmad@wethink.ae" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="📱" label="Phone Number" value="+971 50 XXX XXXX" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="🏢" label="Organization" value="WeThink.ae" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="🌍" label="Language" value="English" onPress={() => {}} />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications">
          <SettingRow icon="🔔" label="Push Notifications" hasToggle toggleValue={pushNotifs} onToggle={setPushNotifs} showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="📧" label="Email Notifications" hasToggle toggleValue={emailNotifs} onToggle={setEmailNotifs} showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="📊" label="Weekly Reports" hasToggle toggleValue={analytics} onToggle={setAnalytics} showArrow={false} />
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security & Privacy">
          <SettingRow icon="🔒" label="Change Password" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="👆" label="Biometric Login" hasToggle toggleValue={biometrics} onToggle={setBiometrics} showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="🛡️" label="Two-Factor Authentication" value="Enabled" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="📋" label="Privacy Policy" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="📄" label="Terms of Service" onPress={() => {}} />
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences">
          <SettingRow
            icon="🌙"
            label="Dark Mode"
            hasToggle
            toggleValue={isDark}
            onToggle={toggleTheme}
            showArrow={false}
          />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="💰" label="Currency" value="AED" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="🕐" label="Timezone" value="GST (UTC+4)" onPress={() => {}} />
        </SectionCard>

        {/* Support */}
        <SectionCard title="Support">
          <SettingRow icon="💬" label="Chat with Support" onPress={() => router.push('/(tabs)/chat')} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="📞" label="Call Us" value="+971 4 XXX XXXX" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="🐛" label="Report a Bug" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="⭐" label="Rate the App" onPress={() => {}} />
        </SectionCard>

        {/* About */}
        <SectionCard title="About">
          <SettingRow icon="ℹ️" label="App Version" value="1.0.0" showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="🏗️" label="Build" value="2025.05.15" showArrow={false} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight, marginLeft: 64 }]} />
          <SettingRow icon="🌐" label="Website" value="wethink.ae" onPress={() => {}} />
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
