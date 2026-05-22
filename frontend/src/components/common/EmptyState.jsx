export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Start by creating your first item.',
  action,
}) {
  return (
    <div className="text-center py-12 px-4">
      <svg
        viewBox="0 0 200 160"
        className="mx-auto w-48 h-32 mb-4"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="40" y="40" width="120" height="90" rx="10" fill="#e0e7ff" />
        <rect x="55" y="60" width="90" height="8" rx="4" fill="#a5b4fc" />
        <rect x="55" y="78" width="70" height="8" rx="4" fill="#c7d2fe" />
        <rect x="55" y="96" width="50" height="8" rx="4" fill="#c7d2fe" />
        <circle cx="160" cy="40" r="14" fill="#6366f1" />
        <path
          d="M154 40 l5 5 l8 -8"
          stroke="#fff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {description}
      </p>
      {action}
    </div>
  );
}
