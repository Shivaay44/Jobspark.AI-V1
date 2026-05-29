import { ResumeData } from '../../types';

interface Props {
  data: ResumeData;
}

export default function StudentResume({ data }: Props) {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  return (
    <div className="bg-white text-slate-800 p-8 md:p-14 shadow-xl max-w-4xl mx-auto font-sans relative overflow-hidden" id="student-resume-template">
      {/* Playful Soft Accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

      {/* Fresh Centered Layout */}
      <div className="text-center pb-8 border-b-2 border-slate-100 mb-8 mt-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        {personalInfo?.headline && (
          <p className="text-sm font-semibold text-emerald-600 tracking-wide mt-1">
            {personalInfo.headline}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-4 font-medium bg-emerald-50/40 py-2.5 px-4 rounded-2xl w-fit mx-auto border border-emerald-500/10">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && (
            <>
              <span className="text-emerald-300">|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo?.location && (
            <>
              <span className="text-emerald-300">|</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo?.linkedin && (
            <>
              <span className="text-emerald-300">|</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo?.portfolio && (
            <>
              <span className="text-emerald-300">|</span>
              <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Summary / Core Objectives */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#059669] mb-3">
            Career Objective
          </h2>
          <p className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-line">
            {summary}
          </p>
        </section>
      )}

      {/* Educational Highlights (Positioned at top for students!) */}
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#059669] border-b border-emerald-100 pb-1.5 mb-4">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{edu.degree || 'Degree'}</h3>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{edu.school || 'School'}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100/40 px-2.5 py-1 rounded-lg font-mono">
                  {edu.year || 'Year'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interships & Professional Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#059669] border-b border-emerald-100 pb-1.5 mb-4">
            Experience & Internships
          </h2>
          <div className="space-y-6">
            {experience.map((job, idx) => (
              <div key={idx} className="relative pl-5 border-l-2 border-emerald-200 space-y-1">
                <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 -left-[6px] top-1.5" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <h3 className="font-bold text-slate-900 text-sm">{job.role || 'Role'}</h3>
                  <span className="text-xs text-slate-500 font-medium font-mono">
                    {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : (job.startDate || job.endDate || 'Period')}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-600">{job.company || 'Company'}</p>
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1.5 mt-2">
                    {job.achievements.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical and Soft Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#059669] border-b border-emerald-100 pb-1.5 mb-3">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-50 border border-slate-200/80 text-slate-700 text-[10px] px-3 py-1.5 font-bold rounded-xl shadow-sm hover:scale-105 transition-all">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#059669] border-b border-emerald-100 pb-1.5 mb-4">
            Academic & Personal Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, idx) => (
              <div key={idx} className="space-y-1.5 p-4 rounded-2xl border border-dotted border-slate-200">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-sm">{project.name || 'Project Name'}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline font-medium">
                      Project Link
                    </a>
                  )}
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.map((tech, techIdx) => (
                      <span key={techIdx} className="bg-emerald-50 text-[9px] text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-500/10 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.achievements && project.achievements.length > 0 && (
                  <ul className="list-disc pl-4 text-xs text-slate-600 leading-relaxed space-y-1">
                    {project.achievements.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
