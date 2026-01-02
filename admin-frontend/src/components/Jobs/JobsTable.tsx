/**
 * Jobs table component with modern design
 */
import { AutomationJob } from '../../types';
import { formatDate } from '../../utils/date';

interface JobsTableProps {
  jobs: AutomationJob[];
}

export default function JobsTable({ jobs }: JobsTableProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      queued: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-300',
        border: 'border-gray-500/30',
        glow: 'shadow-gray-500/20',
      },
      running: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        glow: 'shadow-blue-500/20',
      },
      completed: {
        bg: 'bg-green-500/20',
        text: 'text-green-300',
        border: 'border-green-500/30',
        glow: 'shadow-green-500/20',
      },
      failed: {
        bg: 'bg-red-500/20',
        text: 'text-red-300',
        border: 'border-red-500/30',
        glow: 'shadow-red-500/20',
      },
    };

    const variant = variants[status as keyof typeof variants] || variants.queued;

    return (
      <span
        className={`px-3 py-1.5 text-xs font-bold rounded-full border ${variant.bg} ${variant.text} ${variant.border} ${variant.glow} shadow-lg`}
      >
        {status.toLowerCase()}
      </span>
    );
  };

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full divide-y divide-white/5">
        <thead>
          <tr className="bg-white/5">
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Job Type
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Finished At
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Error
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="hover:bg-white/5 transition-all duration-300 group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-bold text-cyan-300">#{job.id}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-medium">
                {job.job_type.replace('_', ' ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(job.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {formatDate(job.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {formatDate(job.finished_at)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {job.error_message ? (
                  <div
                    className="max-w-xs truncate text-red-300 group-hover:text-red-200 transition-colors"
                    title={job.error_message}
                  >
                    {job.error_message}
                  </div>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
