const API_BASE_URL = 'http://localhost:5000/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<{ data: T }> => {
  const token = localStorage.getItem('pm_token');
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new Error('TaskFlow backend is unavailable. Start the backend and make sure MongoDB is connected.');
  }

  const payload = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }
  return { data: payload };
};

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('pm_token', token);
    return;
  }
  localStorage.removeItem('pm_token');
};
