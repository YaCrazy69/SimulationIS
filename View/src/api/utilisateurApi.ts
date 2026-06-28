import api from "./axios";
import type { Utilisateur, UtilisateurCreate, UtilisateurUpdate } from "@/types";

export const utilisateurApi = {
  // POST /utilisateur/Create_User → { "Nom_User": "..." } (pas d'id_User dans la réponse)
  create: (data: UtilisateurCreate) =>
    api.post<{ Nom_User: string }>("/utilisateur/Create_User", data),

  getAll: () => api.get<Utilisateur[]>("/utilisateur/all"),

  getById: (id: number) => api.get<Utilisateur>(`/utilisateur/${id}`),

  // PUT attend les 3 champs obligatoires (Nom_User, email, mot_de_passe)
  update: (id: number, data: UtilisateurUpdate) =>
    api.put<Utilisateur>(`/utilisateur/update/${id}`, data),

  remove: (id: number) => api.delete(`/utilisateur/delete/${id}`),
};
