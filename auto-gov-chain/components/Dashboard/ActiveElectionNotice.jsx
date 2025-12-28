'use client';

import { AlertCircle } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';

export default function ActiveElectionNotice() {
  const { blockchain, selectedOffice } = useBlockchain();
  const election = blockchain.activeElections[selectedOffice];

  if (!election) {
    return null;
  }

  return (
    <div className="mt-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500 rounded-lg p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <AlertCircle size={24} className="text-purple-500" />
        <div className="text-lg font-bold">
          AUTONOMOUS ELECTION ACTIVATED
        </div>
      </div>

      <div className="text-sm text-slate-300 mb-4">
        Smart contract has initiated an election for {election.office} based on performance triggers
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="text-xs px-3 py-2 bg-black/30 rounded">
          Phase: <span className="text-purple-500 font-semibold">{election.phase.toUpperCase()}</span>
        </div>
        <div className="text-xs px-3 py-2 bg-black/30 rounded">
          Candidates: <span className="text-purple-500 font-semibold">{election.candidates.length}</span>
        </div>
        <div className="text-xs px-3 py-2 bg-black/30 rounded">
          Votes Cast: <span className="text-purple-500 font-semibold">{election.votes.length}</span>
        </div>
      </div>
    </div>
  );
}
