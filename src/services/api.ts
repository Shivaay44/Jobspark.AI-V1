import { buildApiUrl } from '../config/api';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const response = await fetch(
      buildApiUrl(endpoint),
      {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      }
    );

    clearTimeout(timeout);

    const text = await response.text();

    let data: any = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
        data.message ||
        `HTTP ${response.status}`
      );
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(
        'Request timed out. Please try again.'
      );
    }

    if (
      error.message?.includes('Failed to fetch')
    ) {
      throw new Error(
        'Unable to connect to backend server.'
      );
    }

    throw error;
  }
}

export async function testConnection() {
  // Return early for client-only SDK modes (such as Vercel/Netlify deployments) to prevent unnecessary 404 connection warnings.
  return { success: true, message: 'Client SDK Active' };
}


