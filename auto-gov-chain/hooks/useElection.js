'use client';

import { useEffect } from 'react';
import { useBlockchain } from '@/context/BlockchainContext';
import { MOCK_CANDIDATES } from '@/lib/constants/governance';

export function useElection(onElectionStart) {
  const { blockchain, selectedOffice, forceUpdate } = useBlockchain();

  const currentElection = blockchain.activeElections[selectedOffice];

  // Auto-redirect when election starts
  useEffect(() => {
    if (currentElection && onElectionStart) {
      onElectionStart();
    }
  }, [currentElection, onElectionStart]);

  const advanceElectionPhase = () => {
    const election = blockchain.activeElections[selectedOffice];
    if (!election) return;

    if (election.phase === 'candidate_registration') {
      // Add mock candidates
      MOCK_CANDIDATES.forEach((candidate, i) => {
        blockchain.registerCandidate(election.id, selectedOffice, candidate);
      });
      election.phase = 'voting';
      forceUpdate();
    } else if (election.phase === 'voting') {
      // Simulate 25 votes with random ranked preferences
      for (let i = 0; i < 25; i++) {
        const candidates = election.candidates.map(c => c.candidateId);
        const shuffled = [...candidates].sort(() => Math.random() - 0.5);
        blockchain.castRankedVote(
          selectedOffice,
          `voter_${i}`,
          '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          shuffled,
          '0x' + Array(128).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        );
      }
      election.phase = 'tallying';
      // Immediately conclude the election after tallying starts
      blockchain.concludeElection(selectedOffice);
      forceUpdate();
    }
  };

  const castVote = (voterId, voterPublicKey, rankedChoices, signature) => {
    blockchain.castRankedVote(
      selectedOffice,
      voterId,
      voterPublicKey,
      rankedChoices,
      signature
    );
    forceUpdate();
  };

  return {
    currentElection,
    advanceElectionPhase,
    castVote
  };
}
