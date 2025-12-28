'use client';

import { useState } from 'react';
import SystemOverview from './SystemOverview';
import RankedChoiceVoting from './RankedChoiceVoting';
import BlockchainArchitecture from './BlockchainArchitecture';
import OnChainData from './OnChainData';
import AutonomousTriggers from './AutonomousTriggers';

const SECTIONS = [
  { id: 'overview', label: 'System Overview', component: SystemOverview },
  { id: 'rcv', label: 'Ranked Choice Voting', component: RankedChoiceVoting },
  { id: 'blockchain', label: 'Blockchain Architecture', component: BlockchainArchitecture },
  { id: 'data', label: 'On-Chain Data', component: OnChainData },
  { id: 'triggers', label: 'Autonomous Triggers', component: AutonomousTriggers }
];

export default function EducationView() {
  const [educationSection, setEducationSection] = useState('overview');

  const ActiveComponent = SECTIONS.find(s => s.id === educationSection)?.component;

  return (
    <div>
      {/* Section Navigation */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        {SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => setEducationSection(section.id)}
            className={`
              px-4 py-2 rounded-md text-[11px] font-medium
              transition-all duration-300
              ${educationSection === section.id
                ? 'bg-violet-500/30 border border-violet-500 text-violet-300'
                : 'bg-slate-800/30 border border-violet-500/20 text-slate-500 hover:text-violet-300 hover:border-violet-500/40'
              }
            `}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Active Section Content */}
      {ActiveComponent && <ActiveComponent />}
    </div>
  );
}
