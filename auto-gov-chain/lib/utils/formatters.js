/**
 * Formatting utilities for metrics and blockchain data
 */

export function formatMetric(metricName, value) {
  const formatters = {
    gdp: (v) => `${v.toFixed(1)}`,
    educationRanking: (v) => `#${Math.round(v)}`,
    approvalRating: (v) => `${Math.round(v)}%`,
    unemploymentRate: (v) => `${v.toFixed(1)}%`,
    infrastructureScore: (v) => `${Math.round(v)}/100`
  };

  return formatters[metricName]?.(value) || value.toString();
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatHash(hash) {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function getMetricTrend(current, baseline, metricName) {
  if (!baseline) return 'neutral';

  const betterWhenHigher = ['gdp', 'approvalRating', 'infrastructureScore'];
  const betterWhenLower = ['educationRanking', 'unemploymentRate'];

  const change = current - baseline;

  if (betterWhenHigher.includes(metricName)) {
    return change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  }

  if (betterWhenLower.includes(metricName)) {
    return change < 0 ? 'up' : change > 0 ? 'down' : 'neutral';
  }

  return 'neutral';
}
