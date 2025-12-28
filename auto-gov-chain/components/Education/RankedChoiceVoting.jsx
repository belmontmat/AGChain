'use client';

import { useState } from 'react';

export default function RankedChoiceVoting() {
  const [rcvExample, setRcvExample] = useState({
    round: 0,
    ballots: [
      { id: 1, preferences: ['A', 'B', 'C'] },
      { id: 2, preferences: ['B', 'A', 'C'] },
      { id: 3, preferences: ['C', 'B', 'A'] },
      { id: 4, preferences: ['A', 'C', 'B'] },
      { id: 5, preferences: ['B', 'C', 'A'] },
    ]
  });

  const simulateRCVRound = () => {
    const candidates = ['A', 'B', 'C'];
    const voteCounts = { A: 0, B: 0, C: 0 };

    rcvExample.ballots.forEach(ballot => {
      const firstChoice = ballot.preferences[rcvExample.round];
      if (firstChoice && candidates.includes(firstChoice)) {
        voteCounts[firstChoice]++;
      }
    });

    const loser = Object.entries(voteCounts)
      .sort((a, b) => a[1] - b[1])[0][0];

    setRcvExample({
      ...rcvExample,
      round: rcvExample.round + 1,
      eliminated: loser,
      voteCounts
    });
  };

  const resetRCVExample = () => {
    setRcvExample({
      round: 0,
      ballots: [
        { id: 1, preferences: ['A', 'B', 'C'] },
        { id: 2, preferences: ['B', 'A', 'C'] },
        { id: 3, preferences: ['C', 'B', 'A'] },
        { id: 4, preferences: ['A', 'C', 'B'] },
        { id: 5, preferences: ['B', 'C', 'A'] },
      ]
    });
  };

  return (
    <div>
      <h2 className="text-3xl mb-6 text-blue-500 font-bold tracking-tight">
        Ranked Choice Voting Explained
      </h2>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-sm leading-relaxed text-gray-200">
          Ranked Choice Voting (RCV), also called instant runoff voting, allows voters to rank candidates
          in order of preference. This ensures that the winner has broad support and eliminates the "spoiler
          effect" where similar candidates split the vote.
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        How It Works: Step by Step
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-[13px] text-slate-400 leading-relaxed space-y-5">
          <div>
            <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-md mb-3">
              <strong className="text-blue-500 text-sm">Step 1: Voters Rank Candidates</strong>
            </div>
            Instead of selecting just one candidate, voters rank all candidates in order of preference
            (1st choice, 2nd choice, 3rd choice, etc.). You don't have to rank all candidates—you can
            rank as many or as few as you want.
          </div>

          <div>
            <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-md mb-3">
              <strong className="text-blue-500 text-sm">Step 2: Count First-Choice Votes</strong>
            </div>
            All ballots are examined, and each candidate receives one vote for every ballot that
            ranked them as the first choice. If any candidate has more than 50% of first-choice votes,
            they win immediately. If not, we proceed to Round 2.
          </div>

          <div>
            <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-md mb-3">
              <strong className="text-blue-500 text-sm">Step 3: Eliminate Last Place</strong>
            </div>
            The candidate with the fewest first-choice votes is eliminated from the race. Their votes
            aren't thrown away—instead, each ballot that ranked the eliminated candidate first now
            transfers to that voter's second choice.
          </div>

          <div>
            <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-md mb-3">
              <strong className="text-blue-500 text-sm">Step 4: Repeat Until Majority</strong>
            </div>
            We recount with the transferred votes. If someone now has more than 50%, they win. If not,
            we eliminate the new last-place candidate and transfer their votes. This continues until
            someone achieves a majority.
          </div>
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Interactive Example
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="mb-5">
          <div className="text-sm font-semibold mb-3">
            Sample Election: 5 Voters, 3 Candidates (A, B, C)
          </div>
          <div className="text-xs text-slate-500 mb-4">
            Round {rcvExample.round + 1} {rcvExample.eliminated ? `(Candidate ${rcvExample.eliminated} eliminated)` : '(First Choice Count)'}
          </div>
        </div>

        {/* Ballot Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          {rcvExample.ballots.map(ballot => (
            <div
              key={ballot.id}
              className="bg-black/30 p-3 rounded-md border border-blue-500/20"
            >
              <div className="text-[11px] text-slate-500 mb-2">
                Ballot #{ballot.id}
              </div>
              {ballot.preferences.map((pref, idx) => (
                <div
                  key={idx}
                  className={`
                    text-xs p-2 mb-1 rounded
                    ${idx === rcvExample.round
                      ? 'bg-blue-500/30 text-blue-400'
                      : 'bg-black/20 text-slate-400'
                    }
                  `}
                >
                  {idx + 1}. Candidate {pref}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Vote Counts */}
        {rcvExample.voteCounts && (
          <div className="mb-5">
            <div className="text-[13px] font-semibold mb-3 text-violet-500">
              Current Vote Count:
            </div>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(rcvExample.voteCounts).map(([candidate, count]) => {
                const total = Object.values(rcvExample.voteCounts).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                const hasMajority = count > total / 2;

                return (
                  <div
                    key={candidate}
                    className={`
                      p-4 rounded-md flex-1 min-w-[150px]
                      ${hasMajority
                        ? 'bg-green-500/20 border border-green-500'
                        : 'bg-black/30 border border-blue-500/20'
                      }
                    `}
                  >
                    <div className="text-base font-bold mb-1">
                      Candidate {candidate}
                    </div>
                    <div className={`text-[13px] ${hasMajority ? 'text-green-500' : 'text-slate-500'}`}>
                      {count} votes ({percentage}%)
                      {hasMajority && <span className="ml-2">✓ WINNER</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={simulateRCVRound}
            disabled={rcvExample.round >= 2}
            className={`
              px-6 py-2 rounded-md text-sm font-medium
              transition-all duration-300
              ${rcvExample.round >= 2
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700'
              }
            `}
          >
            {rcvExample.round === 0 ? 'Count Votes' : 'Next Round'}
          </button>
          <button
            onClick={resetRCVExample}
            className="px-6 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 transition-all duration-300"
          >
            Reset
          </button>
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Why RCV for Blockchain Governance?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
          <div className="text-sm font-semibold mb-3 text-blue-500">
            Majority Support Guaranteed
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed">
            The winner always has more than 50% support (when counting transferred votes). This ensures
            elected officials have genuine mandate rather than winning with 35% in a crowded field.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
          <div className="text-sm font-semibold mb-3 text-blue-500">
            No Spoiler Effect
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed">
            Similar candidates don't split the vote. Voters can support their true favorite without
            "wasting" their vote, knowing it will transfer if their first choice is eliminated.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
          <div className="text-sm font-semibold mb-3 text-blue-500">
            Transparent Algorithm
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed">
            The RCV tabulation process is deterministic and verifiable. Running it on a blockchain means
            anyone can independently verify the results by processing the public vote data themselves.
          </div>
        </div>
      </div>
    </div>
  );
}
