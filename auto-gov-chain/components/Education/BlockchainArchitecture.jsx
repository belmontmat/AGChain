export default function BlockchainArchitecture() {
  return (
    <div>
      <h2 className="text-3xl mb-6 text-blue-500 font-bold tracking-tight">
        Blockchain Architecture
      </h2>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-sm leading-relaxed text-gray-200">
          A blockchain is a distributed, immutable ledger that records transactions in chronologically
          linked blocks. Each block contains a cryptographic hash of the previous block, creating a
          tamper-evident chain where any attempt to alter past data would be immediately detectable.
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Block Structure
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-[13px] text-slate-400 leading-relaxed mb-4">
          Each block in this governance blockchain contains:
        </div>

        <div className="bg-black/40 p-5 rounded-lg border border-blue-500/30 font-mono text-xs">
          <div className="mb-3">
            <span className="text-violet-500">Block</span> {'{'}
            <br />
            <span className="ml-5 text-slate-500">// Unique identifier</span>
            <br />
            <span className="ml-5 text-blue-500">index:</span> <span className="text-amber-500">42</span>,
            <br />
            <br />
            <span className="ml-5 text-slate-500">// When block was created</span>
            <br />
            <span className="ml-5 text-blue-500">timestamp:</span> <span className="text-green-500">"2025-01-15T10:30:00Z"</span>,
            <br />
            <br />
            <span className="ml-5 text-slate-500">// Governance transactions</span>
            <br />
            <span className="ml-5 text-blue-500">transactions:</span> [
            <br />
            <span className="ml-10">{'{'}</span>
            <br />
            <span className="ml-[60px] text-blue-500">type:</span> <span className="text-green-500">"VOTE_CAST"</span>,
            <br />
            <span className="ml-[60px] text-blue-500">voteHash:</span> <span className="text-green-500">"0x7a9f..."</span>,
            <br />
            <span className="ml-[60px] text-blue-500">signature:</span> <span className="text-green-500">"0x3c2b..."</span>
            <br />
            <span className="ml-10">{'}'}</span>
            <br />
            <span className="ml-5">],</span>
            <br />
            <br />
            <span className="ml-5 text-slate-500">// Links to previous block</span>
            <br />
            <span className="ml-5 text-blue-500">previousHash:</span> <span className="text-green-500">"0x9d4e..."</span>,
            <br />
            <br />
            <span className="ml-5 text-slate-500">// This block's unique fingerprint</span>
            <br />
            <span className="ml-5 text-blue-500">hash:</span> <span className="text-green-500">"0x2f8c..."</span>
            <br />
            {'}'}
          </div>
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Cryptographic Hashing
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6 mb-6">
        <div className="text-[13px] text-slate-400 leading-relaxed mb-4">
          A <strong className="text-blue-500">hash function</strong> takes any input data and produces
          a fixed-size "fingerprint" (typically 256 bits). Even a tiny change to the input creates a
          completely different hash. This property makes tampering detectable.
        </div>

        <div className="bg-violet-500/10 border border-violet-500/30 p-4 rounded-md mb-4">
          <div className="text-xs mb-2 text-violet-300">
            Example: SHA-256 Hash
          </div>
          <div className="text-[11px] font-mono space-y-2">
            <div>
              Input: <span className="text-blue-500">"Vote for Candidate A"</span>
              <br />
              Hash: <span className="text-green-500">0x7a9f3e2d1c4b8a6f5e3d2c1b9a8f7e6d...</span>
            </div>
            <div>
              Input: <span className="text-blue-500">"Vote for Candidate B"</span> (only 1 letter changed!)
              <br />
              Hash: <span className="text-red-500">0x9c3b7f1e8d2a4c6b9e1f3d5a7c9b4e2f...</span> (completely different!)
            </div>
          </div>
        </div>

        <div className="text-[13px] text-slate-400 leading-relaxed">
          Because each block contains the hash of the previous block, changing any historical block
          would require recalculating all subsequent block hashes—an computationally infeasible task
          in a distributed system where other nodes maintain copies of the correct chain.
        </div>
      </div>

      <h3 className="text-xl mb-5 text-violet-500">
        Digital Signatures
      </h3>

      <div className="bg-slate-800/30 backdrop-blur border border-violet-500/20 rounded-lg p-6">
        <div className="text-[13px] text-slate-400 leading-relaxed mb-4">
          Digital signatures use <strong className="text-blue-500">public-key cryptography</strong> to
          verify that a vote came from an authorized voter without revealing their identity.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-md">
            <div className="text-xs font-semibold mb-2 text-blue-500">
              1. Private Key (Secret)
            </div>
            <div className="text-[11px] text-slate-400">
              Only you know this. Used to "sign" your ballot by creating a unique signature that
              proves the vote is yours.
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-md">
            <div className="text-xs font-semibold mb-2 text-green-500">
              2. Public Key (Shared)
            </div>
            <div className="text-[11px] text-slate-400">
              Everyone can see this. Used to verify that a signature was created by the corresponding
              private key, without revealing what that private key is.
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-md">
            <div className="text-xs font-semibold mb-2 text-amber-500">
              3. Signature (Proof)
            </div>
            <div className="text-[11px] text-slate-400">
              Created by combining your private key with your ballot data. Proves the vote is authentic
              without revealing your identity.
            </div>
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-md text-xs leading-relaxed">
          <strong className="text-violet-500">Privacy Protection:</strong> While the blockchain is public,
          your identity is not linked to your public key in the system. Observers can verify that valid
          voters cast ballots, but cannot determine which person cast which specific vote.
        </div>
      </div>
    </div>
  );
}
