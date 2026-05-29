import { supabase } from '../lib/supabase';
import { ResumeData } from '../types';

export async function saveResume(data: ResumeData) {
  const title = data.personalInfo?.fullName || 'Untitled Resume';
  const { error } = await supabase
    .from('resumes')
    .insert([
      {
        title,
        content: data,
      },
    ]);

  if (error) {
    throw error;
  }
}
