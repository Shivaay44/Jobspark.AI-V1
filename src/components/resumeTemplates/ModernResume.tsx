import { ResumeData } from '../../types';

interface Props {
  data: ResumeData;
}

export default function ModernResume({ data }: Props) {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  return (
    <div className="bg-white text-slate-800 p-8 md:p-14 shadow-xl max-w-4xl mx-auto font-sans relative overflow-hidden" id="modern-resume-template">
      {/* Visual Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8 mb-8 mt-2">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-950 leading-tight tracking-tight mb-5">
            {personalInfo?.fullName || 'Your Name'}
          </h1>
          {personalInfo?.headline && (
            <p className="text-lg font-semibold text-indigo-600 mt-4 flex items-center gap-1.5">
              <span>{personalInfo.headline}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100/50 min-w-[240px]">
          {personalInfo?.email && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo?.linkedin && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                LinkedIn Profile
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Summary & Core Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          {summary && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-600 rounded" />
                Executive Summary
              </h2>
              <p className="text-[14px] leading-relaxed text-slate-600 whitespace-pre-line">
                {summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-600 rounded" />
                Work History
              </h2>
              <div className="space-y-6">
                {experience.map((job, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-slate-100 space-y-1.5 group">
                    <div className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-600 -left-[8px] top-1 group-hover:bg-indigo-600 transition-colors" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <h3 className="font-bold text-slate-900 text-[15px]">{job.role || 'Role'}</h3>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : (job.startDate || job.endDate || 'Period')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{job.company || 'Company'}</p>
                    {job.achievements && job.achievements.length > 0 && (
                      <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1 mt-1">
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
        </div>

        {/* Right Side: Education, Skills & Projects */}
        <div className="space-y-8">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h2 className="text-md font-bold text-slate-950 uppercase tracking-wider">
                Expertise & Skills
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((skill, idx) => (
                  <span key={idx} className="bg-white border border-slate-200/60 text-slate-700 text-[10px] px-2.5 py-1 font-semibold rounded-lg shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-md font-bold text-slate-950 uppercase tracking-wider">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{edu.degree || 'Degree'}</h3>
                    <p className="text-xs text-slate-600 font-medium">{edu.school || 'School'}</p>
                    <span className="text-[10px] text-indigo-600 font-medium block">{edu.year || 'Year'}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-md font-bold text-slate-950 uppercase tracking-wider">
                Key Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <div key={idx} className="space-y-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/40">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-slate-900 text-xs">{project.name || 'Project Name'}</h3>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 hover:underline">
                          Link
                        </a>
                      )}
                    </div>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, techIdx) => (
                          <span key={techIdx} className="bg-slate-200/50 text-[9px] text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.achievements && project.achievements.length > 0 && (
                      <ul className="list-disc pl-3 text-[11px] text-slate-500 leading-relaxed mt-1.5 space-y-0.5">
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
      </div>
    </div>
  );
}
