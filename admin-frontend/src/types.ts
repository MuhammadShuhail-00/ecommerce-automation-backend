/**
 * Type definitions for the admin frontend
 */

export interface Product {
  id: number;
  name: string;
  price: string | number;
  stock: number;
  url: string;
  rating: number | null;
  image_url: string | null;
  source_url: string | null;
  last_synced_at: string | null;
  last_updated: string | null;
}

export interface AutomationJob {
  id: number;
  job_type: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | string;
  created_at: string;
  finished_at: string | null;
  error_message: string | null;
}

export interface InsightStats {
  count: number;
  avgPrice: number | null;
  avgRating: number | null;
  inStock: number;
}

export interface InsightResponse {
  summary: string;
  stats: InsightStats;
}

