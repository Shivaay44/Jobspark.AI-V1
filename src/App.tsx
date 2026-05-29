import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  Menu, X, Sparkles, RotateCcw, 
  MessageSquare, FileText, Target 
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import ResumeBuilder from './components/ResumeBuilder';
import ToolsDashboard from './components/ToolsDashboard';
import { storage } from './services/storage';
import { testConnection } from './services/api';

type View = 'assistant' | 'builder' | 'tools';

const navItems = [
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'builder', label: 'Resume Builder', icon: FileText },
  { id: 'tools', label: 'Career Tools', icon: Target },
];

export default function App() {
  const [activeView, setActiveView] = useState<View>('assistant');
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
        <header className="h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center px-4 md:px-6 z-40">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-3 -ml-3"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="ml-4 md:ml-0 font-semibold text-lg">
            {navItems.find(item => item.id === activeView)?.label}
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
    </div>
  );
}
