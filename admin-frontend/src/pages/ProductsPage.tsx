/**
 * Products page with modern design
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useInsights } from '../hooks/useInsights';
import { triggerScrape } from '../api/jobs';
import ProductsTable from '../components/Products/ProductsTable';
import InsightsPanel from '../components/Insights/InsightsPanel';
import Alert from '../components/UI/Alert';
import EmptyState from '../components/UI/EmptyState';
import Toast from '../components/UI/Toast';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products, loading, error, refresh, deleteProduct } = useProducts();
  const { insights, loading: insightsLoading, error: insightsError, analyze } = useInsights();
  const [scraping, setScraping] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteProduct(id);
      setToast({ message: 'Product deleted successfully', variant: 'success' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setToast({ message: `Failed to delete product: ${errorMessage}`, variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleAnalyze = async () => {
    if (products.length === 0) {
      setToast({ message: 'No products to analyze', variant: 'error' });
      return;
    }
    try {
      setToast(null);
      await analyze(products);
      setToast({ message: 'Products analyzed successfully! Scroll down to see insights.', variant: 'success' });
      // Scroll to insights panel after analysis
      setTimeout(() => {
        const insightsElement = document.getElementById('insights-panel');
        if (insightsElement) {
          insightsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setToast({ message: `Failed to analyze products: ${errorMessage}`, variant: 'error' });
      console.error('Error analyzing products:', err);
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
                Products
              </h1>
              <p className="text-lg text-gray-300 mt-2">Manage your product catalog</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
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
            <button
              onClick={handleAnalyze}
              disabled={insightsLoading || products.length === 0}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 font-medium text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              {insightsLoading ? 'Analyzing...' : 'Analyze Products'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="glass rounded-2xl border border-white/10 p-12 text-center">
            <div className="text-gray-400">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No products yet"
            description="Run a scraper job to fetch products from the source site."
            action={{
              label: 'Run Scraper',
              onClick: handleScrape,
              loading: scraping,
            }}
          />
        ) : (
          <div className="glass rounded-2xl border border-white/10 p-6 overflow-hidden">
            <ProductsTable
              products={products}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          </div>
        )}

        {/* Insights Panel - Always visible when loading or has data/error */}
        {(insights || insightsLoading || insightsError) && (
          <div id="insights-panel" className="mt-8 scroll-mt-8">
            <InsightsPanel
              insights={insights}
              loading={insightsLoading}
              error={insightsError}
            />
          </div>
        )}
      </div>
    </>
  );
}
