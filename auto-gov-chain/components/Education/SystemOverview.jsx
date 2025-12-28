import { Lock, CheckCircle, Activity } from 'lucide-react';

export default function SystemOverview() {
  return (
    <div>
      <h2 className="text-3xl mb-6 text-blue-500 font-bold tracking-tight">
        Blockchain-Based Governance System
      </h2>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-sm leading-relaxed text-gray-200">
          This system demonstrates how blockchain technology can create a transparent, tamper-proof,
          and autonomous democratic governance framework. Unlike traditional voting systems that rely
          on centralized authorities and paper trails, this approach uses cryptographic proofs and
          distributed consensus to ensure election integrity.
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Core Principles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-3">
            <Lock size={24} className="text-blue-500" />
            <div className="text-base font-semibold">Immutability</div>
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed">
            Once a vote is recorded on the blockchain, it cannot be altered or deleted. Each block
            contains a cryptographic hash of the previous block, creating an unbreakable chain of
            records that would require rewriting the entire history to tamper with.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle size={24} className="text-green-500" />
            <div className="text-base font-semibold">Verifiability</div>
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed">
            Every voter receives a cryptographic receipt (vote hash) that proves their vote was
            recorded, while digital signatures ensure that only authorized voters can cast ballots.
            Anyone can audit the blockchain to verify the election results.
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3 mb-3">
            <Activity size={24} className="text-amber-500" />
            <div className="text-base font-semibold">Autonomy</div>
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed">
            Smart contracts automatically trigger elections when performance metrics fall below
            thresholds or terms expire. No human intervention or partisan manipulation can delay
            or prevent accountability mechanisms from activating.
          </div>
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        System Architecture
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
        <div className="text-[13px] text-slate-400 leading-relaxed space-y-4">
          <div>
            <strong className="text-blue-500 text-sm">1. Voter Registration & Identity</strong>
            <br />
            Each voter is issued a unique cryptographic key pair (public and private keys). The public
            key serves as their identity on the blockchain, while the private key signs their ballot to
            prove authenticity without revealing their identity.
          </div>

          <div>
            <strong className="text-blue-500 text-sm">2. Ballot Casting</strong>
            <br />
            Voters rank candidates in order of preference. The ballot is digitally signed with the voter's
            private key, creating a unique signature that proves the vote came from an authorized voter
            without revealing which specific person cast it.
          </div>

          <div>
            <strong className="text-blue-500 text-sm">3. Blockchain Recording</strong>
            <br />
            Each vote is hashed and recorded in a transaction block along with the signature and timestamp.
            The block is cryptographically linked to previous blocks, making it computationally impossible
            to alter past votes without detection.
          </div>

          <div>
            <strong className="text-blue-500 text-sm">4. Transparent Tallying</strong>
            <br />
            The ranked choice algorithm runs directly on the blockchain data, eliminating the need for
            trusted intermediaries. Anyone can verify the count by replaying the algorithm against the
            public blockchain ledger.
          </div>
        </div>
      </div>
    </div>
  );
}
