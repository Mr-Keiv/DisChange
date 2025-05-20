import React from 'react';
import { StyleSheet, View, Text, useColorScheme, Dimensions } from 'react-native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { ExchangeRate } from '@/types/exchangeRate';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { theme, fonts, spacing, borderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

interface ExchangeRateCardProps {
  rate: ExchangeRate;
  showSource?: boolean;
}

export default function ExchangeRateCard({ rate, showSource = true }: ExchangeRateCardProps) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const isPositive = rate.change >= 0;
  const changeColor = isPositive ? colors.positive : colors.negative;
  
  const rateValue = formatCurrency(rate.rate, rate.code === 'VES' ? 'USD' : 'VES', { 
    currencyDisplay: 'symbol'
  });
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border 
        }
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {rate.name}
        </Text>
        {showSource && rate.source && (
          <Text style={[styles.source, { color: colors.textSecondary }]} numberOfLines={1}>
            {rate.source}
          </Text>
        )}
      </View>
      <View style={styles.rateContainer}>
        <Text style={[styles.rate, { color: colors.text }]}>
          {rateValue}
        </Text>
        <View style={[styles.changeContainer, { backgroundColor: `${changeColor}20` }]}>
          {isPositive ? (
            <ArrowUp size={14} color={changeColor} />
          ) : (
            <ArrowDown size={14} color={changeColor} />
          )}
          <Text style={[styles.changeText, { color: changeColor }]}>
            {formatPercentage(rate.changePercent)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isSmallScreen ? spacing.sm : spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? 14 : 16,
    marginBottom: 2,
  },
  source: {
    fontFamily: fonts.regular,
    fontSize: isSmallScreen ? 10 : 12,
  },
  rateContainer: {
    alignItems: 'flex-end',
  },
  rate: {
    fontFamily: fonts.bold,
    fontSize: isSmallScreen ? 16 : 18,
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingHorizontal: 6,
    borderRadius: borderRadius.round,
  },
  changeText: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? 10 : 12,
    marginLeft: 2,
  }
});