import React, { createContext, useState, useEffect, useContext } from 'react';
import { ApiStatus, ExchangeRate } from '@/types/api';

interface ExchangeRateContextType {
  rates: ExchangeRate[];
  selectedRate: ExchangeRate | null;
  setSelectedRate: (rate: ExchangeRate) => void;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refreshRates: () => Promise<void>;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

export function ExchangeRateProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      // Check API status first
      const statusResponse = await fetch('https://ve.dolarapi.com/v1/estado');
      const statusData: ApiStatus = await statusResponse.json();

      if (statusData.estado !== 'Disponible') {
        throw new Error('El servicio no está disponible en este momento');
      }

      // Fetch exchange rates
      const ratesResponse = await fetch('https://ve.dolarapi.com/v1/dolares');
      const ratesData: ExchangeRate[] = await ratesResponse.json();
      
      // Filter only official and bitcoin rates
      const filteredRates = ratesData.filter(rate => 
        rate.fuente === 'oficial' 
      );

      setRates(filteredRates);
      setLastUpdate(new Date());
      setError(null);

      // Set default selected rate to BCV if not already selected
      if (!selectedRate) {
        const bcvRate = filteredRates.find(rate => rate.fuente === 'oficial');
        if (bcvRate) setSelectedRate(bcvRate);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las tasas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ExchangeRateContext.Provider
      value={{
        rates,
        selectedRate,
        setSelectedRate,
        isLoading,
        error,
        lastUpdate,
        refreshRates: fetchRates
      }}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRates() {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRates must be used within an ExchangeRateProvider');
  }
  return context;
}