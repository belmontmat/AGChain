'use client';

export default function Navigation({ selectedView, onViewChange }) {
  const views = [
    { id: 'education', label: 'Education' },
    { id: 'live-demo', label: 'Live Demo' },
    { id: 'voting-explorer', label: 'Voting & Blockchain' },
    { id: 'faq', label: 'FAQ' }
  ];

  return (
    <nav className="flex gap-3 mb-8 justify-center flex-wrap" aria-label="Main navigation">
      {views.map(view => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          aria-current={selectedView === view.id ? 'page' : undefined}
          className={`
            px-5 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider
            transition-all duration-300 border
            ${selectedView === view.id
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500'
              : 'bg-slate-800/50 text-slate-400 border-blue-500/20 hover:border-blue-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
            }
          `}
        >
          {view.label}
        </button>
      ))}
    </nav>
  );
}
