/**
 * Hook for managing products
 */
import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import * as productsApi from '../api/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.fetchProducts();
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (payload: Partial<Product>) => {
    try {
      const newProduct = await productsApi.createProduct(payload);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      throw new Error(message);
    }
  }, []);

  const updateProduct = useCallback(async (id: number, payload: Partial<Product>) => {
    try {
      const updated = await productsApi.updateProduct(id, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      throw new Error(message);
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await productsApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      throw new Error(message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    products,
    loading,
    error,
    refresh,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

