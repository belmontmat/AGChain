'use client';

import MetricCard from '@/components/Common/MetricCard';
import { useBlockchain } from '@/context/BlockchainContext';

export default function GovernanceTriggers() {
  const { blockchain, selectedOffice } = useBlockchain();
  const triggers = blockchain.evaluateGovernanceTriggers(selectedOffice);

  if (!triggers || triggers.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl mb-6 text-blue-500 font-semibold tracking-tight">
        ACTIVE GOVERNANCE TRIGGERS
      </h2>

      <div className="flex flex-col gap-3">
        {triggers.map((trigger, i) => {
          const isCritical = trigger.severity === 'critical' || trigger.severity === 'mandatory';
          const borderColor = isCritical ? '#ef4444' : '#f59e0b';
          const bgColor = isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)';
          const textColor = isCritical ? '#ef4444' : '#f59e0b';

          return (
            <MetricCard
              key={i}
              style={{ borderLeft: `3px solid ${borderColor}` }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold mb-1">
                    {trigger.type.replace(/_/g, ' ')}
                  </div>
                  {trigger.baseline !== undefined ? (
                    <div className="text-xs text-slate-400">
                      Baseline: {trigger.baseline.toFixed(1)} → Current: {trigger.value.toFixed(1)}{' '}
                      ({trigger.change > 0 ? '+' : ''}{trigger.change.toFixed(1)})
                    </div>
                  ) : trigger.threshold !== undefined ? (
                    <div className="text-xs text-slate-400">
                      Current: {trigger.value.toFixed(1)} | Threshold: {trigger.threshold}
                    </div>
                  ) : null}
                </div>
                <div
                  className="px-3 py-1.5 rounded text-xs font-semibold border uppercase tracking-wider"
                  style={{
                    background: bgColor,
                    color: textColor,
                    borderColor: borderColor.replace(')', ', 0.3)')
                  }}
                >
                  {trigger.severity}
                </div>
              </div>
            </MetricCard>
          );
        })}
      </div>
    </div>
  );
}
