'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { GovernanceBlockchain } from '@/lib/blockchain/GovernanceBlockchain';

const BlockchainContext = createContext(null);

export function BlockchainProvider({ children }) {
  const [blockchain] = useState(() => new GovernanceBlockchain());
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [selectedOffice, setSelectedOffice] = useState('Governor');

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const value = {
    blockchain,
    updateTrigger,
    forceUpdate,
    selectedOffice,
    setSelectedOffice
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within BlockchainProvider');
  }
  return context;
}
