import { useContext } from 'react';
import { ReceiptContext, type ReceiptContextValue } from '../context/receiptContextInstance';

export function useReceiptContext(): ReceiptContextValue {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceiptContext must be used within a ReceiptProvider');
  }
  return context;
}
