import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, RefreshCw, Crown, Cloud, FileText, Sparkles, Share2, X, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ResumeData, Experience, Education, Project } from '../../types';
import { storage } from '../../services/storage';
import { saveResume } from '../../services/resumeService';
import { usePlan } from '../../hooks/usePlan';
import PremiumGate from '../PremiumGate';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import LoadingSpinner from '../LoadingSpinner';
import PDFDownloadButton from '../pdf/PDFDownloadButton';

import ModernResume from '../resumeTemplates/ModernResume';
import ExecutiveResume from '../resumeTemplates/ExecutiveResume';
import StudentResume from '../resumeTemplates/StudentResume';

import ModernResumePDF from '../pdfTemplates/ModernResumePDF';
import ExecutiveResumePDF from '../pdfTemplates/ExecutiveResumePDF';
import GraduateResumePDF from '../pdfTemplates/GraduateResumePDF';

type ResumeTemplate = 'modern' | 'executive' | 'student';

const templates: Record<ResumeTemplate, React.ComponentType<{ data: any }>> = {
  modern: ModernResume,
  executive: ExecutiveResume,
  student: StudentResume,
};

const pdfTemplates: Record<ResumeTemplate, React.ComponentType<{ data: any }>> = {
  modern: ModernResumePDF,
  executive: ExecutiveResumePDF,
  student: GraduateResumePDF,
};

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseMarkdownToResume(markdown: string, original: ResumeData): ResumeData {
  const result: ResumeData = {
    personalInfo: { ...original.personalInfo },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    awards: [...original.awards],
  };

  const lines = markdown.split('\n').map(line => line.trim());
  const cleanMd = (str: string) => str.replace(/[*_#`\-\[\]•]/g, '').trim();

  // Extract metadata (first few lines)
  let nameFound = false;
  let headlineFound = false;
  const headerLines = lines.filter(l => l.length > 0).slice(0, 10);
  const origName = original.personalInfo?.fullName?.toLowerCase().trim();

  for (const line of headerLines) {
    const cleaned = cleanMd(line);
    if (!nameFound && (cleaned.toLowerCase().includes(origName || '') || (origName && cleaned.length > 1 && origName.includes(cleaned.toLowerCase())))) {
      result.personalInfo.fullName = cleaned;
      nameFound = true;
    } else if (nameFound && !headlineFound && cleaned.length > 2) {
      if (!cleaned.includes('@') && !cleaned.includes('linkedin.com') && !cleaned.includes('github') && !cleaned.includes('|')) {
        result.personalInfo.headline = cleaned;
        headlineFound = true;
      }
    }
  }

  // Fallbacks if not detected
  if (!result.personalInfo.fullName) {
    result.personalInfo.fullName = original.personalInfo?.fullName || '';
  }
  if (!result.personalInfo.headline) {
    result.personalInfo.headline = original.personalInfo?.headline || '';
  }

  // Scan emails, phone, links
  for (const line of lines) {
    if (line.includes('@') && /[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/.test(line)) {
      const emailMatch = line.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        result.personalInfo.email = emailMatch[0];
      }
    }
    if (/(\+?\d{1,4}[-.\s]??)?\(?\d{3}\)?[-.\s]??\d{3}[-.\s]??\d{4}/.test(line)) {
      const phoneMatch = line.match(/(\+?\d{1,4}[-.\s]??)?\(?\d{3}\)?[-.\s]??\d{3}[-.\s]??\d{4}/);
      if (phoneMatch) {
        result.personalInfo.phone = phoneMatch[0];
      }
    }
    if (line.toLowerCase().includes('linkedin.com')) {
      const liMatch = line.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
      if (liMatch) {
        result.personalInfo.linkedin = liMatch[1] || liMatch[0];
      }
    }
  }

  // Parse lines into sections
  interface Section {
    title: string;
    lines: string[];
  }
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  
  const sectionKeywords = [
    'summary', 'profile', 'executive', 'objective',
    'experience', 'history', 'employment', 'work',
    'project', 'portfolio',
    'skills', 'expertise', 'technologies', 'technical skills',
    'education', 'academic',
    'awards'
  ];

  for (const line of lines) {
    const isHeader = line.startsWith('#') || (line.startsWith('**') && line.endsWith('**') && line.length < 50 && !line.includes(':'));
    let isNewSection = false;
    let title = '';

    if (isHeader) {
      const cleanTitle = line.replace(/^[#\s]+/, '').replace(/\*\*+/g, '').trim();
      const lowerTitle = cleanTitle.toLowerCase();
      
      const isMajorHeader = line.startsWith('# ') || line.startsWith('## ');
      const isSectionKeyword = sectionKeywords.some(k => lowerTitle.includes(k));
      
      if (isMajorHeader || isSectionKeyword) {
        isNewSection = true;
        title = cleanTitle;
      }
    }

    if (isNewSection) {
      currentSection = { title, lines: [] };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.lines.push(line);
    } else {
      // Lines before any section (introduction)
      if (line.length > 5 && !line.startsWith('#') && !line.includes('|') && !line.includes('@')) {
        if (!result.summary) {
          result.summary = line;
        } else if (result.summary.split('\n').length < 4) {
          result.summary += '\n' + line;
        }
      }
    }
  }

  const getSectionLines = (keywords: string[]): string[] => {
    const sec = sections.find(s => keywords.some(k => s.title.toLowerCase().includes(k)));
    return sec ? sec.lines : [];
  };

  // 1. Professional Summary section
  const summaryLines = getSectionLines(['summary', 'profile', 'executive', 'objective']);
  if (summaryLines.length > 0) {
    result.summary = summaryLines.filter(l => l.length > 0 && !l.startsWith('-') && !l.startsWith('*')).join('\n');
  }

  // 2. Experience Section
  const expLines = getSectionLines(['experience', 'history', 'employment', 'work']);
  if (expLines.length > 0) {
    interface ParsedJob {
      role: string;
      company: string;
      startDate: string;
      endDate: string;
      achievements: string[];
    }
    const experiences: ParsedJob[] = [];
    let currentJob: ParsedJob | null = null;
    let pendingCompany = '';
    let pendingRole = '';
    let pendingDates = '';

    for (const line of expLines) {
      if (line.length === 0) continue;
      const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || /^\d+\.\s+/.test(line);
      
      if (!isBullet) {
        const cleaned = line.replace(/\*\*+/g, '').replace(/[\*#_]/g, '').trim();
        if (cleaned.length === 0) continue;

        // Skip decorative / introductory lines like "Key Responsibilities:"
        if (cleaned.endsWith(':') || cleaned.toLowerCase().startsWith('responsibilities') || cleaned.toLowerCase().startsWith('key achievements')) {
          continue;
        }

        // Try to identify if this line contains date patterns (e.g., "2020 - " or "Oct 2021")
        const dateRegex = /\b(19|20)\d{2}\b|\b(present|current|now)\b/i;
        const hasDate = dateRegex.test(cleaned);

        // Check if the line contains a split character
        const containsSplit = /at|\||-|–|—/.test(cleaned);
        
        // Match original roles/companies
        const matchedOrig = original.experience.find(exp => 
          (exp.company && cleaned.toLowerCase().includes(exp.company.toLowerCase())) || 
          (exp.role && cleaned.toLowerCase().includes(exp.role.toLowerCase()))
        );

        // If it looks like a new job header (contains split, matches original, or contains date and is short)
        const isJobHeader = containsSplit || matchedOrig || (hasDate && cleaned.length < 80);

        if (isJobHeader) {
          let role = '';
          let company = '';
          let dateStr = '';

          // Extract dates in parentheses or brackets, or at the end
          const dateMatch = cleaned.match(/\(([^)]+)\)/) || cleaned.match(/\[([^\]]+)\]/) || cleaned.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|(?:19|20)\d{2})\s*[-–—]\s*(Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|(?:19|20)\d{2})/i);
          if (dateMatch) {
            dateStr = dateMatch[0].replace(/[()]/g, '');
          }

          let titlePart = cleaned;
          if (dateStr) {
            titlePart = cleaned.replace(dateStr, '').replace(/[()]/g, '').trim();
          }

          // Split company and role
          let parts: string[] = [];
          if (titlePart.includes(' at ')) {
            parts = titlePart.split(' at ');
            role = parts[0];
            company = parts[1];
          } else if (titlePart.includes('|')) {
            parts = titlePart.split('|');
            role = parts[0];
            company = parts[1];
          } else if (titlePart.includes(' — ')) {
            parts = titlePart.split(' — ');
            role = parts[0];
            company = parts[1];
          } else if (titlePart.includes(' - ')) {
            parts = titlePart.split(' - ');
            role = parts[0];
            company = parts[1];
          } else if (titlePart.includes(' – ')) {
            parts = titlePart.split(' – ');
            role = parts[0];
            company = parts[1];
          } else {
            if (matchedOrig) {
              if (matchedOrig.company && titlePart.toLowerCase().includes(matchedOrig.company.toLowerCase())) {
                company = matchedOrig.company;
                role = titlePart.replace(new RegExp(escapeRegExp(matchedOrig.company), 'i'), '').trim();
              } else if (matchedOrig.role && titlePart.toLowerCase().includes(matchedOrig.role.toLowerCase())) {
                role = matchedOrig.role;
                company = titlePart.replace(new RegExp(escapeRegExp(matchedOrig.role), 'i'), '').trim();
              }
            }
            if (!role && !company) {
              role = titlePart;
            }
          }

          role = role.trim().replace(/^[,|:\-\s]+|[,|:\-\s]+$/g, '');
          company = company.trim().replace(/^[,|:\-\s]+|[,|:\-\s]+$/g, '');

          if (!company && pendingCompany) {
            company = pendingCompany;
            pendingCompany = '';
          }
          if (!role && pendingRole) {
            role = pendingRole;
            pendingRole = '';
          }

          let startDate = '';
          let endDate = '';
          if (dateStr) {
            const dateParts = dateStr.split(/[-–—]/).map(d => d.trim());
            startDate = dateParts[0] || '';
            endDate = dateParts[1] || '';
          } else if (pendingDates) {
            const dateParts = pendingDates.split(/[-–—]/).map(d => d.trim());
            startDate = dateParts[0] || '';
            endDate = dateParts[1] || '';
            pendingDates = '';
          }

          const detailMatch = original.experience.find(exp => 
            (company && exp.company && (company.toLowerCase().includes(exp.company.toLowerCase()) || exp.company.toLowerCase().includes(company.toLowerCase()))) ||
            (role && exp.role && (role.toLowerCase().includes(exp.role.toLowerCase()) || exp.role.toLowerCase().includes(role.toLowerCase())))
          );

          if (detailMatch) {
            if (!startDate && detailMatch.startDate) startDate = detailMatch.startDate;
            if (!endDate && detailMatch.endDate) endDate = detailMatch.endDate;
            if (!company && detailMatch.company) company = detailMatch.company;
            if (!role && detailMatch.role) role = detailMatch.role;
          }

          currentJob = {
            role: role || 'Professional Experience',
            company: company || 'Organization',
            startDate: startDate,
            endDate: endDate,
            achievements: []
          };
          experiences.push(currentJob);
        } else {
          if (cleaned.length < 50) {
            const isCompany = original.experience.some(exp => exp.company && cleaned.toLowerCase() === exp.company.toLowerCase());
            const isRole = original.experience.some(exp => exp.role && cleaned.toLowerCase() === exp.role.toLowerCase());
            
            if (isCompany) {
              pendingCompany = cleaned;
            } else if (isRole) {
              pendingRole = cleaned;
            } else {
              if (!pendingCompany) pendingCompany = cleaned;
              else if (!pendingRole) pendingRole = cleaned;
            }
          }
        }
      } else if (currentJob) {
        const bulletText = line.replace(/^([-*•\s]+|\d+\.\s+)/, '').trim();
        if (bulletText.length > 0) {
          currentJob.achievements.push(bulletText);
        }
      }
    }

    if (experiences.length > 0) {
      result.experience = experiences;
    }
  }

  // 3. Projects Section
  const projLines = getSectionLines(['project', 'portfolio']);
  if (projLines.length > 0) {
    interface ParsedProject {
      name: string;
      achievements: string[];
      technologies?: string[];
    }
    const projects: ParsedProject[] = [];
    let currentProj: ParsedProject | null = null;

    for (const line of projLines) {
      if (line.length === 0) continue;
      const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•');

      if (!isBullet) {
        const cleaned = line.replace(/\*\*+/g, '');
        const matchedOrig = original.projects?.find(p => p.name && cleaned.toLowerCase().includes(p.name.toLowerCase()));
        
        currentProj = {
          name: matchedOrig ? matchedOrig.name : cleanMd(line),
          achievements: []
        };
        projects.push(currentProj);
      } else if (currentProj) {
        const bulletText = line.replace(/^[-*•\s]+/, '').trim();
        if (bulletText.length > 0) {
          currentProj.achievements.push(bulletText);
        }
      }
    }

    if (projects.length > 0) {
      result.projects = projects.map((p, index) => {
        const origProject = original.projects?.[index];
        return {
          name: p.name,
          achievements: p.achievements.length > 0 ? p.achievements : (origProject?.achievements || []),
          technologies: p.technologies || origProject?.technologies || [],
          link: origProject?.link || '',
        };
      });
    }
  }

  // 4. Skills Section
  const skillsLines = getSectionLines(['skills', 'expertise', 'technologies', 'technical skills']);
  if (skillsLines.length > 0) {
    const allSkills: string[] = [];
    for (const line of skillsLines) {
      if (line.length === 0) continue;
      if (line.includes(',')) {
        let skillPart = line;
        if (line.includes(':')) {
          skillPart = line.split(':')[1];
        }
        const parsed = skillPart.split(',').map(s => s.replace(/^[*\s\-•]+/, '').replace(/[*\s\-•]+$/, '').trim()).filter(s => s.length > 0 && s.length < 30);
        allSkills.push(...parsed);
      } else if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
        const parsed = line.replace(/^[-*•\s\d.]+(\:\s*)?/, '').trim();
        if (parsed.includes(',')) {
          const split = parsed.split(',').map(s => s.replace(/^[*\s\-•]+/, '').trim()).filter(s => s.length > 0);
          allSkills.push(...split);
        } else if (parsed.length > 0 && parsed.length < 35) {
          allSkills.push(parsed);
        }
      }
    }

    if (allSkills.length > 0) {
      result.skills = Array.from(new Set(allSkills));
    }
  }

  // 5. Education Section
  const eduLines = getSectionLines(['education', 'academic']);
  if (eduLines.length > 0) {
    interface ParsedEdu {
      school: string;
      degree: string;
      year: string;
    }
    const education: ParsedEdu[] = [];
    for (const line of eduLines) {
      if (line.length === 0) continue;
      const cleaned = line.replace(/\*\*+/g, '');
      const hasDegreeOrSchool = /degree|university|college|school|bachelor|master|b\.s|m\.s|btech|mtech/i.test(cleaned) || 
                               original.education.some(edu => (edu.school && cleaned.includes(edu.school)) || (edu.degree && cleaned.includes(edu.degree)));
      
      if (hasDegreeOrSchool) {
        let yearStr = '';
        const yearMatch = line.match(/\(([^)]+)\)/) || line.match(/\[([^\]]+)\]/) || line.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          yearStr = yearMatch[0].replace(/[()]/g, '');
        }

        let school = '';
        let degree = '';
        let parts: string[] = [];

        if (cleaned.includes('|')) {
          parts = cleaned.split('|');
          degree = parts[0];
          school = parts[1];
        } else if (cleaned.includes(',')) {
          parts = cleaned.split(',');
          degree = parts[0];
          school = parts[1];
        } else {
          const matchedOrig = original.education.find(edu => 
            (edu.school && cleaned.toLowerCase().includes(edu.school.toLowerCase())) || 
            (edu.degree && cleaned.toLowerCase().includes(edu.degree.toLowerCase()))
          );
          if (matchedOrig) {
            school = matchedOrig.school;
            degree = matchedOrig.degree;
          } else {
            degree = cleaned;
          }
        }

        education.push({
          school: cleanMd(school || 'University'),
          degree: cleanMd(degree || 'Degree'),
          year: yearStr || ''
        });
      }
    }
    if (education.length > 0) {
      result.education = education;
    }
  }

  // Fallbacks for empty fields
  if (result.experience.length === 0) result.experience = [...original.experience];
  if (result.education.length === 0) result.education = [...original.education];
  if (result.projects.length === 0) result.projects = [...original.projects];
  if (result.skills.length === 0) result.skills = [...original.skills];
  if (result.summary.length === 0) result.summary = original.summary;

  return result;
}

