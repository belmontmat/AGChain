export default function OnChainData() {
  return (
    <div>
      <h2 className="text-3xl mb-6 text-blue-500 font-bold tracking-tight">
        On-Chain Governance Data
      </h2>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-sm leading-relaxed text-gray-200">
          One of the key innovations in this system is storing all governance metrics directly on the
          blockchain, eliminating the need for trusted third-party &quot;oracles&quot; to feed data into the system.
          This creates a fully self-contained, verifiable governance framework.
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        The Oracle Problem
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6 border-l-4 border-l-red-500">
        <div className="text-[13px] text-slate-400 leading-relaxed space-y-4">
          <div>
            Traditional blockchain systems face a fundamental challenge: <strong className="text-red-500">
            blockchains cannot access external data on their own</strong>. If a smart contract needs to know
            the current GDP, unemployment rate, or approval rating, it must rely on external data providers
            called "oracles."
          </div>

          <div>
            <strong className="text-amber-500">The Problem:</strong> Oracles introduce centralization
            and trust assumptions. If the oracle is compromised, controlled by partisan interests, or simply
            provides inaccurate data, the entire governance system becomes vulnerable to manipulation.
          </div>

          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-md text-xs">
            <strong>Example Attack:</strong> A malicious oracle could report falsely low GDP numbers to
            trigger an early election and remove an incumbent they oppose, even if the actual economy is
            performing well.
          </div>
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Our Solution: Consensus-Based Data Updates
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-[13px] text-slate-400 leading-relaxed mb-4">
          This system eliminates oracles by having governance metrics validated through blockchain consensus
          before being recorded on-chain. Here&apos;s how it works:
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-blue-500/20 border border-blue-500/30 p-3.5 rounded-md mb-3">
              <strong className="text-blue-500 text-[13px]">Step 1: Multiple Data Sources</strong>
            </div>
            <div className="text-xs text-slate-400 ml-4 leading-relaxed">
              Various authorized entities (government statistical agencies, independent auditors, economic
              research institutions) submit performance metrics to the blockchain. Each submission is
              digitally signed by the submitting organization.
            </div>
          </div>

          <div>
            <div className="bg-blue-500/20 border border-blue-500/30 p-3.5 rounded-md mb-3">
              <strong className="text-blue-500 text-[13px]">Step 2: Consensus Verification</strong>
            </div>
            <div className="text-xs text-slate-400 ml-4 leading-relaxed">
              Network validators (distributed nodes running the blockchain software) verify that submitted
              metrics come from authorized sources and that multiple independent sources agree on the values.
              Outlier data is flagged and requires additional verification.
            </div>
          </div>

          <div>
            <div className="bg-blue-500/20 border border-blue-500/30 p-3.5 rounded-md mb-3">
              <strong className="text-blue-500 text-[13px]">Step 3: On-Chain Recording</strong>
            </div>
            <div className="text-xs text-slate-400 ml-4 leading-relaxed">
              Once consensus is reached, the metrics are recorded in a blockchain transaction. The block
              includes cryptographic proofs from all validators who approved the data, creating an immutable
              audit trail.
            </div>
          </div>

          <div>
            <div className="bg-blue-500/20 border border-blue-500/30 p-3.5 rounded-md mb-3">
              <strong className="text-blue-500 text-[13px]">Step 4: Automatic Trigger Evaluation</strong>
            </div>
            <div className="text-xs text-slate-400 ml-4 leading-relaxed">
              Smart contracts continuously monitor the on-chain metrics. When values cross predefined thresholds
              (e.g., approval &lt; 35%, GDP decline &gt; 10%), the contract autonomously initiates an election
              without requiring any external input or human intervention.
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Tracked Performance Metrics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-blue-500">
          <div className="text-sm font-semibold mb-2">
            GDP Index (Baseline: 100)
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Tracks economic growth relative to the start of the term. Declines below 90 trigger critical
            alerts and may initiate early elections if sustained.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-green-500">
          <div className="text-sm font-semibold mb-2">
            Education Ranking
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            National ranking for education quality. Rankings below 15 are considered excellent; falling
            below 25 generates warning flags.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-amber-500">
          <div className="text-sm font-semibold mb-2">
            Approval Rating
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Weighted average of citizen satisfaction surveys. Below 35% triggers automatic recall election
            proceedings as the official has lost public confidence.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-violet-500">
          <div className="text-sm font-semibold mb-2">
            Unemployment Rate
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Percentage of workforce without employment. Target is below 5%; exceeding 7.5% indicates economic
            management concerns.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-pink-500">
          <div className="text-sm font-semibold mb-2">
            Infrastructure Score
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Composite rating of roads, utilities, and public services. Scores above 70 indicate well-maintained
            infrastructure; below 60 suggests underinvestment.
          </div>
        </div>
      </div>
    </div>
  );
}
