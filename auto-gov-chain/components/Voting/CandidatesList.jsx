'use client';

import React from 'react';

export default function CandidatesList({ candidates, title = 'Candidates' }) {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-purple-400 mb-4">
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {candidates.map((candidate, i) => (
          <div
            key={i}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
          >
            <div className="text-sm font-semibold mb-2">
              {candidate.name}
            </div>
            <div className="text-xs text-slate-400 mb-2">
              {candidate.platform}
            </div>
            <div className="text-xs text-slate-500 font-mono break-all">
              {candidate.publicKey.substring(0, 32)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
