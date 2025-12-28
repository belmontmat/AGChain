import { Lock } from 'lucide-react';

export default function Header() {
  return (
    <div className="mb-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Lock size={32} className="text-blue-500" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
          AUTONOMOUS GOVERNANCE CHAIN
        </h1>
      </div>
      <p className="text-slate-400 text-sm tracking-widest uppercase">
        Blockchain-Verified • Ranked Choice Voting • Performance-Triggered Elections
      </p>
    </div>
  );
}
