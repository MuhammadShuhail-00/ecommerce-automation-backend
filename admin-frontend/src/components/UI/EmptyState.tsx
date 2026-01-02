/**
 * Empty state component with modern design
 */
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass rounded-2xl border border-white/10 p-16 text-center relative overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="text-8xl mb-6 transform hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 mb-8 max-w-md mx-auto text-lg">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            disabled={action.loading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 text-base"
          >
            {action.loading ? 'Loading...' : action.label}
          </button>
        )}
      </div>
    </div>
  );
}
