const rawApiUrl =
  import.meta.env.VITE_API_URL?.trim();

function getNormalizedBaseUrl(url: string | undefined): string {
  if (!url) return '';
  const cleaned = url.trim();
  if (
    cleaned === '' ||
    cleaned === 'undefined' ||
    cleaned === 'null' ||
    cleaned === 'false' ||
    cleaned === 'placeholder' ||
    cleaned.includes('localhost') ||
    cleaned.includes('127.0.0.1')
  ) {
    return '';
  }
  return cleaned;
}

export const API_CONFIG = {
  baseUrl: getNormalizedBaseUrl(rawApiUrl),
  timeout: 30000,
  retries: 2,
};

export function buildApiUrl(
  endpoint: string
): string {
  const normalizedEndpoint =
    endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;

  return `${API_CONFIG.baseUrl}${normalizedEndpoint}`;
}

export function validateApiConfig() {
  if (
    import.meta.env.PROD &&
    !API_CONFIG.baseUrl
  ) {
    console.warn(
      'VITE_API_URL not configured. Using relative API paths.'
    );
  }
}
