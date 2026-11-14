const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === undefined
    ? true
    : String(import.meta.env.VITE_USE_MOCK).toLowerCase() !== 'false';

export function simulateNetworkDelay(minMs = 300, maxMs = 600) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body:
      options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  });

  if (!response.ok) {
    let errorMessage = 'No pudimos cargar la información.';
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Ignorar si la respuesta de error no es JSON
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
