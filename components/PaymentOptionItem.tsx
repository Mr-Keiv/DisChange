import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { Copy, X } from 'lucide-react-native';
import { copyToClipboard } from '@/utils/clipboard';
import { theme, fonts, spacing, borderRadius } from '@/constants/theme';

interface PaymentOptionItemProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  removable?: boolean;
}

export default function PaymentOptionItem({
  label,
  value,
  onChangeText,
  onRemove,
  placeholder = '',
  keyboardType = 'default',
  removable = false
}: PaymentOptionItemProps) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (value) {
      const success = await copyToClipboard(value);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
        {removable && onRemove && (
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <X size={18} color={colors.negative} />
          </TouchableOpacity>
        )}
      </View>
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border
        }
      ]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
        />
        <TouchableOpacity 
          onPress={handleCopy} 
          style={styles.copyButton}
          disabled={!value}
        >
          <View style={[
            styles.copyButtonInner, 
            { 
              backgroundColor: isCopied ? colors.positive : colors.primary,
              opacity: value ? 1 : 0.5
            }
          ]}>
            <Copy size={16} color="white" />
            <Text style={styles.copyText}>
              {isCopied ? 'Copiado' : 'Copiar'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingLeft: spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    padding: spacing.md,
    paddingLeft: 0,
  },
  copyButton: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  copyButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.round,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  copyText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  }
});