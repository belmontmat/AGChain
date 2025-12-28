'use client';

import React from 'react';
import { useBlockchain } from '@/context/BlockchainContext';
import { useElection } from '@/hooks/useElection';
import VotingSection from './VotingSection';
import BlockchainExplorer from '../Blockchain/BlockchainExplorer';

export default function VotingExplorerView() {
  const { blockchain, selectedOffice } = useBlockchain();
  const { currentElection } = useElection();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Voting Section */}
      <VotingSection
        blockchain={blockchain}
        selectedOffice={selectedOffice}
        currentElection={currentElection}
      />

      {/* Blockchain Explorer Section */}
      <BlockchainExplorer blockchain={blockchain} />
    </div>
  );
}
