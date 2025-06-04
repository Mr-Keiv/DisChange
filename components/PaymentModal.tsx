import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ScrollView
} from 'react-native';
import { X, Phone, Building2 } from 'lucide-react-native';
import { fonts, spacing, borderRadius } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatters';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (cedula: string, amount: string) => void;
  amount: number;
  rate?: { nombre: string; promedio: number };
}

export default function PaymentModal({
  visible,
  onClose,
  onConfirm,
  amount,
  rate
}: PaymentModalProps) {
  const [cedula, setCedula] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  if (!rate) return null;

  const handleConfirm = () => {
    if (cedula.trim().length >= 6) {
      // Ensure amount has max 2 decimals and multiply by rate
      const baseAmount = Number(amount.toFixed(2));
      const calculatedAmount = (baseAmount * rate.promedio).toFixed(2);
      
      // Convert to integer by multiplying by 100 to move decimals left
      const formattedAmount = Math.round(Number(calculatedAmount) * 100);
      
      onConfirm(cedula, formattedAmount.toString());
      setCedula('');
    }
  };

  const renderPaymentForm = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Cédula del cliente
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#111827' : '#F3F4F6',
                color: isDark ? '#F9FAFB' : '#1F2937',
                borderColor: isDark ? '#374151' : '#E5E7EB'
              }
            ]}
            value={cedula}
            onChangeText={setCedula}
            placeholder="Ingrese la cédula"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            keyboardType="numeric"
          />
        </View>


        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              opacity: cedula.trim().length >= 6 ? 1 : 0.5
            }
          ]}
          onPress={handleConfirm}
          disabled={cedula.trim().length < 6}
        >
          <Text style={styles.confirmButtonText}>Proceder Pago</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              Procesar Pago
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={[styles.amountCard, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]}>
              <Text style={[styles.amountLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Monto a pagar
              </Text>
              <Text style={[styles.amountValue, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                {formatCurrency(amount, 'USD', 2)}
              </Text>
              <Text style={[styles.rateInfo, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {rate.nombre}: {formatCurrency(Number((amount).toFixed(2)) * rate.promedio, 'VES', 2)}
              </Text>
            </View>
            {renderPaymentForm()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    maxHeight: '85%',
    minHeight: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24
  },
  closeButton: {
    padding: spacing.xs
  },
  content: {
    flex: 1,
    paddingBottom: spacing.xl
  },
  amountCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    marginHorizontal: spacing.sm
  },
  amountLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    marginBottom: spacing.xs
  },
  amountValue: {
    fontFamily: fonts.bold,
    fontSize: 32,
    marginBottom: spacing.xs
  },
  rateInfo: {
    fontFamily: fonts.medium,
    fontSize: 16
  },
  paymentTypeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm
  },
  paymentTypeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm
  },
  paymentTypeButtonActive: {
    borderWidth: 2,
    borderColor: '#0f065a'
  },
  paymentTypeText: {
    fontFamily: fonts.medium,
    fontSize: 14
  },
  formContainer: {
    gap: spacing.lg,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm
  },
  inputContainer: {
    marginBottom: spacing.md
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    marginBottom: spacing.xs
  },
  input: {
    fontFamily: fonts.regular,
    fontSize: 16,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1
  },
  confirmButton: {
    backgroundColor: '#0f065a',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md
  },
  confirmButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF'
  }
});