import { ResumeData } from '../../types';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function SummaryStep({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">Professional Summary</h3>
        <p className="text-slate-400 text-sm">Briefly describe your career goals and key strengths.</p>
      </div>
      <div className="space-y-4">
        <textarea
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="e.g. Dedicated software engineer with 5+ years of experience in building scalable web applications. Passionate about clean code and user experience."
          className="w-full h-64 bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-white placeholder:text-slate-600 outline-none"
          id="resume-summary-input"
        />
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-2">
          <span>Tip: Focus on your most relevant achievements.</span>
        </div>
      </div>
    </div>
  );
}
