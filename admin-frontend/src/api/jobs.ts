/**
 * Automation Jobs API
 */
import { apiGet, apiPost } from './client';
import { AutomationJob } from '../types';

export async function fetchJobs(): Promise<AutomationJob[]> {
  return apiGet<AutomationJob[]>('/automation/jobs/');
}

export async function triggerScrape(): Promise<{ job_id: number; status: string }> {
  return apiPost<{ job_id: number; status: string }>('/automation/scrape-products/', {});
}

