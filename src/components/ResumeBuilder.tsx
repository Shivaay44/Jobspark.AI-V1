import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Briefcase, GraduationCap, Code, Trophy, 
  Sparkles, Loader2, Cloud, Crown, Trash2, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useResumeBuilder, initialData } from '../hooks/useResumeBuilder';
import { clearDraft } from '../utils/draftStorage';
import { PersonalInfoStep } from './resume/PersonalInfoStep';
import { SummaryStep } from './resume/SummaryStep';
import { ExperienceStep } from './resume/ExperienceStep';
import { EducationStep } from './resume/EducationStep';
import { SkillsStep } from './resume/SkillsStep';
import { ProjectsStep } from './resume/ProjectsStep';
import { ResumePreview } from './resume/ResumePreview';
import { saveResume } from '../services/resumeService';
import { usePlan } from '../hooks/usePlan';
import { useAutoSave } from '../hooks/useAutoSave';

const loadingMessages = [
  "Analyzing professional background...",
  "Optimizing ATS keywords...",
  "Enhancing resume structure...",
  "Building premium layout...",
  "Generating recruiter-ready content...",
];

export default function ResumeBuilder() {
  const {
    step,
    setStep,
    resumeData,
    setResumeData,
    generatedResume,
    isGenerating,
    generateResume,
    error,
    setError,
    lastSaved,
    setLastSaved,
  } = useResumeBuilder();

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setLoadingMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  useAutoSave(
    "jobspark_resume_draft",
    resumeData
  );

  const { plan, canGenerateResume, usage, limits, upgradeToPro } = usePlan();
  const [isSaving, setIsSaving] = useState(false);
  const [showBuilderUpgradeModal, setShowBuilderUpgradeModal] = useState(false);
  const [hasStarted, setHasStarted] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return !!params.get('shared');
    }
    return false;
  });

  const handleGenerateClick = () => {
    if (!canGenerateResume) {
      setShowBuilderUpgradeModal(true);
      toast.error('Free resume generation limit reached (3). Please upgrade to Pro!');
      return;
    }
    generateResume(STEPS.length);
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Mirroring current resume progress into Supabase Security Layer...');
    try {
      await saveResume(resumeData);
      toast.success('Resume draft successfully saved in your Supabase cloud table!', { id: toastId });
    } catch (err: any) {
      console.error('Supabase cloud error:', err);
      toast.error(`Cloud backup error: ${err.message || 'Check credentials in settings'}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const STEPS = [
    { id: 'info', title: 'Personal', icon: User },
    { id: 'summary', title: 'Summary', icon: Sparkles },
    { id: 'exp', title: 'Work', icon: Briefcase },
    { id: 'edu', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Code },
    { id: 'projects', title: 'Projects', icon: Trophy },
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const stepContent = [
    { component: PersonalInfoStep },
    { component: SummaryStep },
    { component: ExperienceStep },
    { component: EducationStep },
    { component: SkillsStep },
    { component: ProjectsStep },
  ];

  if (!hasStarted) {
    return (
      <div id="hero-section" className="h-full flex flex-col justify-center items-center py-12 md:py-24 px-4 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2 select-none"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            Empowered by Advanced AI
          </motion.div>
          
          <motion.h1 
            id="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent"
          >
            Build ATS-Optimized Professional Resumes with AI
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 text-center max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Generate recruiter-ready resumes instantly with premium templates, AI-enhanced writing, and one-click PDF export.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-4 pt-4"
          >
            <button
              id="cta-start-resume"
              onClick={() => setHasStarted(true)}
              className="px-8 py-5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-extrabold text-lg rounded-2xl shadow-xl hover:shadow-indigo-500/20 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer group"
            >
              <span>Create Resume Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {lastSaved && (
              <p className="text-xs text-indigo-400/80 font-mono">
                💡 You have an unfinished draft from {lastSaved}. Clicking will load it.
              </p>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-16 border-t border-white/5"
          >
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-2">
              <span className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold mb-1">
                ATS
              </span>
              <h3 className="text-white font-semibold text-sm">ATS Approved</h3>
              <p className="text-slate-400 text-xs">Engineered to pass employer screenings with optimized layouts.</p>
            </div>
            
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-2">
              <span className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold mb-1">
                AI
              </span>
              <h3 className="text-white font-semibold text-sm">AI Enhanced</h3>
              <p className="text-slate-400 text-xs">Smarter summaries and roles crafted in real-time by models.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-2">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold mb-1">
                📥
              </span>
              <h3 className="text-white font-semibold text-sm">Instant Export</h3>
              <p className="text-slate-400 text-xs">Download professional PDF copies instantly, fully styled.</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-transparent p-4 md:p-6">
      {/* Progress Bar - More Compact */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-[520px] md:min-w-0 gap-2 px-1">
          {STEPS.map((s, i) => (
            <div 
              key={s.id} 
              className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
              onClick={() => setStep(i)}
            >
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all ${
                i <= step ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'
              }`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                i <= step ? 'text-indigo-400' : 'text-slate-600'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step and Draft indicator */}
      <div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 mb-4 gap-2">
        <span className="text-indigo-400 font-bold text-xs tracking-wider uppercase select-none">
          {step < STEPS.length ? `Step ${step + 1} of ${STEPS.length}: ${STEPS[step]?.title}` : 'Resume Preview'}
        </span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-slate-300 font-medium font-mono flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full select-none shadow-sm backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${lastSaved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
            {lastSaved ? `Draft saved at ${lastSaved}` : 'Draft not saved yet'}
          </span>
          <p className="text-xs text-gray-500">
            Draft auto-saved locally
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm">
                {error}
              </motion.div>
            )}

            {step < STEPS.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass p-6 md:p-10 rounded-3xl"
              >
                {stepContent[step] ? React.createElement(stepContent[step].component, { 
                  data: resumeData, 
                  onChange: setResumeData 
                }) : <div className="text-center p-10 text-slate-500">Step not found</div>}
              </motion.div>
            ) : (
              <ResumePreview 
                content={generatedResume} 
                data={resumeData}
                onRegenerate={() => generateResume(STEPS.length)}
                isGenerating={isGenerating}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Buttons - Much Better on Mobile */}
      <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 p-4 -mx-4 md:-mx-6 mt-auto">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button 
            onClick={handleBack}
            disabled={step === 0}
            className="flex-1 py-4 rounded-2xl font-semibold border border-white/20 hover:bg-white/5 disabled:opacity-40 transition-all cursor-pointer"
          >
            ← Previous
          </button>

          <button 
            onClick={() => {
              clearDraft();
              setResumeData(initialData);
              setLastSaved(null);
              toast.success("Draft cleared successfully");
            }}
            className="px-5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm font-semibold"
            title="Clear current inputs and delete local draft"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Draft</span>
          </button>

          {step < STEPS.length - 1 ? (
            <button 
              onClick={handleNext}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold transition-all shadow-lg select-none cursor-pointer"
            >
              Next Step →
            </button>
          ) : (
            <button 
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl font-semibold transition-all shadow-lg disabled:opacity-70 select-none cursor-pointer flex flex-col items-center justify-center min-h-[58px]"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                </span>
              ) : (
                <div className="flex flex-col items-center leading-tight">
                  <span>Generate ATS Resume</span>
                  {plan === 'free' && (
                    <span className="text-[10px] opacity-75 font-mono">
                      {3 - usage.resumeGenerations} of 3 free attempts left
                    </span>
                  )}
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showBuilderUpgradeModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="glass max-w-md w-full rounded-3xl p-8 text-center border border-indigo-500/20 shadow-2xl space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="w-9 h-9 text-slate-950" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Unlock Unlimited Generations</h3>
              <p className="text-slate-300 text-sm">
                You've reached the free generation limit (3). Upgrading to <span className="text-amber-400 font-semibold">Pro</span> grants immediate access to unlimited premium resume drafts, full AI Career guidance, and PDF downloads.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  upgradeToPro();
                  setShowBuilderUpgradeModal(false);
                  toast.success('👑 Successfully upgraded to Pro (Demo Mode)! Enjoy unlimited resume drafts.');
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-2xl text-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Upgrade to Pro — ₹299/month
              </button>

              <button
                onClick={() => setShowBuilderUpgradeModal(false)}
                className="w-full py-3 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm"
              >
                No thanks, dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="max-w-md w-full bg-slate-900/90 border border-indigo-500/20 rounded-3xl p-8 text-center shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Decorative radial glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative flex flex-col items-center justify-center">
                {/* Advanced Pulsing Loader */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 border-r-indigo-400"
                  />
                  <motion.div
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400"
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Architecting ATS Masterpiece
                </h3>
                
                {/* Smooth rotating loading messages with active status indicator */}
                <div className="h-12 flex items-center justify-center px-4">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingMessageIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-indigo-200 text-sm md:text-base font-medium font-sans leading-relaxed text-center"
                    >
                      {loadingMessages[loadingMessageIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Fake Micro progress step indicators to make the wait feel fast and highly interactive */}
              <div className="flex justify-center items-center gap-2.5 pt-2">
                {loadingMessages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === loadingMessageIndex
                        ? "w-8 bg-indigo-500"
                        : idx < loadingMessageIndex
                        ? "w-2 bg-indigo-500/60"
                        : "w-2 bg-slate-800"
                    }`}
                  />
                ))}
              </div>
              
              <div className="text-slate-500 text-[10px] font-mono tracking-wider uppercase select-none pt-2">
                Highly Optimized parsing pipeline active
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
