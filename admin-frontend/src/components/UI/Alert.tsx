/**
 * Alert component with modern glassmorphic design
 */
interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export default function Alert({ variant = 'info', title, children, onClose }: AlertProps) {
  const variants = {
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-300',
      iconBg: 'bg-green-500/20',
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-300',
      iconBg: 'bg-red-500/20',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-300',
      iconBg: 'bg-yellow-500/20',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      iconBg: 'bg-blue-500/20',
    },
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const variantStyles = variants[variant];

  return (
    <div
      className={`glass rounded-xl border ${variantStyles.border} ${variantStyles.bg} p-4 flex items-start gap-4 transition-all duration-300`}
    >
      <div className={`${variantStyles.iconBg} rounded-lg p-2 flex-shrink-0`}>
        <span className={`text-lg ${variantStyles.text} font-bold`}>{icons[variant]}</span>
      </div>
      <div className="flex-1 min-w-0">
        {title && <div className={`font-bold mb-1 ${variantStyles.text}`}>{title}</div>}
        <div className={`text-sm ${variantStyles.text}`}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${variantStyles.text} opacity-70 hover:opacity-100 transition-opacity hover:scale-110 transform duration-200`}
        >
          ✕
        </button>
      )}
    </div>
  );
}
