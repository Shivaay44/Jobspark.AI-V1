import { useState } from 'react';
import { ResumeData, Experience } from '../../types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function ExperienceStep({ data, onChange }: Props) {
  const experiences = data.experience;
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAdd = () => {
    onChange({
      ...data,
      experience: [...experiences, { company: '', role: '', startDate: '', endDate: '', achievements: [] }]
    });
  };

  const handleRemove = (index: number) => {
    onChange({
      ...data,
      experience: experiences.filter((_, i) => i !== index)
    });
  };

  const handleChange = (index: number, exp: Partial<Experience>) => {
    onChange({
      ...data,
      experience: experiences.map((e, i) => i === index ? { ...e, ...exp } : e)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white">Work Experience</h3>
          <p className="text-slate-400 text-sm">Tell us about your professional journey.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {experiences.map((exp, i) => {
            const isCollapsed = !!collapsed[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
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
                      {exp.company || 'New Company'} {exp.role ? `— ${exp.role}` : ''}
                    </span>
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      {exp.startDate || 'Start'} - {exp.endDate || 'End'}
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
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Company</label>
                        <input
                          placeholder="e.g. Google"
                          value={exp.company}
                          onChange={(e) => handleChange(i, { company: e.target.value })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Role</label>
                        <input
                          placeholder="e.g. Senior Developer"
                          value={exp.role}
                          onChange={(e) => handleChange(i, { role: e.target.value })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Start Date</label>
                        <input
                          placeholder="e.g. Jan 2021"
                          value={exp.startDate || ''}
                          onChange={(e) => handleChange(i, { startDate: e.target.value })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">End Date</label>
                        <input
                          placeholder="e.g. Present"
                          value={exp.endDate || ''}
                          onChange={(e) => handleChange(i, { endDate: e.target.value })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Key Achievements & Bullet Points
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const currentAchievements = exp.achievements || [];
                            handleChange(i, { achievements: [...currentAchievements, ''] });
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(exp.achievements || []).map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex gap-2 items-center">
                            <input
                              placeholder={`e.g. Developed features which led to direct metrics...`}
                              value={bullet}
                              onChange={(e) => {
                                const updated = [...(exp.achievements || [])];
                                updated[bulletIdx] = e.target.value;
                                handleChange(i, { achievements: updated });
                              }}
                              className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (exp.achievements || []).filter((_, idx) => idx !== bulletIdx);
                                handleChange(i, { achievements: updated });
                              }}
                              className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {(!exp.achievements || exp.achievements.length === 0) && (
                          <button
                            type="button"
                            onClick={() => handleChange(i, { achievements: [''] })}
                            className="w-full py-3 border border-dashed border-white/10 rounded-xl text-center text-xs text-slate-500 hover:border-indigo-500/40 hover:text-indigo-400 transition-all cursor-pointer"
                          >
                            No bullets added. Click to add your first achievement bullet.
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {experiences.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-slate-500">No experience added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
