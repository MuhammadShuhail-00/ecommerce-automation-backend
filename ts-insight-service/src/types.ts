/**
 * Type definitions for product insights service
 */

export interface ProductInput {
  name: string;
  price: number;
  rating: number | null;
  stock: number;
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

