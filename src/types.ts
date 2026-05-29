export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  headline?: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}

export interface Project {
  name: string;
  technologies: string[];
  achievements: string[];
  link: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  awards: string[];
}
