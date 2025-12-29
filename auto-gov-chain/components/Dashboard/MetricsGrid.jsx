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
          colorClass={metrics.gdp >= 95 ? 'text-green-500' : metrics.gdp < 90 ? 'text-red-500' : 'text-amber-500'}
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
          colorClass={
            metrics.educationRanking <= 15
              ? 'text-green-500'
              : metrics.educationRanking > 25
              ? 'text-amber-500'
              : 'text-blue-500'
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
          colorClass={
            metrics.approvalRating >= 50
              ? 'text-green-500'
              : metrics.approvalRating < 35
              ? 'text-red-500'
              : 'text-amber-500'
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
          colorClass={
            metrics.unemploymentRate <= 5
              ? 'text-green-500'
              : metrics.unemploymentRate > 7.5
              ? 'text-amber-500'
              : 'text-blue-500'
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
          colorClass={
            metrics.infrastructureScore >= 80
              ? 'text-green-500'
              : metrics.infrastructureScore < 65
              ? 'text-red-500'
              : 'text-amber-500'
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
