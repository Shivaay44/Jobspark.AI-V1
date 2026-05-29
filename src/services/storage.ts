export interface StorageData {
  messages: any[];
  userProfile: any;
  resumeDraft: any;
  analysisResults: any[];
}

const STORAGE_KEYS = {
  CHAT: 'jobspark_chat_history',
  PROFILE: 'jobspark_user_profile',
  RESUME: 'jobspark_resume_draft',
  ANALYSIS: 'jobspark_analysis_results',
  PDF_DOWNLOADS: 'jobspark_pdf_downloads',
  IS_PRO: 'jobspark_is_pro',
};

export const storage = {
  saveChat: (messages: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
    } catch (e) {
      console.error('Save chat error:', e);
    }
  },
  loadChat: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Load chat error:', e);
      return [];
    }
  },
  clearChat: () => {
    localStorage.removeItem(STORAGE_KEYS.CHAT);
  },
  
  saveProfile: (profile: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Save profile error:', e);
    }
  },
  loadProfile: (): any => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Load profile error:', e);
      return null;
    }
  },

  saveResume: (resume: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
    } catch (e) {
      console.error('Save resume error:', e);
    }
  },
  loadResume: (): any => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUME);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Load resume error:', e);
      return null;
    }
  },

  saveAnalysis: (results: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYSIS, JSON.stringify(results));
    } catch (e) {
      console.error('Save analysis error:', e);
    }
  },
  loadAnalysis: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYSIS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Load analysis error:', e);
      return [];
    }
  },

  getPdfDownloads: (): number => {
    try {
      const count = localStorage.getItem(STORAGE_KEYS.PDF_DOWNLOADS);
      return count ? parseInt(count) : 0;
    } catch {
      return 0;
    }
  },

  incrementPdfDownloads: () => {
    try {
      const current = storage.getPdfDownloads();
      localStorage.setItem(STORAGE_KEYS.PDF_DOWNLOADS, (current + 1).toString());
    } catch (e) {
      console.error('Failed to increment download count');
    }
  },

  isPro: (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_PRO) === 'true';
    } catch {
      return false;
    }
  },

  upgradeToPro: () => {
    localStorage.setItem(STORAGE_KEYS.IS_PRO, 'true');
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};
