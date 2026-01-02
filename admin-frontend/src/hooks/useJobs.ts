/**
 * Hook for managing automation jobs
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { AutomationJob } from '../types';
import * as jobsApi from '../api/jobs';

export function useJobs(autoRefresh: boolean = true, interval: number = 15000) {
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await jobsApi.fetchJobs();
      setJobs(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch jobs';
      setError(message);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = window.setInterval(() => {
        refresh();
      }, interval);

      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, interval, refresh]);

  return {
    jobs,
    loading,
    error,
    refresh,
  };
}

