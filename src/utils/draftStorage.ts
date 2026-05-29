const STORAGE_KEY = "jobspark_resume_draft";

export interface SavedDraft<T> {
  version: number;
  updatedAt: string;
  data: T;
}

const CURRENT_VERSION = 1;

/**
 * Save draft safely to localStorage
 */
export function saveDraft<T>(data: T): void {
  try {
    const payload: SavedDraft<T> = {
      version: CURRENT_VERSION,
      updatedAt: new Date().toISOString(),
      data,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error(
      "Failed to save draft:",
      error
    );
  }
}

/**
 * Load draft safely
 */
export function loadDraft<T>():
  | SavedDraft<T>
  | null {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return null;
    }

    if (
      parsed.version !== CURRENT_VERSION
    ) {
      console.warn(
        "Draft version mismatch"
      );

      return null;
    }

    return parsed;
  } catch (error) {
    console.error(
      "Failed to load draft:",
      error
    );

    return null;
  }
}

/**
 * Remove saved draft
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(
      STORAGE_KEY
    );
  } catch (error) {
    console.error(
      "Failed to clear draft:",
      error
    );
  }
}
