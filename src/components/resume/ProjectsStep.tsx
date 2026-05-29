import { useState } from 'react';
import { ResumeData, Project } from '../../types';
import { Plus, Trash2, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function ProjectsStep({ data, onChange }: Props) {
  const projects = data.projects;
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAdd = () => {
    onChange({
      ...data,
      projects: [...projects, { name: '', link: '', technologies: [], achievements: [] }]
    });
  };

  const handleRemove = (index: number) => {
    onChange({
      ...data,
      projects: projects.filter((_, i) => i !== index)
    });
  };

  const handleChange = (index: number, proj: Partial<Project>) => {
    onChange({
      ...data,
      projects: projects.map((p, i) => i === index ? { ...p, ...proj } : p)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white">Projects</h3>
          <p className="text-slate-400 text-sm">Showcase your best work.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {projects.map((proj, i) => {
            const isCollapsed = !!collapsed[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
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
                      {proj.name || 'New Project'}
                    </span>
                    {proj.link && (
                      <span className="text-[10px] bg-slate-500/10 text-slate-400 px-2 py-0.5 rounded font-mono hidden sm:inline truncate max-w-[150px]">
                        {proj.link}
                      </span>
                    )}
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
                      id={`remove-project-${i}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project Name</label>
                        <input
                          placeholder="e.g. Portfolio Website"
                          value={proj.name}
                          onChange={(e) => handleChange(i, { name: e.target.value })}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project Link</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            placeholder="https://..."
                            value={proj.link}
                            onChange={(e) => handleChange(i, { link: e.target.value })}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Technologies (comma-separated)</label>
                      <input
                        placeholder="e.g. React, Node.js, TypeScript, Tailwind"
                        value={proj.technologies ? proj.technologies.join(', ') : ''}
                        onChange={(e) => {
                          const list = e.target.value.split(',').map(s => s.trim());
                          handleChange(i, { technologies: list });
                        }}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Key Achievements & Core Features
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const currentAchievements = proj.achievements || [];
                            handleChange(i, { achievements: [...currentAchievements, ''] });
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add feature bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(proj.achievements || []).map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex gap-2 items-center">
                            <input
                              placeholder={`e.g. Built and deployed full system flow...`}
                              value={bullet}
                              onChange={(e) => {
                                const updated = [...(proj.achievements || [])];
                                updated[bulletIdx] = e.target.value;
                                handleChange(i, { achievements: updated });
                              }}
                              className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (proj.achievements || []).filter((_, idx) => idx !== bulletIdx);
                                handleChange(i, { achievements: updated });
                              }}
                              className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {(!proj.achievements || proj.achievements.length === 0) && (
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

        {projects.length === 0 && (
          <div className="text-center py-12 border border-dashed border-white/5 rounded-3xl">
            <p className="text-slate-500">No projects added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
