/**
 * Products API
 */
import { apiGet, apiPost, apiPut, apiDelete } from './client';
import { Product } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/products/');
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  return apiPost<Product>('/products/', payload);
}

export async function updateProduct(
  id: number,
  payload: Partial<Product>
): Promise<Product> {
  return apiPut<Product>(`/products/${id}/`, payload);
}

export async function deleteProduct(id: number): Promise<void> {
  return apiDelete(`/products/${id}/`);
}

