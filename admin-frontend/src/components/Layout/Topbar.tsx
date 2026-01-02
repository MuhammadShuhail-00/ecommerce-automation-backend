/**
 * Topbar component with glassmorphism
 */
export default function Topbar() {
  return (
    <div className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-1 h-8 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full" />
          <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ecommerce Automation Admin
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-gray-300">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
