'use client';

import { useState, useEffect } from 'react';
import { useBlockchain } from '@/context/BlockchainContext';

export function useSimulation() {
  const { blockchain, forceUpdate, selectedOffice } = useBlockchain();
  const [simulationSpeed, setSimulationSpeed] = useState(1000);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  useEffect(() => {
    if (!autoSimulate) return;

    // Stop simulation if election is active
    const election = blockchain.activeElections[selectedOffice];
    if (election) {
      setAutoSimulate(false);
      return;
    }

    const interval = setInterval(() => {
      const currentMetrics = blockchain.performanceMetrics[selectedOffice]?.current;
      if (!currentMetrics) return;

      // Check again before updating to prevent race condition
      const activeElection = blockchain.activeElections[selectedOffice];
      if (activeElection) {
        setAutoSimulate(false);
        return;
      }

      // Simulate metric changes
      const newMetrics = {
        gdp: Math.max(85, Math.min(115, currentMetrics.gdp + (Math.random() - 0.5) * 3)),
        educationRanking: Math.max(5, Math.min(50, currentMetrics.educationRanking + Math.floor((Math.random() - 0.5) * 4))),
        approvalRating: Math.max(25, Math.min(85, currentMetrics.approvalRating + (Math.random() - 0.5) * 8)),
        unemploymentRate: Math.max(2, Math.min(10, currentMetrics.unemploymentRate + (Math.random() - 0.5) * 0.5)),
        infrastructureScore: Math.max(60, Math.min(95, currentMetrics.infrastructureScore + (Math.random() - 0.5) * 4))
      };

      blockchain.updateMetrics(selectedOffice, newMetrics);
      setLastUpdateTime(Date.now());
      forceUpdate();
    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [autoSimulate, simulationSpeed, selectedOffice, blockchain, forceUpdate]);

  return {
    simulationSpeed,
    setSimulationSpeed,
    autoSimulate,
    setAutoSimulate,
    lastUpdateTime
  };
}
