import { ResumeData } from '../../types';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function SkillsStep({ data, onChange }: Props) {
  const skills = data.skills;

  const handleAdd = (skill: string) => {
    if (!skills.includes(skill)) {
      onChange({
        ...data,
        skills: [...skills, skill]
      });
    }
  };

  const handleRemove = (skill: string) => {
    onChange({
      ...data,
      skills: skills.filter(s => s !== skill)
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">Skills</h3>
        <p className="text-slate-400 text-sm">List your expert abilities.</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 min-h-[100px] p-4 bg-white/5 rounded-3xl border border-white/5">
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30"
              >
                <span className="text-sm font-semibold">{skill}</span>
                <button
                  id={`remove-skill-${skill}`}
                  onClick={() => handleRemove(skill)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <input
            type="text"
            placeholder="Type and press Enter..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                handleAdd(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-white min-w-[200px]"
          />
        </div>
        <p className="text-[10px] text-slate-500 font-medium">PRESS ENTER TO ADD A SKILL</p>
      </div>
    </div>
  );
}
