/**
 * Sidebar navigation with glassmorphism
 */
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/jobs', label: 'Automation Jobs', icon: '⚙️' },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-72 glass-strong border-r border-white/10">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center h-20 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
              E
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Ecommerce Admin
              </h1>
              <p className="text-xs text-gray-400">Automation System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white shadow-lg shadow-purple-500/20 border border-purple-500/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-r-full shadow-lg shadow-purple-400/50" />
                )}
                <span className={`mr-3 text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">Environment</div>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                Local Dev
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
