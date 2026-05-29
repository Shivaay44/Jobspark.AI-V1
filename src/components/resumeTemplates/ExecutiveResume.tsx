import { ResumeData } from '../../types';

interface Props {
  data: ResumeData;
}

export default function ExecutiveResume({ data }: Props) {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  return (
    <div className="bg-[#FCFCFC] text-slate-900 p-10 md:p-14 shadow-xl max-w-4xl mx-auto font-serif" id="executive-resume-template">
      {/* Top Border with Royal Gold Highlight Accent */}
      <div className="w-24 h-1 bg-[#B38F4F] mx-auto mb-6" />

      {/* Centered Name and Info Header */}
      <div className="text-center pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-normal tracking-tight text-slate-950 font-sans uppercase mb-4">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        {personalInfo?.headline && (
          <p className="text-sm font-semibold tracking-wider text-[#B38F4F] font-sans uppercase mt-3">
            {personalInfo.headline}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 font-sans mt-4">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && (
            <>
              <span className="text-[#B38F4F]">|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo?.location && (
            <>
              <span className="text-[#B38F4F]">|</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo?.linkedin && (
            <>
              <span className="text-[#B38F4F]">|</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#B38F4F] hover:underline">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo?.portfolio && (
            <>
              <span className="text-[#B38F4F]">|</span>
              <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-[#B38F4F] hover:underline">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="my-8">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-[#B38F4F] mb-3 font-sans">
            Executive Statement
          </h2>
          <p className="text-sm md:text-md italic text-center max-w-2xl mx-auto leading-relaxed text-slate-700 whitespace-pre-line">
            "{summary}"
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-4 font-sans text-center">
            Leadership & Accomplishments
          </h2>
          <div className="space-y-6">
            {experience.map((job, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-950 text-md">{job.role || 'Role'}</span>
                  <span className="text-xs text-slate-500 font-sans font-medium uppercase tracking-wider">
                    {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : (job.startDate || job.endDate || 'Period')}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#B38F4F] font-sans uppercase tracking-wider">{job.company || 'Company'}</div>
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="list-disc list-inside pl-1 text-[13px] text-slate-700 space-y-1.5 mt-2">
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
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-4 font-sans text-center">
            Credentials & Academics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {education.map((edu, idx) => (
              <div key={idx} className="border-l-2 border-[#B38F4F]/40 pl-4 py-1">
                <span className="font-bold text-slate-950 text-sm block">{edu.degree || 'Degree'}</span>
                <span className="text-xs text-slate-600 font-sans block mt-0.5">{edu.school || 'School'}</span>
                <span className="text-xs text-[#B38F4F] font-sans font-semibold block mt-1">{edu.year || 'Year'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lower Dual Columns: Skills & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills Column */}
        {skills && skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-3 font-sans">
              Expertise
            </h3>
            <div className="flex flex-wrap gap-2 pt-1 font-sans">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-50 text-slate-700 text-[10px] px-2.5 py-1 font-semibold border border-slate-100 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Column */}
        {projects && projects.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-3 font-sans">
              Selected Engagements
            </h3>
            <div className="space-y-4">
              {projects.map((project, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-950 text-sm">{project.name || 'Project Name'}</span>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:underline">
                        Link
                      </a>
                    )}
                  </div>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-[10px] text-[#B38F4F] font-sans font-medium uppercase tracking-wider py-0.5">
                      {project.technologies.join(', ')}
                    </p>
                  )}
                  {project.achievements && project.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-600 leading-relaxed space-y-0.5">
                      {project.achievements.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
