export const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Error en la petición: ${response.status}`
    );
  }

  // Para respuestas 204 (No Content, como DELETE) no hay body que parsear.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}