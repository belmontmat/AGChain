'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useElection } from '@/hooks/useElection';
import CandidatesList from './CandidatesList';
import ElectionResults from './ElectionResults';

export default function VotingSection({ blockchain, selectedOffice, currentElection }) {
  const { advanceElectionPhase } = useElection();

  // Get the most recent completed election if no active election
  const completedElection = !currentElection
    ? blockchain.completedElections[selectedOffice]?.[0]
    : null;

  const displayElection = currentElection || completedElection;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-500 mb-6 tracking-tight">
        RANKED CHOICE VOTING
      </h2>

      {!displayElection ? (
        // No elections yet
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-12 text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
          <div className="text-lg mb-2">No Elections Yet</div>
          <div className="text-sm text-slate-400">
            Elections are automatically triggered by smart contracts based on performance metrics
          </div>
        </div>
      ) : currentElection ? (
        // Active election
        <div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-base font-semibold mb-3">
                  Election for {currentElection.office}
                </div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  This election was autonomously triggered by the blockchain's smart contracts. All votes
                  are cryptographically signed and recorded immutably on-chain. The ranked choice voting
                  system ensures the winner has majority support.
                </div>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded text-xs font-semibold text-blue-500 uppercase whitespace-nowrap ml-4">
                {currentElection.phase.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Election Phase Controls */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex flex-col gap-4">
                {currentElection.phase === 'candidate_registration' && (
                  <div className="text-xs text-slate-400 mb-2">
                    This election is in the candidate registration phase. Click below to add candidates and begin voting.
                  </div>
                )}

                {currentElection.phase === 'voting' && (
                  <div className="text-xs text-slate-400 mb-2">
                    Voting is now open! In this simulation, we'll automatically cast sample votes using ranked choice ballots.
                  </div>
                )}

                <button
                  onClick={advanceElectionPhase}
                  disabled={currentElection.status === 'completed'}
                  className={`
                    w-full px-7 py-3.5 rounded-md font-semibold text-sm
                    transition-all duration-300 uppercase tracking-wider
                    ${currentElection.status === 'completed'
                      ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/20'
                    }
                  `}
                >
                  {currentElection.phase === 'candidate_registration'
                    ? '➡️ Add Candidates & Start Voting'
                    : currentElection.phase === 'voting'
                    ? '🗳️ Simulate Votes & Conclude'
                    : '✓ Election Complete'}
                </button>
              </div>
            </div>
          </div>

          {/* Candidates */}
          {currentElection.candidates.length > 0 && (
            <CandidatesList
              candidates={currentElection.candidates}
              title="Registered Candidates"
            />
          )}

          {/* Results */}
          {currentElection.status === 'completed' && currentElection.results && (
            <ElectionResults
              election={currentElection}
              showTimestamp={false}
            />
          )}
        </div>
      ) : (
        // Completed election view
        <div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mb-6">
            <div className="text-base font-semibold mb-3">
              Most Recent Election - {selectedOffice}
            </div>
            <div className="text-sm text-slate-400 leading-relaxed">
              Viewing the results of the last completed election. The elected official is now in office
              with reset approval ratings and new performance baselines.
            </div>
          </div>

          {/* Candidates */}
          {completedElection.candidates.length > 0 && (
            <CandidatesList
              candidates={completedElection.candidates}
              title="Candidates"
            />
          )}

          {/* Results */}
          {completedElection.results && (
            <ElectionResults
              election={completedElection}
              showTimestamp={true}
            />
          )}
        </div>
      )}
    </div>
  );
}
