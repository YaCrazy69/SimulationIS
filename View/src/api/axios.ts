import axios, { AxiosError } from "axios";

export const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Instance Axios unique de l'application.
 * Le header "Authorization: Bearer <id_User>" est injecté automatiquement
 * pour chaque requête si un id_User est présent dans localStorage.
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const idUser = localStorage.getItem("id_User");
  if (idUser) {
    (config.headers as any) = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${idUser}`;
  }
  return config;
});

/** Extrait un message d'erreur lisible depuis une erreur Axios. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    if (!err.response) {
      return "Impossible de contacter le serveur. Vérifiez que le backend est démarré.";
    }
    const data = err.response.data;
    if (typeof data === "string") return data;
    if (data?.detail) {
      if (typeof data.detail === "string") return data.detail;
      try {
        return JSON.stringify(data.detail);
      } catch {
        return "Erreur API";
      }
    }
    if (data?.message) return data.message;
    return `Erreur ${err.response.status}`;
  }
  if (error instanceof Error) return error.message;
  return "Une erreur inattendue est survenue.";
}

export default api;
