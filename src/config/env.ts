const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error(
    'VITE_API_BASE_URL is not set. Copy .env.example to .env and configure the API base URL.',
  );
}

export const env = {
  apiBaseUrl: baseUrl.replace(/\/$/, ''),
} as const;
