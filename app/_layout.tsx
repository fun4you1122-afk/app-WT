import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { CommunityProvider } from '../context/CommunityContext';

function AppStack() {
  const { isDark, colors } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'fade' }}>
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="compose" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/ai-chat" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/quiz" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/cost-estimator" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/roi-calculator" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/consultation" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/news" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/knowledge-base" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/password-gen" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/speed-test" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/security-scan" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/project-tracker" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tools/live-chat" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <CommunityProvider>
          <AppStack />
        </CommunityProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
