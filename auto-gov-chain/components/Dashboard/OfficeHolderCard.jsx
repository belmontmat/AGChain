'use client';

import MetricCard from '@/components/Common/MetricCard';
import { useBlockchain } from '@/context/BlockchainContext';

export default function OfficeHolderCard() {
  const { blockchain, selectedOffice } = useBlockchain();
  const holder = blockchain.currentOfficeHolders[selectedOffice];

  if (!holder) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl mb-6 text-blue-500 font-semibold tracking-tight">
          CURRENT OFFICE HOLDER
        </h2>
        <MetricCard>
          <div className="text-slate-400">No office holder currently assigned</div>
        </MetricCard>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl mb-6 text-blue-500 font-semibold tracking-tight">
        CURRENT OFFICE HOLDER
      </h2>
      <MetricCard>
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="text-xl font-bold mb-2">{holder.name}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              Governor • Term: {new Date(holder.termStart).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-green-500/20 px-3 py-1.5 rounded border border-green-500/30 text-xs text-green-500 font-semibold">
            IN OFFICE
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono break-all">
          Public Key: {holder.publicKey}
        </div>
      </MetricCard>
    </div>
  );
}
