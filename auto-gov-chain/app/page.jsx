'use client';

import { useState, useEffect } from 'react';
import { BlockchainProvider, useBlockchain } from '@/context/BlockchainContext';
import Header from '@/components/Layout/Header';
import Navigation from '@/components/Layout/Navigation';
import EducationView from '@/components/Education/EducationView';
import DashboardView from '@/components/Dashboard/DashboardView';
import VotingExplorerView from '@/components/Voting/VotingExplorerView';
import FAQView from '@/components/views/FAQView';

function AppContent() {
  const [selectedView, setSelectedView] = useState('education');
  const { blockchain, selectedOffice } = useBlockchain();

  // Auto-redirect to voting tab when election starts
  useEffect(() => {
    const election = blockchain.activeElections[selectedOffice];
    if (election) {
      const timer = setTimeout(() => {
        setSelectedView('voting-explorer');
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [blockchain.activeElections[selectedOffice], selectedOffice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <Header />
        <Navigation selectedView={selectedView} onViewChange={setSelectedView} />

        <main id="main-content" className="mt-8">
          {selectedView === 'education' && <EducationView />}
          {selectedView === 'live-demo' && <DashboardView />}
          {selectedView === 'voting-explorer' && <VotingExplorerView />}
          {selectedView === 'faq' && <FAQView />}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <BlockchainProvider>
      <AppContent />
    </BlockchainProvider>
  );
}
