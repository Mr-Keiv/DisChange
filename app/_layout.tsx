import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ExchangeRateProvider } from '@/context/ExchangeRateContext';
import { PaymentProvider } from '@/context/PaymentContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useColorScheme } from 'react-native';
import SplashScreenComponetn from '@/components/SplashScreen';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  const [isAppReady, setIsAppReady] = useState(false);


  if (!fontsLoaded || !isAppReady) {
    return (
      <SplashScreenComponetn
        onFinish={(isCancelled) => !isCancelled && setIsAppReady(true)}
      />
    );
  }

  return (
    <ExchangeRateProvider>
      <StatusBar style="auto" />
      <PaymentProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaymentProvider>
    </ExchangeRateProvider>
  );
}
