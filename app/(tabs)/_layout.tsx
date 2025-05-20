import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme } from 'react-native';
import { Calculator, CreditCard, RefreshCw } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDark ? '#374151' : '#E5E7EB'
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calculadora',
          tabBarIcon: ({ color, size }) => (
            <Calculator size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Pago',
          tabBarIcon: ({ color, size }) => (
            <CreditCard size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="rates"
        options={{
          title: 'Tasas',
          tabBarIcon: ({ color, size }) => (
            <RefreshCw size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5
  }
});