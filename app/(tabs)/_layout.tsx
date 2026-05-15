import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import { HomeIcon, ServicesIcon, PortfolioIcon, AnalyticsIcon, ChatIcon } from '../../components/TabIcons';

function TabIcon({ label, focused, color, Icon }: { label: string; focused: boolean; color: string; Icon: any }) {
  return (
    <View style={styles.tabItem}>
      <Icon color={color} size={22} focused={focused} />
      <Text style={[styles.tabLabel, { color, fontWeight: focused ? '600' : '400' }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon label="Home" focused={focused} color={color} Icon={HomeIcon} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon label="Services" focused={focused} color={color} Icon={ServicesIcon} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon label="Portfolio" focused={focused} color={color} Icon={PortfolioIcon} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon label="Analytics" focused={focused} color={color} Icon={AnalyticsIcon} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon label="AI Chat" focused={focused} color={color} Icon={ChatIcon} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    elevation: 0,
    shadowColor: '#0A1628',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  tabItem: { alignItems: 'center', gap: 4 },
  tabLabel: { fontSize: 10, letterSpacing: 0.2 },
});
