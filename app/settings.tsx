import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Switch, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import { Colors } from '../constants/Colors';
import { Typography, Spacing, Radius } from '../constants/Theme';

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  color?: string;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingItem({ icon, label, value, toggle, toggleValue, onToggle, color = Colors.neonBlue, onPress, destructive }: SettingItemProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={toggle ? 1 : 0.7} style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: `${color}15`, borderColor: `${color}25` }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, destructive && { color: Colors.error }]}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: 'rgba(255,255,255,0.1)', true: `${color}60` }}
          thumbColor={toggleValue ? color : Colors.textMuted}
        />
      ) : (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </TouchableOpacity>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <GlassCard style={styles.sectionCard} glowColor={Colors.neonBlue} animated={false}>
        {children}
      </GlassCard>
    </View>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <GlassCard style={styles.profileCard} glowColor={Colors.neonBlue} delay={0}>
          <LinearGradient colors={[Colors.neonBlue, Colors.electricBlue]} style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>W</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>WeThink Admin</Text>
            <Text style={styles.profileEmail}>admin@wethink.ae</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Enterprise Account</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Account */}
        <SettingSection title="ACCOUNT">
          <SettingItem icon="👤" label="Profile Information" value="Update your details" color={Colors.neonBlue} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingItem icon="🔐" label="Security & Password" value="Last changed 30 days ago" color={Colors.neonPurple} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingItem icon="📧" label="Email Preferences" value="admin@wethink.ae" color={Colors.neonCyan} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingItem icon="🏢" label="Organization" value="WeThink FZ-LLC" color={Colors.success} onPress={() => {}} />
        </SettingSection>

        {/* App Settings */}
        <SettingSection title="APP SETTINGS">
          <SettingItem icon="🔔" label="Push Notifications" toggle toggleValue={notifications} onToggle={setNotifications} color={Colors.neonBlue} />
          <View style={styles.divider} />
          <SettingItem icon="🌙" label="Dark Mode" toggle toggleValue={darkMode} onToggle={setDarkMode} color={Colors.neonPurple} />
          <View style={styles.divider} />
          <SettingItem icon="🔄" label="Auto Refresh Data" toggle toggleValue={autoRefresh} onToggle={setAutoRefresh} color={Colors.neonCyan} />
          <View style={styles.divider} />
          <SettingItem icon="🌐" label="Language" value="English (UAE)" color={Colors.success} onPress={() => {}} />
        </SettingSection>

        {/* AI & Features */}
        <SettingSection title="AI & FEATURES">
          <SettingItem icon="🤖" label="AI Suggestions" toggle toggleValue={aiSuggestions} onToggle={setAiSuggestions} color={Colors.neonBlue} />
          <View style={styles.divider} />
          <SettingItem icon="📊" label="Usage Analytics" toggle toggleValue={analytics} onToggle={setAnalytics} color={Colors.neonPurple} />
          <View style={styles.divider} />
          <SettingItem icon="🔒" label="Biometric Login" toggle toggleValue={biometrics} onToggle={setBiometrics} color={Colors.success} />
          <View style={styles.divider} />
          <SettingItem icon="⚡" label="Performance Mode" value="Optimized" color={Colors.warning} onPress={() => {}} />
        </SettingSection>

        {/* About */}
        <SettingSection title="ABOUT">
          <SettingItem icon="ℹ️" label="App Version" value="v2.5.0 (Build 250)" color={Colors.neonCyan} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingItem icon="📋" label="Terms of Service" color={Colors.neonBlue} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingItem icon="🔏" label="Privacy Policy" color={Colors.neonPurple} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingItem icon="⭐" label="Rate WeThink App" color={Colors.warning} onPress={() => {}} />
        </SettingSection>

        {/* Danger zone */}
        <SettingSection title="ACCOUNT ACTIONS">
          <SettingItem icon="🚪" label="Sign Out" color={Colors.warning} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingItem icon="🗑️" label="Delete Account" color={Colors.error} destructive onPress={() => {}} />
        </SettingSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>WeThink © 2025 · Dubai, UAE</Text>
          <Text style={styles.footerSub}>Powering Tomorrow's Intelligence</Text>
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
  headerTitle: { ...Typography.headingMD, color: Colors.white },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, marginBottom: Spacing.lg, gap: 16 },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.neonBlue, shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 0 } },
  profileAvatarText: { fontSize: 24, fontWeight: '800', color: Colors.white },
  profileInfo: { flex: 1 },
  profileName: { ...Typography.headingSM, color: Colors.white, marginBottom: 2 },
  profileEmail: { ...Typography.bodySM, color: Colors.textMuted, marginBottom: 6 },
  profileBadge: { backgroundColor: `${Colors.neonBlue}20`, borderWidth: 1, borderColor: `${Colors.neonBlue}30`, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  profileBadgeText: { ...Typography.caption, color: Colors.neonBlue, fontWeight: '600' },
  editBtn: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  editText: { ...Typography.bodyMD, color: Colors.textSecondary, fontWeight: '500' },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.label, color: Colors.textMuted, letterSpacing: 2, marginBottom: Spacing.sm },
  sectionCard: { padding: 0, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: Spacing.md, paddingVertical: 14 },
  settingIcon: { width: 36, height: 36, borderRadius: Radius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  settingContent: { flex: 1 },
  settingLabel: { ...Typography.bodyMD, color: Colors.textPrimary, fontWeight: '500' },
  settingValue: { ...Typography.bodySM, color: Colors.textMuted, marginTop: 2 },
  settingArrow: { fontSize: 20, color: Colors.textMuted, fontWeight: '300' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: 66 },
  footer: { alignItems: 'center', paddingVertical: Spacing.lg },
  footerText: { ...Typography.bodyMD, color: Colors.textMuted },
  footerSub: { ...Typography.caption, color: Colors.neonBlue, marginTop: 4, opacity: 0.7 },
});
