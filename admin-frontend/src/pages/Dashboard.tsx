/**
 * Dashboard page with modern design
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useJobs } from '../hooks/useJobs';
import { triggerScrape } from '../api/jobs';
import { formatDate } from '../utils/date';
import Toast from '../components/UI/Toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { jobs, loading: jobsLoading } = useJobs(true, 15000);
  const [scraping, setScraping] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const handleScrape = async () => {
    try {
      setScraping(true);
      setToast(null);
      const result = await triggerScrape();
      setToast({ message: `Scrape job queued! Job ID: ${result.job_id}`, variant: 'success' });
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error triggering scrape:', err);
      setToast({ message: `Failed to queue scraping job: ${errorMessage}`, variant: 'error' });
    } finally {
      setScraping(false);
    }
  };

  const lastSynced = products.length > 0
    ? products.reduce((latest, p) => {
        if (!p.last_synced_at) return latest;
        const syncDate = new Date(p.last_synced_at);
        return !latest || syncDate > latest ? syncDate : latest;
      }, null as Date | null)
    : null;

  const completedJobs = jobs.filter((j) => j.status === 'completed').length;
  const failedJobs = jobs.filter((j) => j.status === 'failed').length;

  const getTimeSinceSync = () => {
    if (!lastSynced) return null;
    const now = new Date();
    const diffMs = now.getTime() - lastSynced.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const statCards = [
    {
      label: 'Total Products',
      value: productsLoading ? '...' : products.length,
      subtext: 'in catalog',
      icon: '📦',
      gradient: 'from-blue-500/20 via-cyan-500/20 to-blue-600/20',
      borderGradient: 'from-blue-500/40 to-cyan-500/40',
      textColor: 'text-cyan-300',
      iconBg: 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30',
      glow: 'shadow-blue-500/20',
    },
    {
      label: 'Completed Jobs',
      value: jobsLoading ? '...' : completedJobs,
      subtext: 'successful runs',
      icon: '✅',
      gradient: 'from-green-500/20 via-emerald-500/20 to-green-600/20',
      borderGradient: 'from-green-500/40 to-emerald-500/40',
      textColor: 'text-emerald-300',
      iconBg: 'bg-gradient-to-br from-green-500/30 to-emerald-500/30',
      glow: 'shadow-green-500/20',
    },
    {
      label: 'Failed Jobs',
      value: jobsLoading ? '...' : failedJobs,
      subtext: 'need attention',
      icon: '⚠️',
      gradient: 'from-red-500/20 via-pink-500/20 to-red-600/20',
      borderGradient: 'from-red-500/40 to-pink-500/40',
      textColor: 'text-pink-300',
      iconBg: 'bg-gradient-to-br from-red-500/30 to-pink-500/30',
      glow: 'shadow-red-500/20',
    },
    {
      label: 'Last Sync',
      value: lastSynced ? getTimeSinceSync() : 'Never',
      subtext: lastSynced ? formatDate(lastSynced.toISOString()) : 'no sync yet',
      icon: '🔄',
      gradient: 'from-purple-500/20 via-pink-500/20 to-purple-600/20',
      borderGradient: 'from-purple-500/40 to-pink-500/40',
      textColor: 'text-purple-300',
      iconBg: 'bg-gradient-to-br from-purple-500/30 to-pink-500/30',
      glow: 'shadow-purple-500/20',
    },
  ];

  const actionCards = [
    {
      icon: '📦',
      title: 'View Products',
      description: 'Manage and view all products',
      link: '/products',
      gradient: 'from-blue-600 via-cyan-600 to-blue-700',
      hoverGradient: 'from-blue-500 via-cyan-500 to-blue-600',
    },
    {
      icon: '⚙️',
      title: 'View Jobs',
      description: 'Monitor automation jobs',
      link: '/jobs',
      gradient: 'from-gray-600 via-gray-700 to-gray-800',
      hoverGradient: 'from-gray-500 via-gray-600 to-gray-700',
    },
    {
      icon: '🚀',
      title: scraping ? 'Queuing...' : 'Run Scraper',
      description: 'Trigger a new scraping job',
      onClick: handleScrape,
      disabled: scraping,
      gradient: 'from-purple-600 via-pink-600 to-purple-700',
      hoverGradient: 'from-purple-500 via-pink-500 to-purple-600',
    },
  ];

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full" />
                <div>
                  <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-xl text-gray-300 mt-2 max-w-2xl">
                    Monitor your ecommerce automation system at a glance
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastSynced && (
                <div className="glass px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Last sync</div>
                    <div className="text-sm font-semibold text-white">{getTimeSinceSync()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`glass rounded-2xl border border-white/10 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${card.glow} group relative overflow-hidden`}
              >
                {/* Animated border gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`${card.iconBg} rounded-2xl p-3.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10`}>
                      <span className="text-3xl">{card.icon}</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    {card.label}
                  </div>
                  <div className={`text-5xl font-black ${card.textColor} mb-2 drop-shadow-lg`}>
                    {card.value}
                  </div>
                  <div className="text-sm text-gray-400">{card.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full" />
            <h2 className="text-3xl font-bold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actionCards.map((card, index) => {
              const content = (
                <div
                  className={`relative group bg-gradient-to-br ${card.gradient} rounded-2xl p-8 text-white transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer overflow-hidden ${
                    card.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {card.icon}
                    </div>
                    <div className="text-xl font-bold mb-2">{card.title}</div>
                    <div className="text-sm text-white/80">{card.description}</div>
                  </div>
                </div>
              );

              if (card.onClick) {
                return (
                  <button
                    key={index}
                    onClick={card.onClick}
                    disabled={card.disabled}
                    className="text-left w-full"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link key={index} to={card.link!} className="block">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
