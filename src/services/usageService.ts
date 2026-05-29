const STORAGE_KEY = 'jobspark-usage';

export interface UsageData {
  chatMessages: number;
  resumeGenerations: number;
}

export function getUsage(): UsageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        chatMessages: 0,
        resumeGenerations: 0,
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse usage data', e);
    return {
      chatMessages: 0,
      resumeGenerations: 0,
    };
  }
}

export function incrementUsage(key: keyof UsageData) {
  try {
    const usage = getUsage();
    usage[key] = (usage[key] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
    // Dispatch custom event to let components react to live usage changes
    window.dispatchEvent(new Event('jobspark_usage_changed'));
  } catch (e) {
    console.error('Failed to save usage data', e);
  }
}
