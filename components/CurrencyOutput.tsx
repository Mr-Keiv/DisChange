import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StyleProp, ViewStyle, useColorScheme } from 'react-native';
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
              fontSize: isPrimary ? 14 : 14
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
              fontSize: isPrimary ? 18 : 24
            }
          ]}
          numberOfLines={1}
        >
          {formattedValue}
        </Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.copyButton,
          {
            backgroundColor: isPrimary 
              ? 'rgba(255, 255, 255, 0.2)' 
              : colors.backgroundSecondary
          }
        ]} 
        onPress={handleCopy}
      >
        <Copy 
          size={isPrimary ? 16 : 18} 
          color={isPrimary ? 'white' : colors.textSecondary} 
        />
      </TouchableOpacity>
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
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  content: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.medium,
    marginBottom: spacing.xs,
  },
  value: {
    fontFamily: fonts.bold,
  },
  copyButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.round,
  }
});