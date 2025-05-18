import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsAuthenticated(!!token);
      setAuthChecked(true);

      const inAuthGroup = segments[0] === '(auth)';

      if (!token && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (token && inAuthGroup) {
        router.replace('/(tabs)');
      }
    };

    checkAuth();
  }, [segments]);

  if (!loaded || !authChecked) {
    return null; // Show a splash screen if desired
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Public/Auth Stack */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Protected Tab Stack */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Not Found fallback */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
