import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/Colors';

function TabIcon({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  const icons: Record<string, string> = {
    dashboard: '⬡',
    services: '◈',
    portfolio: '◉',
    analytics: '▲',
    chat: '◎',
  };
  return (
    <View style={[styles.tabIcon, focused && { backgroundColor: `${color}15` }]}>
      <Text style={[styles.iconSymbol, { color: focused ? color : 'rgba(255,255,255,0.35)', fontSize: focused ? 22 : 18 }]}>
        {icons[label] || '●'}
      </Text>
      {focused && <View style={[styles.activeGlow, { backgroundColor: color, shadowColor: color }]} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
        ),
        tabBarActiveTintColor: Colors.neonBlue,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon label="dashboard" focused={focused} color={Colors.neonBlue} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon label="services" focused={focused} color={Colors.neonCyan} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon label="portfolio" focused={focused} color={Colors.neonPurple} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon label="analytics" focused={focused} color={Colors.success} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon label="chat" focused={focused} color={Colors.neonPink} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(8,14,32,0.85)',
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 0,
  },
  tabIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconSymbol: { fontWeight: '700' },
  activeGlow: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
