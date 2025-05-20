import { ExchangeRate } from '@/types/exchangeRate';

export function mockExchangeRates(): ExchangeRate[] {
  const currentDate = new Date();
  
  return [
    {
      id: '1',
      code: 'USD',
      name: 'Dólar Paralelo',
      rate: 37.52,
      previousRate: 37.15,
      change: 0.37,
      changePercent: 1.00,
      source: 'Monitor Dólar',
      timestamp: currentDate
    },
    {
      id: '2',
      code: 'USD-BCV',
      name: 'Dólar BCV',
      rate: 36.82,
      previousRate: 36.70,
      change: 0.12,
      changePercent: 0.33,
      source: 'BCV Oficial',
      timestamp: currentDate
    },
    {
      id: '3',
      code: 'EUR',
      name: 'Euro',
      rate: 40.94,
      previousRate: 41.22,
      change: -0.28,
      changePercent: -0.68,
      source: 'Monitor Dólar',
      timestamp: currentDate
    },
    {
      id: '4',
      code: 'COP',
      name: 'Peso Colombiano',
      rate: 0.0093,
      previousRate: 0.0092,
      change: 0.0001,
      changePercent: 1.09,
      source: 'Monitor Dólar',
      timestamp: currentDate
    },
    {
      id: '5',
      code: 'VES',
      name: 'Bolívar',
      rate: 1,
      previousRate: 1,
      change: 0,
      changePercent: 0,
      timestamp: currentDate
    }
  ];
}