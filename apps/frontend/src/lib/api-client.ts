
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ============================================
// Client HTTP
// ============================================

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include", // Envoyer les cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error?.message || "Une erreur est survenue",
      data.error?.code || "UNKNOWN_ERROR",
      response.status
    );
  }

  return data;
}

// ============================================
// Erreur personnalisée
// ============================================

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}