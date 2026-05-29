import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  Target, 
  FileSearch, 
  Linkedin, 
  Mail, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Upload,
  Loader2
} from 'lucide-react';
import { analyzeResume } from '../services/ai';
import { storage } from '../services/storage';

export default function ToolsDashboard() {
  const [activeTool, setActiveTool] = useState<'reviewer' | 'matcher' | 'cover-letter' | 'linkedin' | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-load resume when component mounts or tool changes
  useEffect(() => {
    loadResumeIntoTools(true);
  }, [activeTool]);

  const loadResumeIntoTools = (silent: boolean = false) => {
    const savedResume = storage.loadResume();
    if (savedResume && (savedResume.personalInfo?.fullName || savedResume.summary || savedResume.skills?.length > 0)) {
      const formattedText = formatResumeForTools(savedResume);
      setResumeText(formattedText);
      if (!silent) {
        toast.success('Successfully loaded resume from Resume Builder!');
      }
    } else if (!silent) {
      toast.error('No resume draft found! Please fill out the Resume Builder first.');
    }
  };

  const formatResumeForTools = (data: any): string => {
    let text = `Name: ${data.personalInfo.fullName || 'N/A'}\n`;
    text += `Location: ${data.personalInfo.location || 'N/A'}\n`;
    text += `Email: ${data.personalInfo.email || 'N/A'}\n\n`;

    if (data.summary) text += `Professional Summary:\n${data.summary}\n\n`;

    if (data.experience?.length > 0) {
      text += `Work Experience:\n`;
      data.experience.forEach((exp: any) => {
        text += `- ${exp.role} at ${exp.company} (${exp.period})\n`;
        text += `  ${exp.description}\n\n`;
      });
    }

    if (data.education?.length > 0) {
      text += `Education:\n`;
      data.education.forEach((edu: any) => {
        text += `- ${edu.degree} from ${edu.school} (${edu.year})\n`;
      });
      text += '\n';
    }

    if (data.skills?.length > 0) {
      text += `Skills: ${data.skills.join(', ')}\n\n`;
    }

    if (data.projects?.length > 0) {
      text += `Projects:\n`;
      data.projects.forEach((proj: any) => {
        text += `- ${proj.name}: ${proj.description}\n`;
      });
    }

    return text.trim();
  };

  const tools = [
    { 
      id: 'reviewer', 
      title: 'ATS Reviewer', 
      icon: ShieldCheck, 
      color: 'bg-indigo-500/10 text-indigo-400',
      description: 'Get an ATS score and improvement suggestions.' 
    },
    { 
      id: 'matcher', 
      title: 'JD Matcher', 
      icon: Target, 
      color: 'bg-emerald-500/10 text-emerald-400',
      description: 'See how well you match a specific job description.' 
    },
    { 
      id: 'cover-letter', 
      title: 'Cover Letter', 
      icon: Mail, 
      color: 'bg-orange-500/10 text-orange-400',
      description: 'Generate a personalized, role-specific cover letter.' 
    },
    { 
      id: 'linkedin', 
      title: 'LinkedIn Optimizer', 
      icon: Linkedin, 
      color: 'bg-sky-500/10 text-sky-400',
      description: 'Improve your headline and about section.' 
    }
  ];

  const handleRunAnalysis = async () => {
    if (!resumeText) {
      toast.error('Resume content cannot be empty.');
      setError('Resume content cannot be empty.');
      return;
    }
    if (activeTool === 'matcher' && !jdText.trim()) {
      toast.error('Please enter a target Job Description to match against.');
      setError('Please enter a target Job Description to match against.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    const toastId = toast.loading('Initiating AI-Powered Document Analysis...');
    try {
      const data = await analyzeResume(resumeText, activeTool === 'matcher' ? jdText : undefined);
      setAnalysisResult(data);
      toast.success('Analysis complete! Review your tailored scores and feedback.', { id: toastId });
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(errMsg);
      toast.error(`Analysis issue: ${errMsg}`, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-12 pb-24 h-full overflow-y-auto">
      {/* Tool Selection - better on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id as any);
              setAnalysisResult(null);
            }}
            className={`p-6 bg-white/5 border border-white/10 rounded-3xl text-left transition-all hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 group ${
              activeTool === tool.id ? 'ring-2 ring-indigo-500/50 bg-white/10 shadow-indigo-500/10' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${tool.color}`}>
              <tool.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-1 text-white">{tool.title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{tool.description}</p>
          </button>
        ))}
      </div>

      {activeTool && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-[40px] shadow-2xl space-y-8"
        >
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-white">
              {tools.find(t => t.id === activeTool)?.title}
            </h3>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Live Engine v4.2
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Resume Content</label>
                <button
                  onClick={() => loadResumeIntoTools()}
                  className="flex items-center gap-2 text-xs px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-slate-400 font-bold"
                >
                  <Upload className="w-4 h-4" />
                  Load from Resume Builder
                </button>
              </div>

              <textarea 
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Resume content will appear here..."
                className="w-full h-80 bg-slate-900/40 border border-white/5 rounded-3xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono text-sm text-slate-300 transition-all shadow-inner"
              />
              
              {activeTool === 'matcher' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Paste Job Description</label>
                  <textarea 
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the target job description..."
                    className="w-full h-48 bg-slate-900/40 border border-white/5 rounded-3xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none font-mono text-sm text-slate-300 placeholder:text-slate-700 shadow-inner"
                  />
                </div>
              )}

              {error && (
                <div role="alert" className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !resumeText}
                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all text-lg shadow-xl shadow-white/5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Crunching Data...</span>
                  </>
                ) : (
                  <>
                    <FileSearch className="w-6 h-6" />
                    <span>Generate Insights</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col">
              {analysisResult ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 space-y-6 bg-slate-950/40 rounded-[32px] p-8 border border-white/5 shadow-inner">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 glass-dark rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">ATS Score</span>
                      <span className="text-5xl font-black text-white">{analysisResult.atsScore}%</span>
                    </div>
                    <div className="p-6 glass-dark rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Impression</span>
                      <span className="text-5xl font-black text-white">{analysisResult.recruiterImpressionScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <AlertCircle className="text-amber-400 w-5 h-5" />
                       <h5 className="font-bold text-white uppercase text-xs tracking-widest">Missing Keywords</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingKeywords?.map((kw: string) => (
                        <span key={kw} className="px-3 py-1 bg-amber-400/10 text-amber-300 text-[10px] font-bold rounded-full border border-amber-400/20 uppercase tracking-widest">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 className="text-teal-400 w-5 h-5" />
                       <h5 className="font-bold text-white uppercase text-xs tracking-widest">Key Improvements</h5>
                    </div>
                    <ul className="space-y-3">
                      {analysisResult.improvementSuggestions?.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5 text-sm text-slate-300 shadow-sm">
                          <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-indigo-600/20 text-indigo-100 rounded-2xl border border-indigo-500/20 shadow-md shadow-indigo-500/5">
                    <p className="text-[10px] text-indigo-300 mb-1 uppercase tracking-widest font-bold">Expert Feedback</p>
                    <p className="text-sm leading-relaxed italic opacity-90">"{analysisResult.feedback}"</p>
                  </div>
                </motion.div>
              ) : (
                <div role="status" aria-live="polite" className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[32px] p-12 text-center space-y-4 bg-slate-900/30">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center shadow-lg text-indigo-400">
                    <BarChart3 className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-xl text-slate-200">Awaiting AI Input</h5>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                      Verify your resume draft is loaded or write custom text on the left, then click <strong className="text-white">Generate Insights</strong> to trigger the AI-powered engine!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state when no tool is selected */}
      {!activeTool && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-600">
          <Loader2 className="w-12 h-12 mb-4 opacity-10 animate-pulse" />
          <p className="text-xl font-medium tracking-tight">Select a precision tool above to get started</p>
          <p className="text-slate-800 text-xs uppercase tracking-[0.3em] mt-2 font-bold">Jobspark.AI Career Suite</p>
        </div>
      )}
    </div>
  );
}
