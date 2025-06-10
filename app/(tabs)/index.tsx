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
  StatusBar,
  Image,
  Platform
} from 'react-native';
import { useExchangeRates } from '@/context/ExchangeRateContext';
import { RefreshCw } from 'lucide-react-native';
import { formatCurrency } from '@/utils/formatters';
import CurrencyOutput from '@/components/CurrencyOutput';
import PaymentModal from '@/components/PaymentModal';
import { fonts, spacing, borderRadius } from '@/constants/theme';
import CardReader from '../../hooks/nexgo/cardReader';

const { width } = Dimensions.get('window');
// Escalado de dimensiones mejorado
const scaleFactor = 0.7; // Aumentado de 0.6 a 0.7

const isSmallScreen = width < 375 * scaleFactor;
const buttonSize = Math.min((width - spacing.xl * scaleFactor * 2 - spacing.md * scaleFactor * 2.5) / 3, 90 * scaleFactor);
const displayFontSize = Math.min(width * 0.12 * scaleFactor, 140 * scaleFactor); // Display más grande

export default function CalculatorScreen() {
  const {
    rates,
    selectedRate,
    setSelectedRate,
    lastUpdate,
    refreshRates
  } = useExchangeRates();

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
    } else if (!selectedRate) {
      Alert.alert("Seleccionar Tasa", "Por favor, selecciona una tasa de cambio antes de proceder.");
    } else {
      Alert.alert("Monto Inválido", "Ingresa un monto mayor a cero para proceder al pago.");
    }
  };

  const handlePaymentConfirm = async (cedula: string, amount2: string) => {
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

  const renderButton = (content: string | React.ReactNode, onPress: () => void, type: 'number' | 'clear' | 'delete' | 'refresh' | 'wide' = 'number') => {
    let buttonBackgroundColor = isDark ? '#2E2E3A' : '#E0E0E0';
    let buttonTextColor = isDark ? '#FFFFFF' : '#333333';
    let iconColor = isDark ? '#FFFFFF' : '#333333';

    if (type === 'delete') {
      buttonBackgroundColor = isDark ? '#B7A429' : '#F4D03F';
      buttonTextColor = '#000000';
      iconColor = '#000000';
    } else if (type === 'clear') {
      buttonBackgroundColor = isDark ? '#9B2C2C' : '#EF4444';
      buttonTextColor = '#FFFFFF';
      iconColor = '#FFFFFF';
    } else if (type === 'refresh') {
      buttonBackgroundColor = isDark ? '#1F7A8C' : '#34D399';
      buttonTextColor = '#FFFFFF';
      iconColor = '#FFFFFF';
    } else if (type === 'wide') {
      buttonBackgroundColor = isDark ? '#3B4152' : '#C0C0C0';
      buttonTextColor = isDark ? '#F9FAFB' : '#1F2937';
    }

    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: buttonBackgroundColor,
            width: type === 'wide' ? buttonSize * 2 + spacing.md * scaleFactor * 1.5 : buttonSize,
            height: buttonSize * 0.8, // Altura original
          }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {typeof content === 'string' ? (
          <Text style={[
            styles.buttonText,
            {
              color: buttonTextColor,
              fontSize: type === 'number' ? 32 * scaleFactor : 18 * scaleFactor, // Solo números más grandes
            }
          ]}>
            {content}
          </Text>
        ) : React.isValidElement(content) ? React.cloneElement(content as React.ReactElement, { color: iconColor, size: 28 * scaleFactor }) : content}
      </TouchableOpacity>
    );
  };

  const renderRateSelector = () => (
    <View style={styles.rateSelector}>
      {rates.map((rate) => (
        <TouchableOpacity
          key={rate.fuente}
          style={[
            styles.rateOption,
            selectedRate?.fuente === rate.fuente && styles.rateOptionSelected,
            {
              backgroundColor: isDark ? '#2D3748' : '#F7FAFC',
              borderColor: selectedRate?.fuente === rate.fuente ? '#4299E1' : (isDark ? '#4A5568' : '#E2E8F0'),
            }
          ]}
          onPress={() => setSelectedRate(rate)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.rateOptionText,
            selectedRate?.fuente === rate.fuente && styles.rateOptionTextSelected,
            { color: isDark ? '#E2E8F0' : '#2D3748', fontSize: (isSmallScreen ? 15 : 17) * scaleFactor } // Texto más grande
          ]}>
            {rate.nombre}
          </Text>
          <Text style={[
            styles.rateValue,
            { color: isDark ? '#CBD5E0' : '#718096', fontSize: (isSmallScreen ? 13 : 15) * scaleFactor } // Texto más grande
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
        backgroundColor={isDark ? '#1A202C' : '#FFFFFF'}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: isDark ? '#1A202C' : '#FFFFFF' }]}
      >
        {/* Header reorganizado */}
        <View style={styles.headerContainer}>
          {/* Logo y nombre a la izquierda */}
          <View style={styles.leftHeader}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={{ width: 45 * scaleFactor, height: 45 * scaleFactor, marginRight: spacing.sm * scaleFactor }}
              />
              <View>
               
                {lastUpdate && (
                  <Text style={[
                    styles.lastUpdate,
                    {
                      color: isDark ? '#A0AEC0' : '#718096',
                      fontSize: (isSmallScreen ? 14 : 16) * scaleFactor, // Texto más grande
                    }
                  ]}>
                    Última actualización: {new Date(lastUpdate).toLocaleTimeString()}
                  </Text>
                )}
              </View>
            </View>
          </View>
          
          {/* Selector de tasas a la derecha */}
          <View style={styles.rightHeader}>
            {renderRateSelector()}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDark ? '#4CAF50' : '#34D399'}
            />
          }
          scrollEnabled={false}
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.displayContainer}>
            <Text style={[
              styles.amountDisplay,
              {
                color: isDark ? '#E2E8F0' : '#2D3748',
                fontSize: displayFontSize + (8 * scaleFactor), // Display aún más grande
                fontWeight: '600'
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
              {renderButton('7', () => handleNumberPress('7'), 'number')}
              {renderButton('8', () => handleNumberPress('8'), 'number')}
              {renderButton('9', () => handleNumberPress('9'), 'number')}
            </View>
            <View style={styles.row}>
              {renderButton('4', () => handleNumberPress('4'), 'number')}
              {renderButton('5', () => handleNumberPress('5'), 'number')}
              {renderButton('6', () => handleNumberPress('6'), 'number')}
            </View>
            <View style={styles.row}>
              {renderButton('1', () => handleNumberPress('1'), 'number')}
              {renderButton('2', () => handleNumberPress('2'), 'number')}
              {renderButton('3', () => handleNumberPress('3'), 'number')}
            </View>
            <View style={styles.row}>
              {renderButton('.', () => handleNumberPress('.'), 'number')}
              {renderButton('0', () => handleNumberPress('0'), 'number')}
              {renderButton('⌫', handleDelete, 'delete')}
            </View>
            <View style={styles.row}>
              {renderButton('Borrar', handleClear, 'clear')}
              {renderButton(
                <RefreshCw size={28 * scaleFactor} />, // Icono más grande
                onRefresh,
                'refresh'
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
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg * scaleFactor,
    paddingBottom: spacing.xl * scaleFactor,
  },
  // Nuevo estilo para el header reorganizado
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg * scaleFactor,
    paddingTop: spacing.xl * scaleFactor,
    paddingBottom: spacing.lg * scaleFactor,
    marginBottom: spacing.md * scaleFactor,
  },
  leftHeader: {
    flex: 1,
  },
  rightHeader: {
    flex: 1,
    alignItems: 'flex-end',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.bold,
  },
  lastUpdate: {
    fontFamily: fonts.regular,
    marginTop: spacing.xs * 0.5,
  },
  rateSelector: {
    flexDirection: 'column',
    gap: spacing.xs * scaleFactor,
    minWidth: 120 * scaleFactor,
  },
  rateOption: {
    paddingVertical: spacing.sm * scaleFactor,
    paddingHorizontal: spacing.sm * scaleFactor,
    borderRadius: borderRadius.md * scaleFactor,
    borderWidth: 2 * scaleFactor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateOptionSelected: {
    // El color de borde se maneja en el componente
  },
  rateOptionText: {
    fontFamily: fonts.semiBold,
    marginBottom: (spacing.xs / 2) * scaleFactor,
    textAlign: 'center',
  },
  rateOptionTextSelected: {
    // El color de texto activo se maneja en el componente
  },
  rateValue: {
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  displayContainer: {
    marginBottom: spacing.xl * scaleFactor,
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm * scaleFactor,
  },
  amountDisplay: {
    fontFamily: fonts.bold,
    marginBottom: spacing.sm * scaleFactor,
    textAlign: 'right',
    width: '100%',
  },
  keypad: {
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md * scaleFactor,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg * scaleFactor,
    flexGrow: 1,
    marginHorizontal: (spacing.xs / 2) * scaleFactor,
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  }
});