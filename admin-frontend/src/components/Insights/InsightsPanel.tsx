/**
 * Insights panel component with modern design
 */
import { InsightResponse } from '../../types';

interface InsightsPanelProps {
  insights: InsightResponse | null;
  loading: boolean;
  error: string | null;
}

export default function InsightsPanel({ insights, loading, error }: InsightsPanelProps) {
  if (loading) {
    return (
      <div className="glass rounded-2xl border border-white/10 p-12">
        <div className="flex items-center justify-center gap-4 text-gray-300">
          <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium">Loading insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl border border-red-500/30 p-6 bg-red-500/10">
        <div className="text-red-300 font-medium">Error: {error}</div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const statCards = [
    {
      label: 'Total Products',
      value: insights.stats.count,
      icon: '📦',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderGradient: 'from-blue-500/40 to-cyan-500/40',
      textColor: 'text-cyan-300',
    },
    {
      label: 'Average Price',
      value: insights.stats.avgPrice !== null ? `$${insights.stats.avgPrice.toFixed(2)}` : 'N/A',
      icon: '💰',
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderGradient: 'from-green-500/40 to-emerald-500/40',
      textColor: 'text-emerald-300',
    },
    {
      label: 'Average Rating',
      value: insights.stats.avgRating !== null ? `${insights.stats.avgRating.toFixed(1)}/5` : 'N/A',
      icon: '⭐',
      gradient: 'from-yellow-500/20 to-amber-500/20',
      borderGradient: 'from-yellow-500/40 to-amber-500/40',
      textColor: 'text-yellow-300',
    },
    {
      label: 'In Stock',
      value: insights.stats.inStock,
      icon: '✅',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderGradient: 'from-purple-500/40 to-pink-500/40',
      textColor: 'text-purple-300',
    },
  ];

  return (
    <div className="glass rounded-2xl border border-white/10 p-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-pink-500/5" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-2xl border border-white/10">
            📊
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Product Insights
          </h3>
        </div>

        <div className="mb-8 p-6 glass rounded-xl border border-white/10">
          <p className="text-gray-200 leading-relaxed text-base">{insights.summary}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`glass rounded-xl border border-white/10 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl group relative overflow-hidden bg-gradient-to-br ${stat.gradient}`}
            >
              {/* Animated border */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stat.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
                <div className={`text-3xl font-black ${stat.textColor} drop-shadow-lg`}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
