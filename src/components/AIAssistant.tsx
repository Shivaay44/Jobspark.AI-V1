import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, RotateCcw, Trash2, AlertCircle, Crown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { sendChatMessage, ChatMessage } from '../services/ai';
import { storage } from '../services/storage';
import LoadingSpinner from './LoadingSpinner';
import { usePlan } from '../hooks/usePlan';
import { incrementUsage } from '../services/usageService';

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { plan, canChat, usage, upgradeToPro } = usePlan();
  const [showAssistantUpgrade, setShowAssistantUpgrade] = useState(false);

  // Load chat on mount
  useEffect(() => {
    const savedChat = storage.loadChat();
    if (savedChat.length > 0) {
      setMessages(savedChat);
    }
  }, []);

  // Save chat whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      storage.saveChat(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    if (!canChat) {
      setShowAssistantUpgrade(true);
      toast.error('Free career chat limit reached (10 queries). Please upgrade to Pro!');
      return;
    }

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: textToSend }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Include profile context if available
      const profile = storage.loadProfile();
      const baseInstruction = `
You are Jobspark.AI — a world-class, empathetic, and highly intelligent career coach for Indian and global job markets.

Rules:
- Maintain full conversation memory. Never ask for the same info twice.
- Be proactive. Use previously shared details (name, education, experience, target job).
- Always use strong action verbs and quantify achievements.
- For freshers: Emphasize projects, internships, skills, and CGPA.
- Make every resume ATS-friendly.
- Tone: Professional yet encouraging, like a supportive mentor.
`;
      const systemInstruction = profile 
        ? `${baseInstruction}\n\nUser Profile: ${JSON.stringify(profile)}. Be proactive and reference these specific details in your guidance.`
        : baseInstruction;

      const response = await sendChatMessage(textToSend, messages, systemInstruction);
      const botMessage: ChatMessage = { role: 'model', parts: [{ text: response.text }] };
      setMessages(prev => [...prev, botMessage]);
      incrementUsage('chatMessages');
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      toast.error(`Assistant issue: ${msg}`);
      const errorMessage: ChatMessage = { 
        role: 'model', 
        parts: [{ text: `I'm sorry, I encountered an error: ${msg}. Please try again.` }] 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history? This cannot be undone.")) {
      setMessages([]);
      storage.clearChat();
      toast.success('Chat history cleared successfully');
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl ring-1 ring-white/20 transition-transform hover:scale-110">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold tracking-tight text-white">How can I help your career today?</h3>
            <p className="text-slate-400 text-lg">
              I can help you build an ATS-friendly resume, match jobs to your profile, or practice for your next interview.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full pt-4">
            {[
              "Build a resume from scratch",
              "Review my existing resume",
              "Match my resume to a JD",
              "Interview prep for Google"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all text-left shadow-lg text-slate-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-8"
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xl ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'
              }`}>
                {msg.role === 'user' ? (
                  <User className="text-white w-5 h-5" />
                ) : (
                  <Bot className="text-white w-5 h-5" />
                )}
              </div>
              <div className={`max-w-[80%] p-5 rounded-2xl shadow-xl glass`}>
                <div className="markdown-body">
                  <ReactMarkdown>{msg.parts?.[0]?.text || ''}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shadow-xl">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div className="glass px-5 py-2.5 rounded-2xl shadow-xl flex items-center">
                <LoadingSpinner text="Crafting response..." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 pt-4">
        {error && (
          <div className="max-w-4xl mx-auto mb-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="max-w-4xl mx-auto relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything about your career..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 shadow-2xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all placeholder:text-slate-500 min-h-[64px] max-h-32 text-white"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {messages.length > 0 && (
              <button 
                onClick={clearChat}
                className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-xl transition-all ${
                input.trim() 
                  ? 'bg-indigo-600 text-white hover:scale-105 shadow-lg active:scale-95' 
                  : 'bg-white/5 text-slate-600'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-500 mt-3 uppercase tracking-widest font-bold opacity-60">
          Jobspark.AI v4.2 Engine Active ● Verified AI Guidance
          {plan === 'free' && (
            <span className="text-emerald-400 font-mono block mt-1 normal-case tracking-normal">
              (* {10 - usage.chatMessages} of 10 free AI resume/coaching queries remaining *)
            </span>
          )}
        </p>
      </div>

      {/* Upgrade Modal */}
      {showAssistantUpgrade && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="glass max-w-md w-full rounded-3xl p-8 text-center border border-indigo-500/20 shadow-2xl space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="w-9 h-9 text-slate-950" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Unlock Continuous Coaching</h3>
              <p className="text-slate-300 text-sm">
                You've hit the maximum free chat queries (10). Upgrading to <span className="text-amber-400 font-semibold">Pro</span> grants unlimited ongoing conversations with your AI Career Mentor, deep interview simulations, and resume iterations.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  upgradeToPro();
                  setShowAssistantUpgrade(false);
                  toast.success('👑 Successfully upgraded to Pro (Demo Mode)! Enjoy unlimited career coach sessions.');
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-2xl text-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Upgrade to Pro — ₹299/month
              </button>

              <button
                onClick={() => setShowAssistantUpgrade(false)}
                className="w-full py-3 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm"
              >
                No thanks, dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
