import { useState } from 'react';
import { ResumeData, Education } from '../../types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function EducationStep({ data, onChange }: Props) {
  const education = data.education;
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAdd = () => {
    onChange({
      ...data,
      education: [...education, { school: '', degree: '', year: '' }]
    });
  };

  const handleRemove = (index: number) => {
    onChange({
      ...data,
      education: education.filter((_, i) => i !== index)
    });
  };

  const handleChange = (index: number, edu: Partial<Education>) => {
    onChange({
      ...data,
      education: education.map((e, i) => i === index ? { ...e, ...edu } : e)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white">Education</h3>
          <p className="text-slate-400 text-sm">Where did you study?</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {education.map((edu, i) => {
            const isCollapsed = !!collapsed[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 bg-white/5 rounded-2xl relative border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 select-none">
                  <div 
                    onClick={() => toggleCollapse(i)}
                    className="flex-1 flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg font-extrabold font-mono">
                      #{i + 1}
                    </span>
                    <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[350px]">
                      {edu.school || 'New Institution'} {edu.degree ? `— ${edu.degree}` : ''}
                    </span>
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      {edu.year || 'Years'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCollapse(i)}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={isCollapsed ? "Expand section" : "Collapse section"}
                    >
                      {isCollapsed ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronUp className="w-4.5 h-4.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete entry"
                      id={`remove-edu-${i}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">School/University</label>
                        <input
                          placeholder="e.g. Stanford University"
                          value={edu.school}
                          onChange={(e) => handleChange(i, { school: e.target.value })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Degree</label>
                        <input
                          placeholder="e.g. B.Tech Computer Science"
                          value={edu.degree}
                          onChange={(e) => handleChange(i, { degree: e.target.value })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Year</label>
                      <input
                        placeholder="e.g. 2018 - 2022"
                        value={edu.year}
                        onChange={(e) => handleChange(i, { year: e.target.value })}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {education.length === 0 && (
          <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl">
            <p className="text-slate-500">No education entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
