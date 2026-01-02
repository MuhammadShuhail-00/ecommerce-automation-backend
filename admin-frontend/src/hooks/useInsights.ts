/**
 * Hook for managing insights
 */
import { useState, useCallback } from 'react';
import { Product, InsightResponse } from '../types';
import * as insightsApi from '../api/insights';

export function useInsights() {
  const [insights, setInsights] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (products: Product[]) => {
    if (products.length === 0) {
      setError('No products to analyze');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await insightsApi.fetchInsights(products);
      setInsights(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch insights';
      setError(message);
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    insights,
    loading,
    error,
    analyze,
  };
}

