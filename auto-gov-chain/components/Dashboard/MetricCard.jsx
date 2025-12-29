'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import MetricCard from '@/components/Common/MetricCard';

export default function MetricDisplayCard({
  title,
  value,
  icon: Icon,
  colorClass,
  statusText,
  baseline,
  showTrend = false,
  isGoodTrend = false
}) {
  return (
    <MetricCard>
      <div className="flex justify-between items-start mb-3">
        <div className="text-xs text-slate-400 uppercase tracking-wider">
          {title}
        </div>
        <Icon size={18} className={colorClass} />
      </div>

      <div className="text-3xl font-bold mb-2">
        {value}
      </div>

      {statusText && (
        <div className={`text-xs flex items-center gap-1 mb-1.5 ${colorClass}`}>
          {showTrend && (
            isGoodTrend ? <TrendingUp size={14} /> : <TrendingDown size={14} />
          )}
          {statusText}
        </div>
      )}

      {baseline && (
        <div className="text-[10px] text-slate-500 mt-1">
          {baseline}
        </div>
      )}
    </MetricCard>
  );
}
