import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StyleProp, ViewStyle, useColorScheme, Dimensions } from 'react-native';
import { formatCurrency } from '@/utils/formatters';
import { Copy } from 'lucide-react-native';
import { copyToClipboard } from '@/utils/clipboard';
import { theme, fonts, spacing, borderRadius } from '@/constants/theme';

interface CurrencyOutputProps {
  value: number;
  currency: string;
  label: string;
  isPrimary?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const { width, height } = Dimensions.get('window');
const scaleFactor = width < 375 ? 0.6 : 0.7;
const isSmallScreen = width < 375;

export default function CurrencyOutput({
  value,
  currency,
  label,
  isPrimary = false,
  style,
  onPress
}: CurrencyOutputProps) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const formattedValue = formatCurrency(value, currency, 2);
  
  const handleCopy = async () => {
    await copyToClipboard(formattedValue);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        {
          backgroundColor: isPrimary ? colors.primary : colors.backgroundSecondary,
          borderColor: isPrimary ? colors.primary : colors.border,
          padding: spacing.sm * scaleFactor,
          marginBottom: spacing.sm * scaleFactor,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <Text 
          style={[
            styles.label, 
            { 
              color: isPrimary ? 'white' : colors.textSecondary,
              fontSize: (isPrimary ? 16 : 11) * scaleFactor,
              marginBottom: spacing.xs * scaleFactor * 0.5,
            }
          ]}
        >
          {label}
        </Text>
        <Text 
          style={[
            styles.value, 
            { 
              color: isPrimary ? 'white' : colors.text,
              fontSize: (isPrimary ? 24 : 18) * scaleFactor
            }
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.7}
        >
          {formattedValue}
        </Text>
        <Text
          style={[
            styles.tapToPay,
            {
              color: isPrimary ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
              fontSize: 15 * scaleFactor,
              marginTop: spacing.xs * scaleFactor * 0.3,
            }
          ]}
        >
          Toca para pagar
        </Text>
      </View>
  
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.md * scaleFactor,
    minHeight: 80 * scaleFactor, // Altura mínima más pequeña
  },
  content: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.medium,
  },
  value: {
    fontFamily: fonts.bold,
    flexShrink: 1, // Permite que el texto se encoja si es necesario
  },
  tapToPay: {
    fontFamily: fonts.regular,
  },
  copyButton: {
    borderRadius: borderRadius.round * scaleFactor,
    alignItems: 'center',
    justifyContent: 'center',
  }
});