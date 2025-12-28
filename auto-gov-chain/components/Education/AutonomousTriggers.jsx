export default function AutonomousTriggers() {
  return (
    <div>
      <h2 className="text-3xl mb-6 text-blue-500 font-bold tracking-tight">
        Autonomous Governance Triggers
      </h2>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-sm leading-relaxed text-gray-200">
          Smart contracts enable truly autonomous governance by automatically initiating elections when
          specific conditions are met—without requiring any human decision-making or intervention. This
          eliminates partisan delays and ensures consistent accountability.
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        How Smart Contracts Work
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-[13px] text-slate-400 leading-relaxed mb-4">
          A <strong className="text-blue-500">smart contract</strong> is self-executing code that runs
          on the blockchain. Unlike traditional contracts that require courts and lawyers to enforce, smart
          contracts automatically execute when their programmed conditions are met.
        </div>

        <div className="bg-black/40 p-4 rounded-lg font-mono text-[11px] border border-blue-500/30 mb-4">
          <div className="text-slate-500 mb-2">// Simplified governance smart contract</div>
          <div className="mb-1">
            <span className="text-violet-500">function</span> <span className="text-blue-500">checkGovernanceTriggers</span>() {'{'}
          </div>
          <div className="ml-5 mb-1">
            <span className="text-violet-500">if</span> (approvalRating {'<'} <span className="text-amber-500">35</span>) {'{'}
          </div>
          <div className="ml-10 mb-1">
            initiateElection(<span className="text-green-500">&quot;LOW_APPROVAL&quot;</span>);
          </div>
          <div className="ml-5 mb-1">
            {'}'}
          </div>
          <div className="ml-5 mb-1">
            <span className="text-violet-500">if</span> (gdpIndex {'<'} <span className="text-amber-500">90</span>) {'{'}
          </div>
          <div className="ml-10 mb-1">
            initiateElection(<span className="text-green-500">&quot;GDP_DECLINE&quot;</span>);
          </div>
          <div className="ml-5 mb-1">
            {'}'}
          </div>
          <div className="ml-5 mb-1">
            <span className="text-violet-500">if</span> (currentTime {'>'} termEndDate) {'{'}
          </div>
          <div className="ml-10 mb-1">
            initiateElection(<span className="text-green-500">&quot;TERM_COMPLETE&quot;</span>);
          </div>
          <div className="ml-5 mb-1">
            {'}'}
          </div>
          <div>{'}'}</div>
        </div>

        <div className="text-[13px] text-slate-400 leading-relaxed">
          This code runs automatically every time new performance data is recorded on the blockchain.
          No person needs to manually check metrics or decide whether conditions warrant an election—the
          smart contract enforces the rules impartially and transparently.
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Trigger Categories
      </h3>

      <div className="mb-6">
        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-4 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start mb-3">
            <div className="text-base font-bold">
              Mandatory Triggers
            </div>
            <div className="bg-red-500/20 border border-red-500/30 px-3 py-1 rounded text-[11px] font-semibold text-red-500">
              MANDATORY
            </div>
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed mb-3">
            These triggers <strong>immediately</strong> initiate an election with no option for delay or override.
          </div>
          <div className="bg-black/30 p-3 rounded-md text-xs">
            <strong className="text-red-500">Term Completion:</strong> When the official&apos;s term expires
            (typically 4 years), a new election automatically begins. No extensions or delays are possible.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-4 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start mb-3">
            <div className="text-base font-bold">
              Critical Performance Triggers
            </div>
            <div className="bg-red-500/20 border border-red-500/30 px-3 py-1 rounded text-[11px] font-semibold text-red-500">
              CRITICAL
            </div>
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed mb-3">
            Severe underperformance automatically triggers recall elections, allowing citizens to replace
            failing leadership before the term ends.
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-black/30 p-3 rounded-md text-xs">
              <strong className="text-amber-500">Approval Rating &lt; 35%:</strong> When citizen support
              falls below 35%, it indicates the official has lost the public&apos;s confidence and should face
              immediate accountability.
            </div>
            <div className="bg-black/30 p-3 rounded-md text-xs">
              <strong className="text-amber-500">GDP Decline &gt; 10%:</strong> A 10% or greater decline
              in GDP represents severe economic mismanagement requiring immediate leadership change.
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-3">
            <div className="text-base font-bold">
              Warning Triggers
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded text-[11px] font-semibold text-amber-500">
              WARNING
            </div>
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed mb-3">
            These metrics don&apos;t immediately trigger elections but are recorded on-chain as warning signals.
            Multiple sustained warnings may escalate to critical status.
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-black/30 p-3 rounded-md text-xs">
              <strong className="text-blue-500">Education Ranking &gt; 25:</strong> Falling education
              standards indicate policy problems but may not warrant immediate removal.
            </div>
            <div className="bg-black/30 p-3 rounded-md text-xs">
              <strong className="text-blue-500">Unemployment &gt; 7.5%:</strong> High unemployment is
              concerning but may result from external factors beyond the official&apos;s control.
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Benefits of Autonomous Triggers
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
          <div className="text-sm font-semibold mb-3 text-green-500">
            Eliminates Partisan Delays
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            No ruling party can delay accountability votes or avoid elections when performance falters.
            The blockchain enforces rules impartially regardless of political considerations.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
          <div className="text-sm font-semibold mb-3 text-green-500">
            Ensures Consistent Standards
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Every official is held to the same performance thresholds. Popular incumbents face the same
            triggers as unpopular ones—the code doesn&apos;t play favorites.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
          <div className="text-sm font-semibold mb-3 text-green-500">
            Creates Transparent Accountability
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Citizens can see exactly which metrics triggered elections and verify that the smart contract
            executed correctly. No backroom deals or hidden decision-making.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
          <div className="text-sm font-semibold mb-3 text-green-500">
            Prevents Authoritarianism
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Officials cannot cancel elections or extend their terms indefinitely. The blockchain&apos;s
            immutable nature means even a compromised government cannot override governance rules.
          </div>
        </div>
      </div>
    </div>
  );
}
