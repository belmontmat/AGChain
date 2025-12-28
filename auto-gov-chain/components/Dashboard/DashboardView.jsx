'use client';

import OfficeHolderCard from './OfficeHolderCard';
import MetricsGrid from './MetricsGrid';
import GovernanceTriggers from './GovernanceTriggers';
import ActiveElectionNotice from './ActiveElectionNotice';
import SimulationControls from './SimulationControls';

export default function DashboardView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
      {/* Main Dashboard Content */}
      <div>
        <OfficeHolderCard />
        <MetricsGrid />
        <GovernanceTriggers />
        <ActiveElectionNotice />
      </div>

      {/* Simulation Control Panel */}
      <SimulationControls />
    </div>
  );
}
