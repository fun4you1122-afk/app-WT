import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  HomeIcon,
  ServicesIcon,
  BookOpenIcon,
  ConsultIcon,
  InfoCircleIcon,
  AnalyticsIcon,
  PortfolioIcon,
} from '../../components/TabIcons';

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
      {/* Home — client showcase */}
      <Tabs.Screen
        name="dashboard"
        options={{ tabBarIcon: ({ color, focused }) => <HomeIcon color={color} size={26} focused={focused} /> }}
      />
      {/* Solutions — service offerings */}
      <Tabs.Screen
        name="services"
        options={{ tabBarIcon: ({ color, focused }) => <ServicesIcon color={color} size={26} focused={focused} /> }}
      />
      {/* Insights — thought leadership */}
      <Tabs.Screen
        name="community"
        options={{ tabBarIcon: ({ color, focused }) => <BookOpenIcon color={color} size={26} focused={focused} /> }}
      />
      {/* Consult — booking + AI chat */}
      <Tabs.Screen
        name="chat"
        options={{ tabBarIcon: ({ color, focused }) => <ConsultIcon color={color} size={26} focused={focused} /> }}
      />
      {/* About — company profile */}
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ color, focused }) => <InfoCircleIcon color={color} size={26} focused={focused} /> }}
      />
      {/* Hidden screens */}
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="portfolio" options={{ href: null }} />
    </Tabs>
  );
}
