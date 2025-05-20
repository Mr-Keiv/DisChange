import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
  RefreshControl,
  StatusBar
} from 'react-native';
import { useExchangeRates } from '@/context/ExchangeRateContext';
import { useRouter } from 'expo-router';
import { Calculator, RefreshCw } from 'lucide-react-native';
import { formatCurrency } from '@/utils/formatters';
import CurrencyOutput from '@/components/CurrencyOutput';
import PaymentModal from '@/components/PaymentModal';
import { fonts, spacing, borderRadius } from '@/constants/theme';
import CardReader from '../../hooks/nexgo/cardReader';


const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const buttonSize = Math.min((width - spacing.xl * 2 - spacing.md * 2.5) / 3, 90);
const displayFontSize = Math.min(width * 0.1, 40);

export default function CalculatorScreen() { 
  const {
    rates,
    selectedRate,
    setSelectedRate,
    isLoading,
    error,
    lastUpdate,
    refreshRates
  } = useExchangeRates();

  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [amount, setAmount] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (rates.length > 0 && !selectedRate) {
      setSelectedRate(rates.find(rate => rate.fuente === 'oficial') || rates[0]);
    }
  }, [rates, selectedRate, setSelectedRate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRates();
    setRefreshing(false);
  };

  const handleNumberPress = (num: string) => {
    if (amount.includes('.') && num === '.') return;
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else {
      setAmount(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
  };

  const calculatedAmount = selectedRate && amount
    ? parseFloat(amount) * selectedRate.promedio
    : 0;

  const handleProceedToPayment = () => {
    if (calculatedAmount > 0 && selectedRate) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = async(cedula: string, amount2: string) => {
    console.log('Cédula:', cedula);
    console.log('Monto:', amount2);
    const paymentData = {
      amount: parseFloat(amount2),
      referenceNo: `REF-${Date.now()}`,
      documentNumber: cedula,
      waiterNum: '1',
      transType: 1
    };
    
    try {
      const result = await CardReader.processPayment(paymentData);
      console.log('Resultado del pago:', result);
      
      Alert.alert(
        'Pago Procesado',
        `Monto: ${formatCurrency(parseFloat(amount2), 'VEF')}\nReferencia: ${paymentData.referenceNo}\nCédula: ${paymentData.documentNumber}\nEstado: ${result || 'Completado'}`
      );
    } catch (error) {
      console.error('Error en el pago:', error);
      Alert.alert(
        'Error en el Pago',
        'Hubo un problema al procesar el pago. Por favor intente nuevamente.'
      );
    } finally {
      setShowPaymentModal(false);
      setAmount('');
    }
  };

  const renderButton = (content: string | React.ReactNode, onPress: () => void, isWide?: boolean) => (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
          width: isWide ? buttonSize * 2.5 + spacing.md : buttonSize,
          height: buttonSize * 0.8
        }
      ]}
      onPress={onPress}
    >
      {typeof content === 'string' ? (
        <Text style={[
          styles.buttonText,
          {
            color: isDark ? '#F9FAFB' : '#1F2937',
            fontSize: isSmallScreen ? 20 : 20
          }
        ]}>
          {content}
        </Text>
      ) : content}
    </TouchableOpacity>
  );

  const renderRateSelector = () => (
    <View style={styles.rateSelector}>
      {rates.map((rate) => (
        <TouchableOpacity
          key={rate.fuente}
          style={[
            styles.rateOption,
            selectedRate?.fuente === rate.fuente && styles.rateOptionSelected,
            {
              backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
              borderColor: selectedRate?.fuente === rate.fuente ? '#3B82F6' : isDark ? '#374151' : '#E5E7EB'
            }
          ]}
          onPress={() => setSelectedRate(rate)}
        >
          <Text style={[
            styles.rateOptionText,
            selectedRate?.fuente === rate.fuente && styles.rateOptionTextSelected,
            { color: isDark ? '#F9FAFB' : '#1F2937' }
          ]}>
            {rate.nombre}
          </Text>
          <Text style={[
            styles.rateValue,
            { color: isDark ? '#9CA3AF' : '#6B7280' }
          ]}>
            {formatCurrency(rate.promedio, 'VES')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#FFFFFF'}
      />
      <SafeAreaView 
        style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Calculator size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
              <Text style={[
                styles.title,
                {
                  color: isDark ? '#F9FAFB' : '#1F2937',
                  fontSize: isSmallScreen ? 24 : 28
                }
              ]}>
                DisChange
              </Text>
            </View>
            {lastUpdate && (
              <Text style={[
                styles.lastUpdate,
                {
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  fontSize: isSmallScreen ? 12 : 14
                }
              ]}>
                Última actualización: {new Date(lastUpdate).toLocaleTimeString()}
              </Text>
            )}
          </View>

          {renderRateSelector()}

          <View style={styles.displayContainer}>
            <Text style={[
              styles.amountDisplay,
              {
                color: isDark ? '#F9FAFB' : '#1F2937',
                fontSize: displayFontSize
              }
            ]}>
              $ {amount || '0'}
            </Text>
            {amount !== '' && selectedRate && (
              <CurrencyOutput
                value={calculatedAmount}
                currency="VES"
                label={`Total en bolívares (${selectedRate.nombre})`}
                isPrimary
                onPress={handleProceedToPayment}
              />
            )}
          </View>

          <View style={styles.keypad}>
            <View style={styles.row}>
              {renderButton('7', () => handleNumberPress('7'))}
              {renderButton('8', () => handleNumberPress('8'))}
              {renderButton('9', () => handleNumberPress('9'))}
            </View>
            <View style={styles.row}>
              {renderButton('4', () => handleNumberPress('4'))}
              {renderButton('5', () => handleNumberPress('5'))}
              {renderButton('6', () => handleNumberPress('6'))}
            </View>
            <View style={styles.row}>
              {renderButton('1', () => handleNumberPress('1'))}
              {renderButton('2', () => handleNumberPress('2'))}
              {renderButton('3', () => handleNumberPress('3'))}
            </View>
            <View style={styles.row}>
              {renderButton('.', () => handleNumberPress('.'))}
              {renderButton('0', () => handleNumberPress('0'))}
              {renderButton('⌫', handleDelete)}
            </View>
            <View style={styles.row}>
              {renderButton('Borrar', handleClear, true)}
              {renderButton(
                <RefreshCw size={20} color={isDark ? '#F9FAFB' : '#1F2937'} />,
                onRefresh
              )}
            </View>
          </View>
        </ScrollView>

        {selectedRate && (
          <PaymentModal
            visible={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onConfirm={handlePaymentConfirm}
            amount={parseFloat(amount) || 0}
            rate={selectedRate}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.xl,
    paddingHorizontal: isSmallScreen ? spacing.md : spacing.lg,
  },
  header: {
    marginBottom: isSmallScreen ? spacing.md : spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    marginLeft: spacing.sm,
  },
  lastUpdate: {
    fontFamily: fonts.regular,
  },
  rateSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  rateOption: {
    flex: 1,
    minWidth: 100,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  rateOptionSelected: {
    borderColor: '#3B82F6',
  },
  rateOptionText: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? 12 : 14,
    marginBottom: spacing.xs,
  },
  rateOptionTextSelected: {
    color: '#3B82F6',
  },
  rateValue: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? 10 : 12,
  },
  displayContainer: {
    marginBottom: isSmallScreen ? spacing.lg : spacing.xl,
  },
  amountDisplay: {
    fontFamily: fonts.bold,
    marginBottom: spacing.sm,
  },
  keypad: {
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  buttonText: {
    fontFamily: fonts.semiBold,
  }
});