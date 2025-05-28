import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { store } from '@/redux/store';

export default function RootLayout() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Stack initialRouteName='(tabs)'>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(product)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found"/>
            </Stack>
          </QueryClientProvider>
      </Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
