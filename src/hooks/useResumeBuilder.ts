import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';
import { ResumeData, PersonalInfo, Experience, Education } from '../types';
import { storage } from '../services/storage';
import { generateResumeContent } from '../services/ai';
import { incrementUsage } from '../services/usageService';
import { saveDraft, loadDraft } from '../utils/draftStorage';

export const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  awards: [],
};

export function useResumeBuilder() {
  const [step, setStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('shared');
    
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(sharedData))));
        if (decoded && typeof decoded === 'object') {
          if ('data' in decoded && 'content' in decoded) {
            setResumeData(decoded.data);
            setGeneratedResume(decoded.content);
          } else {
            setResumeData(decoded);
          }
          setStep(6); // Step 6 is the ResumePreview step
          toast.success('Loaded shared resume preview!');
          setIsLoaded(true);
          return;
        }
      } catch (e) {
        console.error('Error decoding shared resume data:', e);
        toast.error('Failed to parse shared resume link.');
      }
    }

    const savedDraft = localStorage.getItem("jobspark_resume_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object') {
          if ('data' in parsed && 'version' in parsed) {
            setResumeData(parsed.data);
            if (parsed.updatedAt) {
              setLastSaved(new Date(parsed.updatedAt).toLocaleTimeString());
            }
          } else {
            setResumeData(parsed);
            setLastSaved(new Date().toLocaleTimeString());
          }
        }
      } catch (e) {
        console.error("Failed to parse saved draft:", e);
      }
    } else {
      const saved = loadDraft<ResumeData>();
      if (saved && saved.data) {
        setResumeData(saved.data);
        if (saved.updatedAt) {
          try {
            setLastSaved(new Date(saved.updatedAt).toLocaleTimeString());
          } catch (e) {
            setLastSaved(null);
          }
        }
      }
    }
    setIsLoaded(true);
  }, []);

  const [debouncedResumeData] = useDebounce(resumeData, 1000);

  // Save on change
  useEffect(() => {
    if (isLoaded) {
      saveDraft(debouncedResumeData);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [debouncedResumeData, isLoaded]);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  const updateSummary = (summary: string) => {
    setResumeData(prev => ({ ...prev, summary }));
  };

  const addExperience = () => {
    setResumeData(prev => ({ 
      ...prev, 
      experience: [...prev.experience, { company: '', role: '', startDate: '', endDate: '', achievements: [] }] 
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, exp: Partial<Experience>) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((e, i) => i === index ? { ...e, ...exp } : e)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({ 
      ...prev, 
      education: [...prev.education, { school: '', degree: '', year: '' }] 
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, edu: Partial<Education>) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((e, i) => i === index ? { ...e, ...edu } : e)
    }));
  };

  const addSkill = (skill: string) => {
    if (!resumeData.skills.includes(skill)) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const generateResume = async (stepsCount: number) => {
    console.log("Generating resume...");
    setIsGenerating(true);
    setError(null);
    
    const payload = resumeData;
    console.log("Request Payload:", payload);

    try {
      const promise = generateResumeContent(payload);

      toast.promise(promise, {
        loading: 'Architecting your tailored ATS Resume...',
        success: 'Your ATS-optimized Resume has been generated!',
        error: 'Unable to generate resume. Please try again in a few seconds.',
      });

      let content = await promise;
      
      // FORCE HEADLINE / NAME FIX (Handles JSON and Markdown safely)
      try {
        let jsonString = content.trim();
        const codeBlockMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/) || jsonString.match(/```\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonString = codeBlockMatch[1].trim();
        }
        const parsed = JSON.parse(jsonString);
        if (parsed && typeof parsed === 'object') {
          parsed.name = resumeData.personalInfo?.fullName || parsed.name || '';
          parsed.headline = resumeData.personalInfo?.headline || parsed.headline || '';
          content = JSON.stringify(parsed, null, 2);
        }
      } catch (e) {
        const forcedHeadline = resumeData.personalInfo?.headline?.trim() || "Full Stack Developer";
        content = content.replace(
          /(^|\n)([A-Za-z\s]+)\n([A-Za-z\s]+)\n/, 
          `$1${resumeData.personalInfo.fullName}\n${forcedHeadline}\n`
        );
      }

      const response = { data: content };
      console.log("Final Resume Content after fix:", response.data);

      setGeneratedResume(content);
      setStep(stepsCount);
      incrementUsage('resumeGenerations');
    } catch (err) {
      console.error('Generation failed:', err);
      toast.error(
        "Unable to generate resume. Please try again in a few seconds."
      );
      setError("Unable to generate resume. Please try again in a few seconds.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    step,
    setStep,
    resumeData,
    setResumeData,
    generatedResume,
    isGenerating,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    removeExperience,
    updateExperience,
    addEducation,
    removeEducation,
    updateEducation,
    addSkill,
    removeSkill,
    generateResume,
    error,
    setError,
    lastSaved,
    setLastSaved,
  };
}

