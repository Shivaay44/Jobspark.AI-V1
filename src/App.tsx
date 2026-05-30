import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  Menu, X, Sparkles, RotateCcw, 
  MessageSquare, FileText, Target, LogIn, LogOut, User
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import ResumeBuilder from './components/ResumeBuilder';
import ToolsDashboard from './components/ToolsDashboard';
import { AuthModal } from './components/AuthModal';
import { storage } from './services/storage';
import { testConnection } from './services/api';
import { useFirebase } from './components/FirebaseProvider';

type View = 'assistant' | 'builder' | 'tools';

const navItems = [
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'builder', label: 'Resume Builder', icon: FileText },
  { id: 'tools', label: 'Career Tools', icon: Target },
];

export default function App() {
  const { user, loading, logout } = useFirebase();
  const [activeView, setActiveView] = useState<View>('assistant');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });

  // Close sidebar when switching views on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [activeView]);

  // Test connection to backend and check for shared links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('shared')) {
      setActiveView('builder');
    }

    testConnection()
      .then((data) => {
        console.log('Backend connected:', data);
      })
      .catch((err) => {
        console.error('Backend connection error:', err);
      });
  }, []);

  const handleReset = () => {
    if (confirm('Reset all data? This cannot be undone.')) {
      storage.clearAll();
      toast.success('Successfully cleared database and reset state');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-[#0F172A] text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0 }}
        className="fixed md:static h-full bg-slate-950/95 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50 overflow-hidden shadow-2xl"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tighter">Jobspark.AI</h1>
            <p className="text-[10px] text-slate-500 -mt-1">Career Suite</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all font-medium ${
                activeView === item.id 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Reset */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Data
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-3 -ml-3"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="ml-4 md:ml-0 font-semibold text-lg">
              {navItems.find(item => item.id === activeView)?.label}
            </div>
          </div>

          {/* User Profile / Authentication Button */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full border border-white/10 border-t-indigo-500 animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold leading-none">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium text-slate-300">{user.displayName || user.email}</span>
                <button
                  onClick={logout}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-4 py-2 rounded-full text-xs font-semibold leading-none shadow-lg shadow-indigo-500/20 transition-all scale-100 active:scale-95 cursor-pointer"
              >
                <LogIn size={12} />
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {activeView === 'assistant' && <AIAssistant key="assistant" />}
            {activeView === 'builder' && <ResumeBuilder key="builder" />}
            {activeView === 'tools' && <ToolsDashboard key="tools" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Auth Modal Modal overlay */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
