/**
 * Toggle switch component with modern design
 */
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-12 h-6 rounded-full transition-all duration-300 ${
            checked
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-purple-500/50'
              : 'bg-gray-700/50 group-hover:bg-gray-600/50 border border-white/10'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${
              checked ? 'translate-x-6' : 'translate-x-0'
            } ${checked ? 'scale-110' : ''}`}
          />
        </div>
      </div>
      <span className={`text-sm font-medium ${checked ? 'text-white' : 'text-gray-300'} ${disabled ? 'opacity-50' : ''} transition-colors`}>
        {label}
      </span>
    </label>
  );
}
