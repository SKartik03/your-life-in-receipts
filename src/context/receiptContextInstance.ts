import { createContext } from 'react';
import type { ProcessedLifeData, Receipt } from '../types';

export interface ReceiptContextValue extends ProcessedLifeData {
  selectedReceipt: Receipt | null;
  setSelectedReceipt: (r: Receipt | null) => void;
  activeTab: 'chapters' | 'explorer' | 'insights' | 'macro';
  setActiveTab: (tab: 'chapters' | 'explorer' | 'insights' | 'macro') => void;
  currentPreset: 'sample' | 'nomad' | 'custom';
  selectPreset: (preset: 'sample' | 'nomad') => void;
  loadCustomDataset: (raw: any) => void;
  highlightedReceiptId: string | null;
  setHighlightedReceiptId: (id: string | null) => void;
}

export const ReceiptContext = createContext<ReceiptContextValue | null>(null);