const templatesList = [
  { id: 'modern', name: 'Modern Indigo', desc: 'Sleek visual accents' },
  { id: 'executive', name: 'Executive Gold', desc: 'Dignified & timeless' },
  { id: 'student', name: 'Graduate Fresh', desc: 'Education first' },
] as const;

interface Props {
  content: string | null;
  data: ResumeData;
  onRegenerate: () => void;
  isGenerating?: boolean;
}

export function ResumePreview({ content, data, onRegenerate, isGenerating }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('modern');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'markdown'>('visual');
  const { plan, canDownloadPDF, upgradeToPro } = usePlan();

  const handleShare = () => {
    try {
      const payload = { data, content };
      const base64Str = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${base64Str}`;
      setShareLink(shareUrl);
      setShowShareModal(true);

      // Auto-copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            toast.success("Share link copied to clipboard!");
          })
          .catch(() => {
            fallbackCopy(shareUrl);
          });
      } else {
        fallbackCopy(shareUrl);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('Failed to generate share link.');
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("Share link copied to clipboard!");
    } catch (e) {
      console.error(e);
      // User can still copy from the modal manually
    }
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving draft in Firebase Firestore...');
    try {
      await saveResume(data);
      toast.success('Draft saved successfully to Firestore Cloud', { id: toastId });
    } catch (err: any) {
      console.error('Firebase save error:', err);
      toast.error('Unable to save draft. Please check if you are signed in.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  console.log("Selected Template:", selectedTemplate);
  const effectiveResumeData = useMemo(() => {
    if (!content) return data;
    try {
      let jsonString = content.trim();
      const codeBlockMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/) || jsonString.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1].trim();
      }
      if (jsonString.startsWith('{')) {
        const parsed = JSON.parse(jsonString);
        if (parsed && typeof parsed === 'object') {
          // Parse Experience
          const parsedExp: Experience[] = Array.isArray(parsed.experience) 
            ? parsed.experience.map((exp: any, i: number) => {
                const origExp = data.experience?.[i] as Experience | undefined;
                let startDate = '';
                let endDate = '';
                if (exp.period) {
                  const parts = exp.period.split(/[-–—]/).map((p: any) => p.trim());
                  startDate = parts[0] || '';
                  endDate = parts[1] || '';
                }
                return {
                  company: exp.company || exp.organization || origExp?.company || '',
                  role: exp.title || exp.role || exp.position || origExp?.role || '',
                  startDate: startDate || exp.startDate || origExp?.startDate || '',
                  endDate: endDate || exp.endDate || origExp?.endDate || '',
                  achievements: Array.isArray(exp.bullets) ? exp.bullets : (Array.isArray(exp.achievements) ? exp.achievements : [])
                };
              })
            : [...data.experience];

          // Parse Education
          let parsedEdu: Education[] = [];
          if (typeof parsed.education === 'string') {
            const str = parsed.education;
            let school = '';
            let degree = '';
            let year = '';

            const yearMatch = str.match(/\d{4}\s*[-–—]\s*\d{4}/) || str.match(/\b(19|20)\d{2}\b/);
            if (yearMatch) {
              year = yearMatch[0];
            }
            let textWithoutYear = year ? str.replace(year, '').replace(/[(),]/g, '').trim() : str;
            textWithoutYear = textWithoutYear.replace(/^[-–—\s]+|[-–—\s]+$/g, '');

            const parts = textWithoutYear.split(/—|--|-|,|at/);
            if (parts.length >= 2) {
              degree = parts[0].trim();
              school = parts[1].trim();
            } else {
              degree = textWithoutYear;
              school = data.education?.[0]?.school || '';
            }

            parsedEdu = [{
              school: school || 'University',
              degree: degree || 'Degree',
              year: year || ''
            }];
          } else if (Array.isArray(parsed.education)) {
            parsedEdu = parsed.education.map((edu: any, i: number) => {
              const origEdu = data.education?.[i] as Education | undefined;
              return {
                school: edu.school || edu.institution || origEdu?.school || '',
                degree: edu.degree || edu.fieldOfStudy || origEdu?.degree || '',
                year: edu.year || edu.period || edu.graduationYear || origEdu?.year || ''
              };
            });
          } else {
            parsedEdu = [...data.education];
          }

          // Parse Projects
          const parsedProj: Project[] = Array.isArray(parsed.projects)
            ? parsed.projects.map((proj: any, i: number) => {
                const origProj = data.projects?.[i] as Project | undefined;
                return {
                  name: proj.name || proj.title || origProj?.name || '',
                  achievements: Array.isArray(proj.bullets) ? proj.bullets : (Array.isArray(proj.achievements) ? proj.achievements : []),
                  technologies: Array.isArray(proj.technologies) ? proj.technologies : (origProj?.technologies || []),
                  link: proj.link || origProj?.link || ''
                };
              })
            : [...data.projects];

          // Parse Skills
          let parsedSkills: string[] = [];
          if (typeof parsed.skills === 'string') {
            parsedSkills = parsed.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          } else if (Array.isArray(parsed.skills)) {
            parsedSkills = parsed.skills;
          } else if (parsed.skills && typeof parsed.skills === 'object') {
            const values = Object.values(parsed.skills).flat();
            parsedSkills = values.filter((v: any) => typeof v === 'string') as string[];
          } else {
            parsedSkills = [...data.skills];
          }

          return {
            personalInfo: {
              fullName: parsed.name || parsed.personalInfo?.fullName || data.personalInfo?.fullName || '',
              headline: parsed.headline || parsed.personalInfo?.headline || data.personalInfo?.headline || '',
              email: parsed.contact?.email || parsed.personalInfo?.email || data.personalInfo?.email || '',
              phone: parsed.contact?.phone || parsed.personalInfo?.phone || data.personalInfo?.phone || '',
              location: parsed.contact?.location || parsed.personalInfo?.location || data.personalInfo?.location || '',
              linkedin: parsed.contact?.linkedin || parsed.personalInfo?.linkedin || data.personalInfo?.linkedin || '',
              portfolio: parsed.contact?.portfolio || parsed.personalInfo?.portfolio || data.personalInfo?.portfolio || '',
            },
            summary: parsed.summary || data.summary || '',
            experience: parsedExp,
            education: parsedEdu,
            projects: parsedProj,
            skills: parsedSkills,
            awards: parsed.awards || data.awards || []
          };
        }
      }
    } catch (e) {
      console.warn('Is not JSON, parsing as markdown:', e);
    }

    try {
      return parseMarkdownToResume(content, data);
    } catch (e) {
      console.error('Failed to parse generated AI resume markdown, using form raw data:', e);
    }
    return data;
  }, [content, data]);

  const SelectedPDFTemplate = pdfTemplates[selectedTemplate] ?? ModernResumePDF;

  if (!content) {
    return (
      <div className="flex items-center justify-center py-12 p-4">
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center max-w-lg bg-slate-900/10 backdrop-blur-md w-full">
          <h2 className="text-xl font-bold text-white">
            Your professional resume will appear here
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Fill your information and generate your AI resume.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Your ATS Resume
          </h3>
          <p className="text-slate-400">Ready to download</p>
        </div>

        <div className="flex items-center gap-3">
          {plan === 'free' && (
            <div className="text-xs px-3 py-1.5 bg-white/5 rounded-full flex items-center gap-2 border border-white/10">
              <span>PDF requires Pro Upgrade</span>
              <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
          )}

          <Button
            disabled
            variant="secondary"
          >
            <Cloud className="mr-2 h-4 w-4" />
            Save Draft
            <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full font-semibold">
              Coming Soon
            </span>
          </Button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-2xl font-medium hover:bg-emerald-600/30 hover:text-emerald-300 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share Preview
          </button>

          <button
            onClick={() => {
              onRegenerate();
            }}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl font-medium hover:bg-white/10 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        </div>
      </div>

      {/* Navigation tabs & template selection for preview mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex bg-slate-950/80 p-1 rounded-2xl w-fit border border-white/10">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Interactive Resume Sheet
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'markdown'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Raw AI Output
          </button>
        </div>

        {activeTab === 'visual' && (
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/40 p-1.5 rounded-2xl border border-white/5 max-w-full">
            {templatesList.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  selectedTemplate === t.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={t.desc}
              >
                <span>{t.name}</span>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-900">
                  ATS Optimized
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resume Content */}
      {activeTab === 'visual' ? (
        <div className="overflow-hidden rounded-3xl shadow-2xl border border-white/5">
          {(() => {
            const SelectedTemplate = templates[selectedTemplate] ?? ModernResume;
            if (!SelectedTemplate) {
              return (
                <div className="p-8 text-center text-slate-400 font-medium">
                  Template unavailable
                </div>
              );
            }
            return <SelectedTemplate data={effectiveResumeData} />;
          })()}
        </div>
      ) : (
        <div className="glass p-8 md:p-12 rounded-3xl min-h-[500px] flex items-center justify-center">
          {isGenerating ? (
            <LoadingSpinner text="Generating your professional resume..." />
          ) : !content ? (
            <EmptyState
              title="No AI Output Available"
              description="Generate a resume first."
            />
          ) : (
            <div className="w-full text-left">
              <div className="markdown-body prose prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Download Button */}
      <div className="flex justify-center">
        <PremiumGate
          allowed={canDownloadPDF}
          fallback={
            <div className="w-full max-w-md mx-auto text-center space-y-4">
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500/20 via-teal-600/30 to-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl cursor-pointer"
              >
                <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                Unlock PDF Download with Pro
              </button>
              <p className="text-xs text-slate-500 font-mono">
                PDF downloads require a Pro plan subscription (Demo pricing ₹299/mo)
              </p>
            </div>
          }
        >
          <div className="w-full max-w-md mx-auto flex flex-col gap-3">
            {(() => {
              const safeName = (effectiveResumeData?.personalInfo?.fullName || 'resume')
                ?.replace(/\s+/g, "-")
                ?.toLowerCase();
              const fileName = `${safeName}-resume.pdf`;
              
              return (
                <PDFDownloadButton
                  fileName={fileName}
                  document={
                    <SelectedPDFTemplate
                      data={effectiveResumeData}
                    />
                  }
                />
              );
            })()}

            {typeof window !== 'undefined' && window.self !== window.top && (
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-indigo-600/25 active:scale-95 transition-all text-center decoration-transparent cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Can't download? Open in New Tab to Bypass Sandbox
              </a>
            )}
          </div>
        </PremiumGate>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass max-w-md w-full rounded-3xl p-8 text-center border border-white/10 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center">
              <Crown className="w-9 h-9 text-slate-950" />
            </div>

            <h3 className="text-2xl font-bold mb-3">Unlock Unlimited Downloads</h3>
            <p className="text-slate-400 mb-8">
              PDF exports are exclusive to <span className="text-amber-400 font-semibold">Pro</span> plans.<br />
              Upgrade to Pro for unlimited resumes, premium PDF styling, plus unmetered AI coaching.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  upgradeToPro();
                  setShowUpgradeModal(false);
                  toast.success('👑 Successfully upgraded to Pro (Demo Mode)! Enjoy unlimited downloads.');
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-2xl text-lg hover:scale-[1.02] transition-colors cursor-pointer"
              >
                Upgrade to Pro — ₹299/month
              </button>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="glass max-w-lg w-full rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
                Share Resume Preview
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Anyone with this link can view your completed, professionally styled resume preview instantly—no registration or data entry required!
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                Your Shareable Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-mono text-slate-300 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast.success("Copied to clipboard!");
                  }}
                  className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold text-sm transition-all cursor-pointer flex items-center gap-2 text-white"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex gap-3 text-xs text-slate-400 leading-normal">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">How it works:</span> This link contains a secure, offline representation of your structured resume data. When your friends view this link, they will see your fully styled interactive resume preview instantly.
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-colors text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
