'use client';

export default function MetricCard({ children, className = '', style = {} }) {
  return (
    <div
      className={`bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
