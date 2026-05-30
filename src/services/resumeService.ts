import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { storage } from './storage';
import { ResumeData } from '../types';

export async function saveResume(data: ResumeData) {
  // Always save locally first so search caching and offline flow work
  storage.saveResume(data);

  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const resumeRef = doc(db, 'resumes', userId);
    try {
      const docSnap = await getDoc(resumeRef);
      if (!docSnap.exists()) {
        // Create Mode
        await setDoc(resumeRef, {
          title: data.personalInfo?.fullName || 'Untitled Resume',
          ownerId: userId,
          content: data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Update Mode - keep createdAt unmodified to satisfy the immutability rules
        const existingData = docSnap.data();
        await setDoc(resumeRef, {
          title: data.personalInfo?.fullName || 'Untitled Resume',
          ownerId: userId,
          content: data,
          createdAt: existingData.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `resumes/${userId}`);
    }
  }
}

export async function loadResumeFromCloud(): Promise<ResumeData | null> {
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const resumeRef = doc(db, 'resumes', userId);
    try {
      const docSnap = await getDoc(resumeRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData && cloudData.content) {
          // Cache it locally so it populates the standard editor on next render
          storage.saveResume(cloudData.content);
          return cloudData.content as ResumeData;
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `resumes/${userId}`);
    }
  }
  return null;
}
