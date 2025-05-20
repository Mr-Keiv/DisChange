import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MobilePaymentOption, BankTransferOption, ZelleOption, PaymentContextType } from '@/types/payment';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [mobilePaymentOptions, setMobilePaymentOptions] = useState<MobilePaymentOption[]>([
    { id: '1', phoneNumber: '', bankName: '', ownerName: '', cedula: '' }
  ]);
  const [bankTransfer, setBankTransfer] = useState<BankTransferOption>({
    bankName: 'Banco Nacional de Crédito',
    accountNumber: '0191-0123-45-6789012345',
    ownerName: 'Nombre Apellido',
    cedula: 'V-12345678'
  });
  const [zelle, setZelle] = useState<ZelleOption>({
    ownerName: 'Nombre Apellido',
    email: 'ejemplo@mail.com'
  });

  const updateMobilePaymentOption = (updatedOption: MobilePaymentOption) => {
    setMobilePaymentOptions(prev => 
      prev.map(option => option.id === updatedOption.id ? updatedOption : option)
    );
  };

  const removeMobilePaymentOption = (id: string) => {
    if (mobilePaymentOptions.length > 1) {
      setMobilePaymentOptions(prev => prev.filter(option => option.id !== id));
    }
  };

  const addMobilePaymentOption = () => {
    if (mobilePaymentOptions.length < 3) {
      const newId = String(Date.now());
      setMobilePaymentOptions(prev => [
        ...prev, 
        { id: newId, phoneNumber: '', bankName: '', ownerName: '', cedula: '' }
      ]);
    }
  };

  const updateBankTransfer = (updatedOption: BankTransferOption) => {
    setBankTransfer(updatedOption);
  };

  const updateZelle = (updatedOption: ZelleOption) => {
    setZelle(updatedOption);
  };

  const value: PaymentContextType = {
    amount,
    setAmount,
    currency,
    setCurrency,
    mobilePaymentOptions,
    updateMobilePaymentOption,
    removeMobilePaymentOption,
    addMobilePaymentOption,
    bankTransfer,
    updateBankTransfer,
    zelle,
    updateZelle
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}