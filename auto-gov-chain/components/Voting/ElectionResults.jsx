'use client';

import React from 'react';

export default function ElectionResults({ election, showTimestamp = false }) {
  if (!election.results) {
    return null;
  }

  const { results, candidates } = election;
  const winner = candidates.find(c => c.candidateId === results.winner);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-green-500 mb-4">
        Election Results
      </h3>
      <div className="bg-slate-800/50 backdrop-blur-sm border-l-4 border-green-500 rounded-lg p-6">
        <div className="text-base font-bold mb-3">
          Winner: {winner?.name || 'Unknown'}
        </div>
        <div className="text-sm text-slate-400 mb-4">
          Total Ballots: {results.totalBallots} | Rounds: {results.rounds.length}
          {showTimestamp && election.completedAt && (
            <>
              <br />
              Completed: {new Date(election.completedAt).toLocaleString()}
            </>
          )}
        </div>

        <div className="text-xs font-semibold mb-3 text-purple-400">
          Ranked Choice Tabulation:
        </div>

        {results.rounds.map((round, i) => (
          <div
            key={i}
            className="mb-3 p-3 bg-black/20 rounded"
          >
            <div className="text-xs mb-2 text-slate-400">
              Round {i + 1}:
            </div>
            {Object.entries(round.voteCounts).map(([candidateId, count]) => {
              const candidate = candidates.find(c => c.candidateId === candidateId);
              const percentage = ((count / round.totalVotes) * 100).toFixed(1);
              return (
                <div
                  key={candidateId}
                  className="flex justify-between text-xs mb-1"
                >
                  <span className="text-slate-300">{candidate?.name || 'Unknown'}</span>
                  <span className="text-blue-400">{count} votes ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
