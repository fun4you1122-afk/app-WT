import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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

function SettingRow({ icon, label, value, hasToggle, toggleValue, onToggle, onPress, showArrow = true, color = '#0A1628', danger }: SettingRowProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: danger ? '#FEE2E2' : '#F1F5F9' }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <Text style={[styles.settingLabel, danger && { color: '#DC2626' }]} numberOfLines={1}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue} numberOfLines={1}>{value}</Text>}
        {hasToggle && <Switch value={toggleValue} onValueChange={onToggle} trackColor={{ false: '#E2E8F0', true: '#0055FF' }} thumbColor="#FFFFFF" />}
        {showArrow && !hasToggle && <Text style={styles.arrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/onboarding') },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
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
          <View style={styles.divider} />
          <SettingRow icon="📧" label="Email Address" value="ahmad@wethink.ae" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="📱" label="Phone Number" value="+971 50 XXX XXXX" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="🏢" label="Organization" value="WeThink.ae" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="🌍" label="Language" value="English" onPress={() => {}} />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications">
          <SettingRow icon="🔔" label="Push Notifications" hasToggle toggleValue={pushNotifs} onToggle={setPushNotifs} showArrow={false} />
          <View style={styles.divider} />
          <SettingRow icon="📧" label="Email Notifications" hasToggle toggleValue={emailNotifs} onToggle={setEmailNotifs} showArrow={false} />
          <View style={styles.divider} />
          <SettingRow icon="📊" label="Weekly Reports" hasToggle toggleValue={analytics} onToggle={setAnalytics} showArrow={false} />
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security & Privacy">
          <SettingRow icon="🔒" label="Change Password" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="👆" label="Biometric Login" hasToggle toggleValue={biometrics} onToggle={setBiometrics} showArrow={false} />
          <View style={styles.divider} />
          <SettingRow icon="🛡️" label="Two-Factor Authentication" value="Enabled" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="📋" label="Privacy Policy" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="📄" label="Terms of Service" onPress={() => {}} />
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences">
          <SettingRow icon="🌙" label="Dark Mode" hasToggle toggleValue={darkMode} onToggle={setDarkMode} showArrow={false} />
          <View style={styles.divider} />
          <SettingRow icon="💰" label="Currency" value="AED" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="🕐" label="Timezone" value="GST (UTC+4)" onPress={() => {}} />
        </SectionCard>

        {/* Support */}
        <SectionCard title="Support">
          <SettingRow icon="💬" label="Chat with Support" onPress={() => router.push('/(tabs)/chat')} />
          <View style={styles.divider} />
          <SettingRow icon="📞" label="Call Us" value="+971 4 XXX XXXX" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="🐛" label="Report a Bug" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="⭐" label="Rate the App" onPress={() => {}} />
        </SectionCard>

        {/* About */}
        <SectionCard title="About">
          <SettingRow icon="ℹ️" label="App Version" value="1.0.0" showArrow={false} />
          <View style={styles.divider} />
          <SettingRow icon="🏗️" label="Build" value="2025.05.15" showArrow={false} />
          <View style={styles.divider} />
          <SettingRow icon="🌐" label="Website" value="wethink.ae" onPress={() => {}} />
        </SectionCard>

        {/* Sign Out */}
        <TouchableOpacity onPress={handleLogout} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>WeThink.ae © 2025 · Made with ❤️ in Dubai</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backBtn: { width: 60 },
  backText: { fontSize: 15, color: '#0055FF', fontWeight: '500' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0A1628' },
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
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#0A1628', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 15, color: '#0A1628', fontWeight: '500' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 14, color: '#94A3B8', maxWidth: 120 },
  arrow: { fontSize: 20, color: '#CBD5E1', fontWeight: '300' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 64 },
  signOutBtn: { backgroundColor: '#FEE2E2', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 16 },
  signOutText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },
  footer: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginBottom: 4 },
});
