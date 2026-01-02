/**
 * Automation Jobs page with modern design
 */
import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { triggerScrape } from '../api/jobs';
import JobsTable from '../components/Jobs/JobsTable';
import Alert from '../components/UI/Alert';
import EmptyState from '../components/UI/EmptyState';
import Toggle from '../components/UI/Toggle';
import Toast from '../components/UI/Toast';

export default function JobsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { jobs, loading, error, refresh } = useJobs(autoRefresh, 15000);
  const [scraping, setScraping] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const handleScrape = async () => {
    try {
      setScraping(true);
      setToast(null);
      const result = await triggerScrape();
      setToast({ message: `Scrape job queued! Job ID: ${result.job_id}`, variant: 'success' });
      setTimeout(() => {
        refresh();
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error triggering scrape:', err);
      setToast({ message: `Failed to queue scraping job: ${errorMessage}`, variant: 'error' });
    } finally {
      setScraping(false);
    }
  };

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
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full" />
            <div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 tracking-tight">
                Automation Jobs
              </h1>
              <p className="text-lg text-gray-300 mt-2">Monitor and manage automation jobs</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="glass px-4 py-2.5 rounded-xl border border-white/10">
              <Toggle
                checked={autoRefresh}
                onChange={setAutoRefresh}
                label="Auto-refresh"
              />
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="glass px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-300 font-medium text-sm hover:scale-105"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={handleScrape}
              disabled={scraping}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 font-medium text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              {scraping ? 'Queuing...' : 'Run Scraper'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {loading && jobs.length === 0 ? (
          <div className="glass rounded-2xl border border-white/10 p-12 text-center">
            <div className="text-gray-400">Loading jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="⚙️"
            title="No automation jobs yet"
            description="Run your first scraper job to start fetching products from the source site."
            action={{
              label: 'Run Scraper',
              onClick: handleScrape,
              loading: scraping,
            }}
          />
        ) : (
          <div className="glass rounded-2xl border border-white/10 p-6 overflow-hidden">
            <JobsTable jobs={jobs} />
          </div>
        )}
      </div>
    </>
  );
}
