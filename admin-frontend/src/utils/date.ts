/**
 * Date formatting utilities
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '-';
  return formatDate(dateString);
}

