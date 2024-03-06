import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NativeBaseProvider } from "native-base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_en from "@/translation/en.json";
import common_es from "@/translation/es.json";

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(drawer)/home',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  i18next.init({
    lng: 'es',
    resources: {
      en: { translation: common_en },
      es: { translation: common_es },
    },
    compatibilityJSON: "v3",
    interpolation: {
      escapeValue: false,
    },
  });

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const publishableKey = 'sk_test_51O6iJbEJTuZo0QvRkmgDBoMPqIEe4aKCwpbKIIhFFvnYCydxV0lJgqRb6E5U1kMhVk0tVuSTJxM4q25glbvlDGaU00ASufklzW';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StripeProvider
        publishableKey={publishableKey}
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
        <NativeBaseProvider>
          <I18nextProvider i18n={i18next}>
            <QueryClientProvider client={queryClient}>
              <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              </Stack>
            </QueryClientProvider>
          </I18nextProvider>
        </NativeBaseProvider>
      </StripeProvider>
    </ThemeProvider>
  );
}
