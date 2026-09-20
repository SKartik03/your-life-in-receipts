import React, { useState, useMemo } from 'react';
import type { ProcessedLifeData } from '../types';
import { processLifeData } from '../engine';
import { RAW_SAMPLE_DATA } from '../data/sampleReceipts';
import nomadData from '../data/sampleData.json';
import { ReceiptContext, type ReceiptContextValue } from './receiptContextInstance';

export const ReceiptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawDataset, setRawDataset] = useState<any>(RAW_SAMPLE_DATA);
  const [currentPreset, setCurrentPreset] = useState<'sample' | 'nomad' | 'custom'>('sample');
  const [selectedReceipt, setSelectedReceipt] = useState<import('../types').Receipt | null>(null);
  const [activeTab, setActiveTab] = useState<'chapters' | 'explorer' | 'insights' | 'macro'>('chapters');
  const [highlightedReceiptId, setHighlightedReceiptId] = useState<string | null>(null);

  const processedData: ProcessedLifeData = useMemo(() => {
    return processLifeData(rawDataset);
  }, [rawDataset]);

  const selectPreset = (presetKey: 'sample' | 'nomad') => {
    setCurrentPreset(presetKey);
    if (presetKey === 'sample') {
      setRawDataset(RAW_SAMPLE_DATA);
    } else if (presetKey === 'nomad') {
      setRawDataset(nomadData);
    }
  };

  const loadCustomDataset = (raw: any) => {
    setRawDataset(raw);
    setCurrentPreset('custom');
    setActiveTab('chapters');
  };

  const value: ReceiptContextValue = {
    ...processedData,
    selectedReceipt,
    setSelectedReceipt,
    activeTab,
    setActiveTab,
    currentPreset,
    selectPreset,
    loadCustomDataset,
    highlightedReceiptId,
    setHighlightedReceiptId,
  };

  return <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>;
};
