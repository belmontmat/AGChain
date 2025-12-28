'use client';

import React from 'react';

function TransactionDetails({ tx }) {
  switch (tx.type) {
    case 'VOTE_CAST':
      return (
        <div className="text-xs text-slate-400">
          Vote Hash: {tx.voteHash?.substring(0, 16)}...<br />
          Verified: {tx.signatureVerified ? '✓' : '✗'}
        </div>
      );

    case 'METRICS_UPDATE':
      return (
        <div className="text-xs text-slate-400">
          Office: {tx.office}<br />
          GDP: {tx.metrics?.gdp?.toFixed(1)} | Approval: {tx.metrics?.approvalRating?.toFixed(1)}%
        </div>
      );

    case 'ELECTION_INITIATED':
      return (
        <div className="text-xs text-slate-400">
          Office: {tx.office}<br />
          Triggers: {tx.triggers?.join(', ')}<br />
          Autonomous: {tx.autonomousActivation ? '✓' : '✗'}
        </div>
      );

    case 'ELECTION_CONCLUDED':
      return (
        <div className="text-xs text-slate-400">
          Winner: {tx.winner}<br />
          Votes: {tx.totalVotes} | Rounds: {tx.rounds}
        </div>
      );

    case 'CANDIDATE_REGISTERED':
      return (
        <div className="text-xs text-slate-400">
          {tx.candidate?.name}<br />
          Verified: {tx.blockchainVerified ? '✓' : '✗'}
        </div>
      );

    case 'OFFICE_INITIALIZATION':
      return (
        <div className="text-xs text-slate-400">
          Official: {tx.holder?.name}<br />
          Term: 4 years
        </div>
      );

    default:
      return (
        <div className="text-xs text-slate-400">
          {JSON.stringify(tx, null, 2).substring(0, 100)}...
        </div>
      );
  }
}

export default function BlockDisplay({ block }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-bold text-blue-500">
          Block #{block.index}
        </div>
        <div className="text-xs text-slate-400">
          {new Date(block.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="text-xs text-slate-500 mb-2 break-all font-mono">
        Hash: {block.hash.substring(0, 24)}...
      </div>

      <div className="border-t border-blue-500/20 pt-3 space-y-2">
        {block.transactions.map((tx, j) => (
          <div
            key={j}
            className="p-2 bg-black/30 rounded"
          >
            <div className="text-xs font-semibold text-purple-400 mb-1.5 uppercase tracking-wide">
              {tx.type.replace(/_/g, ' ')}
            </div>
            <TransactionDetails tx={tx} />
          </div>
        ))}
      </div>
    </div>
  );
}
