'use client';

import { TrendingUp, FileText, Users, Activity, Award } from 'lucide-react';
import MetricDisplayCard from './MetricCard';
import { useBlockchain } from '@/context/BlockchainContext';

export default function MetricsGrid() {
  const { blockchain, selectedOffice } = useBlockchain();
  const metrics = blockchain.performanceMetrics[selectedOffice]?.current;
  const baseline = blockchain.performanceMetrics[selectedOffice]?.baseline;

  if (!metrics) {
    return (
      <div>
        <h2 className="text-2xl mb-6 text-blue-500 font-semibold tracking-tight">
          ON-CHAIN PERFORMANCE METRICS
        </h2>
        <div className="text-slate-400">No metrics available</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl mb-6 text-blue-500 font-semibold tracking-tight">
        ON-CHAIN PERFORMANCE METRICS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {/* GDP Index */}
        <MetricDisplayCard
          title="GDP Index"
          value={metrics.gdp?.toFixed(1)}
          icon={TrendingUp}
          color={metrics.gdp >= 95 ? '#22c55e' : metrics.gdp < 90 ? '#ef4444' : '#f59e0b'}
          statusText={metrics.gdp < 90 ? 'CRITICAL: Decline Trigger Active' : 'Baseline: 100'}
          showTrend={true}
          isGoodTrend={metrics.gdp >= 95}
          baseline={
            baseline
              ? `Term Start: ${baseline.gdp.toFixed(1)} (Change: ${(metrics.gdp - baseline.gdp).toFixed(1)})`
              : null
          }
        />

        {/* Education Ranking */}
        <MetricDisplayCard
          title="Education Ranking"
          value={`#${metrics.educationRanking}`}
          icon={FileText}
          color={
            metrics.educationRanking <= 15
              ? '#22c55e'
              : metrics.educationRanking > 25
              ? '#f59e0b'
              : '#3b82f6'
          }
          statusText={metrics.educationRanking > 25 ? 'WARNING: Declining' : 'Target: Top 15'}
          baseline={
            baseline
              ? `Term Start: #${baseline.educationRanking} (Change: ${
                  metrics.educationRanking > baseline.educationRanking ? '+' : ''
                }${metrics.educationRanking - baseline.educationRanking})`
              : null
          }
        />

        {/* Approval Rating */}
        <MetricDisplayCard
          title="Approval Rating"
          value={`${metrics.approvalRating?.toFixed(1)}%`}
          icon={Users}
          color={
            metrics.approvalRating >= 50
              ? '#22c55e'
              : metrics.approvalRating < 35
              ? '#ef4444'
              : '#f59e0b'
          }
          statusText={
            metrics.approvalRating < 35 ? 'CRITICAL: Election Trigger Active' : 'Threshold: 35%'
          }
          baseline={
            baseline
              ? `Term Start: ${baseline.approvalRating.toFixed(1)}% (Change: ${(
                  metrics.approvalRating - baseline.approvalRating
                ).toFixed(1)})`
              : null
          }
        />

        {/* Unemployment Rate */}
        <MetricDisplayCard
          title="Unemployment Rate"
          value={`${metrics.unemploymentRate?.toFixed(1)}%`}
          icon={Activity}
          color={
            metrics.unemploymentRate <= 5
              ? '#22c55e'
              : metrics.unemploymentRate > 7.5
              ? '#f59e0b'
              : '#3b82f6'
          }
          statusText={metrics.unemploymentRate > 7.5 ? 'WARNING: Above Target' : 'Target: < 5%'}
          baseline={
            baseline
              ? `Term Start: ${baseline.unemploymentRate.toFixed(1)}% (Change: ${(
                  metrics.unemploymentRate - baseline.unemploymentRate
                ).toFixed(1)})`
              : null
          }
        />

        {/* Infrastructure Score */}
        <MetricDisplayCard
          title="Infrastructure Score"
          value={metrics.infrastructureScore?.toFixed(1)}
          icon={Award}
          color={
            metrics.infrastructureScore >= 80
              ? '#22c55e'
              : metrics.infrastructureScore < 65
              ? '#ef4444'
              : '#f59e0b'
          }
          statusText={
            metrics.infrastructureScore < 65
              ? 'CRITICAL: Poor Condition'
              : metrics.infrastructureScore >= 80
              ? 'Excellent'
              : 'Target: 80+'
          }
          baseline={
            baseline
              ? `Term Start: ${baseline.infrastructureScore.toFixed(1)} (Change: ${(
                  metrics.infrastructureScore - baseline.infrastructureScore
                ).toFixed(1)})`
              : null
          }
        />
      </div>
    </div>
  );
}
