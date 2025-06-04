import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions
} from 'react-native';
import { usePayment } from '@/context/PaymentContext';
import { useExchangeRates } from '@/context/ExchangeRateContext';
import { fonts, spacing, borderRadius, theme } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
export default function PaymentScreen() {
  const { amount, currency } = usePayment();
  const { selectedRate } = useExchangeRates();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [paymentType, setPaymentType] = useState('mobile');
  const [cedula, setCedula] = useState('');
  const [reference, setReference] = useState('');
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);

  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];

  const [activeTab, setActiveTab] = useState('mobile');

  const handleConfirm = () => {
    // Lógica para confirmar el pago
    console.log('Confirmando pago...');
    console.log('Cédula:', cedula);
    console.log('Referencia:', reference);
  };

  const amountInVes = selectedRate ? Number((amount).toFixed(2)) * selectedRate.promedio : 0;

  const renderPaymentMethod = () => {
    switch (activeTab) {
      case 'mobile':
        return (
          <View style={styles.paymentForm}>
            <Text style={[styles.formTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              Pago Móvil
            </Text>
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

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Referencia
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
                  value={reference}
                  onChangeText={setReference}
                  placeholder={`Número de ${paymentType === 'mobile' ? 'referencia del pago móvil' : 'transferencia'}`}
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    opacity: cedula.trim().length >= 6 && reference.trim().length >= 4 ? 1 : 0.5
                  }
                ]}
                onPress={handleConfirm}
                disabled={cedula.trim().length < 6 || reference.trim().length < 4}
              >
                <Text style={styles.confirmButtonText}>Validar Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'bank':
        return (
          <View style={styles.paymentForm}>
            <Text style={[styles.formTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              Transferencia Bancaria
            </Text>
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

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Referencia
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
                  value={reference}
                  onChangeText={setReference}
                  placeholder={`Número de ${paymentType === 'mobile' ? 'referencia del pago móvil' : 'transferencia'}`}
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    opacity: cedula.trim().length >= 6 && reference.trim().length >= 4 ? 1 : 0.5
                  }
                ]}
                onPress={handleConfirm}
                disabled={cedula.trim().length < 6 || reference.trim().length < 4}
              >
                <Text style={styles.confirmButtonText}>Validar Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.comingSoonContainer}>
            <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
              Próximamente
            </Text>
          </View>
        
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
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
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    marginBottom: spacing.md,
  },
  amountCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  amountLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  amountValue: {
    fontFamily: fonts.bold,
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  amountSecondary: {
    fontFamily: fonts.medium,
    fontSize: 18,
  },
  methodSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  methodButtonActive: {
    borderWidth: 2,
    borderColor: '#0f065a',
  },
  methodButtonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  paymentForm: {
    flex: 1,
  },
  formTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    marginBottom: spacing.lg,
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