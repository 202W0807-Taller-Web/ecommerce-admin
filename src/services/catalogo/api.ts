const API_CATALOGO_URL =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_CATALOGO_URL
    : process.env.VITE_API_CATALOGO_URL; 

export async function fetchUrl<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_CATALOGO_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Error ${res.status}: ${message}`);
  }

  return (await res.json()) as T;
}