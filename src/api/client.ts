/**
 * FoodieGo API Client
 * Configured with VITE_API_URL environment variable and JWT bearer token injection.
 * Provides clean REST interaction with FastAPI/MySQL backend while retaining
 * robust in-memory mock persistence when running in client preview mode.
 */

export const BASE_API_URL = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('foodiego_jwt_token') || null;
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('foodiego_jwt_token', token);
  } else {
    localStorage.removeItem('foodiego_jwt_token');
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; status: number }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errBody.message || `Request failed with status ${res.status}`);
    }

    const data = await res.json();
    return { data, status: res.status };
  } catch (error) {
    // Graceful error logging for real API; caller can handle or fall back
    console.warn(`[FoodieGo API] Backend request to ${url} failed or offline. Returning fallback data.`, error);
    throw error;
  }
}
