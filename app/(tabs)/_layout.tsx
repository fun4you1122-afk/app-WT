import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { HomeIcon, CommunityIcon, ChatIcon, ServicesIcon, ProfileIcon, AnalyticsIcon, PortfolioIcon } from '../../components/TabIcons';

export default function TabLayout() {
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: colors.tabBar,
        borderTopWidth: 1,
        borderTopColor: colors.tabBarBorder,
        height: Platform.OS === 'ios' ? 84 : 64,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        paddingTop: 8,
        elevation: 0,
        shadowColor: colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
    }}>
      <Tabs.Screen name="dashboard" options={{ tabBarIcon: ({ color, focused }) => <HomeIcon color={color} size={26} focused={focused} /> }} />
      <Tabs.Screen name="community" options={{ tabBarIcon: ({ color, focused }) => <CommunityIcon color={color} size={26} focused={focused} /> }} />
      <Tabs.Screen name="services" options={{ tabBarIcon: ({ color, focused }) => <ServicesIcon color={color} size={26} focused={focused} /> }} />
      <Tabs.Screen name="chat" options={{ tabBarIcon: ({ color, focused }) => <ChatIcon color={color} size={26} focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ color, focused }) => <ProfileIcon color={color} size={26} focused={focused} /> }} />
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="portfolio" options={{ href: null }} />
    </Tabs>
  );
}
