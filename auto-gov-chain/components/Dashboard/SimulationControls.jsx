'use client';

import { Activity, AlertCircle } from 'lucide-react';
import MetricCard from '@/components/Common/MetricCard';
import { useBlockchain } from '@/context/BlockchainContext';
import { useSimulation } from '@/hooks/useSimulation';

export default function SimulationControls() {
  const { blockchain, selectedOffice, forceUpdate } = useBlockchain();
  const {
    simulationSpeed,
    setSimulationSpeed,
    autoSimulate,
    setAutoSimulate,
    lastUpdateTime
  } = useSimulation();

  const election = blockchain.activeElections[selectedOffice];
  const metrics = blockchain.performanceMetrics[selectedOffice]?.current;

  const handlePolicyDecision = (updates) => {
    if (!metrics) return;
    blockchain.updateMetrics(selectedOffice, {
      ...metrics,
      ...updates
    });
    forceUpdate();
  };

  return (
    <div className="sticky top-5">
      <MetricCard
        className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-purple-500/30"
      >
        <h3 className="text-lg mb-5 text-purple-500 font-semibold flex items-center gap-2">
          <Activity size={20} />
          SIMULATION CONTROLS
        </h3>

        {/* Active Simulation Status */}
        {autoSimulate && !election && (
          <div className="mb-5 p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/50 rounded-md flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-1">
                SIMULATION ACTIVE
              </div>
              <div className="text-sm text-purple-300 font-semibold">
                Last Update: {new Date(lastUpdateTime).toLocaleTimeString()}
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          </div>
        )}

        {/* Paused During Election */}
        {!autoSimulate && election && (
          <div className="mb-5 p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-md flex items-center gap-3">
            <AlertCircle size={20} className="text-orange-500" />
            <div>
              <div className="text-xs text-yellow-400 font-semibold mb-1">
                SIMULATION PAUSED
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {election.phase === 'candidate_registration'
                  ? 'Election in progress - add candidates to continue'
                  : election.phase === 'voting'
                  ? 'Voting in progress - complete election to resume'
                  : 'Tallying votes - view results in Voting & Blockchain tab'}
              </div>
            </div>
          </div>
        )}

        {/* Auto-Simulate Toggle */}
        <div className="mb-6">
          <label
            className={`flex items-center gap-3 text-sm p-3 rounded-md border transition-all cursor-pointer ${
              autoSimulate
                ? 'bg-purple-500/20 border-purple-500/50'
                : 'bg-black/20 border-purple-500/20'
            } ${election ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="checkbox"
              checked={autoSimulate}
              onChange={(e) => setAutoSimulate(e.target.checked)}
              disabled={!!election}
              className="w-4.5 h-4.5 cursor-pointer disabled:cursor-not-allowed"
            />
            <div>
              <div className={`font-semibold ${autoSimulate ? 'text-purple-300' : 'text-slate-200'}`}>
                Auto-Simulate Metrics
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {election ? 'Disabled during active elections' : 'Metrics update automatically'}
              </div>
            </div>
          </label>
        </div>

        {/* Speed Control */}
        {autoSimulate && (
          <div className="mb-6">
            <div className="text-xs text-slate-400 mb-2 font-semibold">
              Update Speed
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="text-xs text-purple-500 text-center mt-2">
              {simulationSpeed < 1000 ? 'Fast' : simulationSpeed < 2000 ? 'Medium' : 'Slow'} ({simulationSpeed}ms)
            </div>
          </div>
        )}

        {/* Policy Decisions */}
        <div className="border-t border-purple-500/20 pt-5 mb-5">
          <div className="text-xs text-slate-400 mb-3 font-semibold">
            Policy Decisions
          </div>
          <div className="text-xs text-slate-300 mb-4 leading-relaxed">
            Make policy choices that affect metrics over time. Watch how decisions cascade through the economy!
          </div>

          <div className="flex flex-col gap-2">
            {/* Cut Education Budget */}
            <button
              onClick={() =>
                handlePolicyDecision({
                  gdp: Math.min(115, metrics.gdp + 2),
                  educationRanking: Math.min(50, metrics.educationRanking + 3),
                  approvalRating: metrics.approvalRating - 3
                })
              }
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                fontSize: '10px',
                padding: '10px',
                lineHeight: '1.4',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📚 Cut Education Budget<br/>
              <span style={{ fontSize: '9px', opacity: 0.8 }}>+GDP, -Education, -Approval</span>
            </button>

            {/* Relax Environmental Rules */}
            <button
              onClick={() =>
                handlePolicyDecision({
                  gdp: Math.min(115, metrics.gdp + 3),
                  unemploymentRate: Math.max(2, metrics.unemploymentRate - 0.4),
                  infrastructureScore: Math.max(60, metrics.infrastructureScore - 2),
                  approvalRating: metrics.approvalRating - 5
                })
              }
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                fontSize: '10px',
                padding: '10px',
                lineHeight: '1.4',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🏭 Relax Environmental Rules<br/>
              <span style={{ fontSize: '9px', opacity: 0.8 }}>+GDP, -Infrastructure, -Approval</span>
            </button>

            {/* Create Jobs Program */}
            <button
              onClick={() =>
                handlePolicyDecision({
                  gdp: Math.max(85, metrics.gdp - 2),
                  unemploymentRate: Math.max(2, metrics.unemploymentRate - 0.6),
                  approvalRating: Math.min(85, metrics.approvalRating + 4)
                })
              }
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                fontSize: '10px',
                padding: '10px',
                lineHeight: '1.4',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              👷 Launch Jobs Program<br/>
              <span style={{ fontSize: '9px', opacity: 0.8 }}>-GDP, --Unemployment, +Approval</span>
            </button>

            {/* Invest in Infrastructure */}
            <button
              onClick={() =>
                handlePolicyDecision({
                  gdp: Math.max(85, metrics.gdp - 1.5),
                  infrastructureScore: Math.min(95, metrics.infrastructureScore + 4),
                  unemploymentRate: Math.max(2, metrics.unemploymentRate - 0.3),
                  approvalRating: Math.min(85, metrics.approvalRating + 2)
                })
              }
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                fontSize: '10px',
                padding: '10px',
                lineHeight: '1.4',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🏗️ Invest in Infrastructure<br/>
              <span style={{ fontSize: '9px', opacity: 0.8 }}>-GDP, +Infrastructure, +Approval</span>
            </button>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}
