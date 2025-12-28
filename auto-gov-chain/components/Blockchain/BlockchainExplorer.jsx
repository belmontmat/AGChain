'use client';

import React from 'react';
import BlockDisplay from './BlockDisplay';

export default function BlockchainExplorer({ blockchain }) {
  const recentBlocks = [...blockchain.blocks].reverse().slice(0, 10);
  const totalBlocks = blockchain.blocks.length;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-500 mb-6 tracking-tight">
        BLOCKCHAIN EXPLORER
      </h2>

      <div className="mb-5 text-sm text-slate-400">
        All governance transactions are recorded immutably. Total blocks: {totalBlocks}
      </div>

      <div className="max-h-[800px] overflow-y-auto pr-2 space-y-4">
        {recentBlocks.map((block) => (
          <BlockDisplay key={block.index} block={block} />
        ))}
      </div>

      {totalBlocks > 10 && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-slate-400 text-center">
          Showing 10 most recent blocks of {totalBlocks} total
        </div>
      )}
    </div>
  );
}
