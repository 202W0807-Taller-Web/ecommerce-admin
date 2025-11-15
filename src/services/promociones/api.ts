const API_PROMOCIONES_URL =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_PROMOCIONES_URL
    : process.env.VITE_API_PROMOCIONES_URL;

export async function fetchUrl<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = options?.body instanceof FormData
    ? options?.headers
    : { "Content-Type": "application/json", ...options?.headers };

  const res = await fetch(`${API_PROMOCIONES_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Error ${res.status}: ${message}`);
  }

  return (await res.json()) as T;
}
