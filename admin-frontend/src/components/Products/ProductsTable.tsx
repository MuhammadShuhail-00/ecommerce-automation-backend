/**
 * Products table component with modern design
 */
import { Product } from '../../types';
import { formatDate } from '../../utils/date';

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export default function ProductsTable({
  products,
  onDelete,
  deletingId,
}: ProductsTableProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full divide-y divide-white/5">
        <thead>
          <tr className="bg-white/5">
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Last Synced
            </th>
            <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-white/5 transition-all duration-300 group"
            >
              <td className="px-6 py-4">
                <div className="text-sm font-semibold text-white truncate max-w-xs group-hover:text-cyan-300 transition-colors" title={product.name}>
                  {product.name}
                </div>
                {product.source_url && (
                  <a
                    href={product.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 mt-1"
                  >
                    View source <span>→</span>
                  </a>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-200 font-semibold">
                  ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.rating !== null ? (
                  <span className="flex items-center gap-2">
                    <span className="text-sm text-gray-200 font-medium">{product.rating}/5</span>
                    <span className="text-yellow-400 text-lg">★</span>
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border ${
                    product.stock > 0
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}
                >
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {formatDate(product.last_synced_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  onClick={() => onDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold hover:scale-110 transform duration-200"
                >
                  {deletingId === product.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
