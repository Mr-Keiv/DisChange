import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, Text, TouchableOpacity, StyleProp, ViewStyle, useColorScheme } from 'react-native';
import { formatCurrency } from '@/utils/formatters';
import { X } from 'lucide-react-native';
import { theme, fonts, spacing, borderRadius } from '@/constants/theme';

interface CurrencyInputProps {
  value: string;
  onChangeValue: (value: string) => void;
  currency: string;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  label?: string;
}

export default function CurrencyInput({
  value,
  onChangeValue,
  currency,
  style,
  placeholder = '0',
  label
}: CurrencyInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (text: string) => {
    // Only allow numbers and one decimal point
    const filteredText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = filteredText.split('.');
    const sanitizedText = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : filteredText;
    
    setLocalValue(sanitizedText);
    onChangeValue(sanitizedText);
  };

  const handleClear = () => {
    setLocalValue('');
    onChangeValue('');
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'VES': return 'Bs.';
      case 'USD': case 'USD-BCV': return '$';
      case 'EUR': return '€';
      case 'COP': return 'COP';
      default: return '';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputContainer, 
        { 
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border
        }
      ]}>
        <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>
          {getCurrencySymbol()}
        </Text>
        <TextInput
          style={[
            styles.input, 
            { color: colors.text }
          ]}
          value={localValue}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
        />
        {localValue !== '' && (
          <TouchableOpacity 
            onPress={handleClear}
            style={styles.clearButton}
          >
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  currencySymbol: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 24,
    padding: 0,
  },
  clearButton: {
    padding: spacing.xs,
  }
});