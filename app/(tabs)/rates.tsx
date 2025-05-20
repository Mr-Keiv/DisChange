import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  useColorScheme,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useExchangeRates } from '@/context/ExchangeRateContext';
import ExchangeRateCard from '@/components/ExchangeRateCard';
import { formatDate } from '@/utils/formatters';
import { Loader as Loader2, Clock } from 'lucide-react-native';
import { theme, fonts, spacing, borderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function RatesScreen() {
  const { rates, isLoading, error, lastUpdate, refreshRates } = useExchangeRates();
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const [refreshing, setRefreshing] = React.useState(false);
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshRates();
    setRefreshing(false);
  }, [refreshRates]);
  
  
  if (isLoading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Loader2 size={40} color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Cargando tasas...
        </Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
     {/*      <Text style={[styles.title, { color: colors.text }]}>
            Tasas Actuales
          </Text> */}
          {lastUpdate && (
            <View style={styles.timestampContainer}>
              <Clock size={isSmallScreen ? 14 : 16} color={colors.textSecondary} />
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                Actualizado: {formatDate(lastUpdate)}
              </Text>
            </View>
          )}
        </View>
        

          <View style={styles.comingSoonContainer}>
            <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
              Próximamente
            </Text>
          </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: isSmallScreen ? spacing.md : spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? 14 : 16,
    marginTop: spacing.md,
  },
  header: {
    marginBottom: isSmallScreen ? spacing.lg : spacing.xl,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: isSmallScreen ? 24 : 28,
    marginBottom: spacing.sm,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontFamily: fonts.regular,
    fontSize: isSmallScreen ? 12 : 14,
    marginLeft: spacing.xs,
  },
  errorContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? 12 : 14,
  },
  ratesContainer: {
    marginTop: spacing.md,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  comingSoonText: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? 16 : 18,
    opacity: 0.7,
  }
});