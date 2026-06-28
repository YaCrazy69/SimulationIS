import { create } from "zustand";
import type { Utilisateur } from "@/types";

interface AuthState {
  idUser: number | null;
  utilisateur: Utilisateur | null;
  isAuthenticated: boolean;
  setSession: (idUser: number, utilisateur?: Utilisateur | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const stored = localStorage.getItem("id_User");
  const parsed = stored ? parseInt(stored, 10) : null;
  return {
    idUser: !isNaN(parsed as number) && parsed !== null ? parsed : null,
    utilisateur: null,
    isAuthenticated: parsed !== null && !isNaN(parsed as number),

    setSession: (idUser, utilisateur = null) => {
      localStorage.setItem("id_User", String(idUser));
      set({ idUser, utilisateur, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem("id_User");
      set({ idUser: null, utilisateur: null, isAuthenticated: false });
    },
  };
});
