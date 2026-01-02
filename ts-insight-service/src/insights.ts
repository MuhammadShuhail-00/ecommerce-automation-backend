/**
 * Core insight calculation logic
 */
import { ProductInput, InsightStats, InsightResponse } from './types';

/**
 * Calculate insights from an array of products
 * 
 * @param products - Array of product input objects
 * @returns InsightResponse with summary and statistics
 */
export function calculateInsights(products: ProductInput[]): InsightResponse {
  // Handle empty list gracefully
  if (products.length === 0) {
    return {
      summary: 'No products provided for analysis.',
      stats: {
        count: 0,
        avgPrice: null,
        avgRating: null,
        inStock: 0,
      },
    };
  }

  // Compute statistics
  const count = products.length;

  // Calculate average price
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const avgPrice = count > 0 ? totalPrice / count : null;

  // Calculate average rating (only from non-null ratings)
  const productsWithRating = products.filter((p) => p.rating !== null);
  const totalRating = productsWithRating.reduce(
    (sum, product) => sum + (product.rating || 0),
    0
  );
  const avgRating =
    productsWithRating.length > 0 ? totalRating / productsWithRating.length : null;

  // Count products in stock
  const inStock = products.filter((p) => p.stock > 0).length;

  // Build summary string
  const stats: InsightStats = {
    count,
    avgPrice: avgPrice !== null ? Math.round(avgPrice * 100) / 100 : null,
    avgRating: avgRating !== null ? Math.round(avgRating * 100) / 100 : null,
    inStock,
  };

  const summary = buildSummary(stats);

  return {
    summary,
    stats,
  };
}

/**
 * Build a human-readable summary from statistics
 */
function buildSummary(stats: InsightStats): string {
  const { count, avgPrice, avgRating, inStock } = stats;
  const outOfStock = count - inStock;

  let summary = `Analyzed ${count} product${count !== 1 ? 's' : ''}.`;

  if (avgPrice !== null) {
    summary += ` Average price is ${avgPrice.toFixed(2)}.`;
  } else {
    summary += ' No price data available.';
  }

  if (avgRating !== null) {
    summary += ` Average rating is ${avgRating.toFixed(1)}.`;
  } else {
    summary += ' No rating data available.';
  }

  summary += ` ${inStock} item${inStock !== 1 ? 's are' : ' is'} currently in stock`;

  if (outOfStock > 0) {
    summary += `, ${outOfStock} out of stock.`;
  } else {
    summary += '.';
  }

  return summary;
}

