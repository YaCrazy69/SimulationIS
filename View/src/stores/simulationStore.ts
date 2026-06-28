import { create } from "zustand";
import type { SimulationLocal } from "@/types";

/**
 * Le backend n'expose pas de route "liste des simulations" (seulement
 * Create_Sim, launch, points, resultat). Pour permettre la navigation dans
 * l'UI (Dashboard, page Simulations), on conserve localement l'historique
 * des simulations créées pendant la session. Aucune logique métier n'est
 * ajoutée ici : on stocke uniquement ce que l'API a déjà renvoyé.
 */
interface SimulationHistoryState {
  history: SimulationLocal[];
  addSimulation: (sim: SimulationLocal) => void;
}

const STORAGE_KEY = "hydraulix_simulation_history";

function loadHistory(): SimulationLocal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useSimulationHistoryStore = create<SimulationHistoryState>((set, get) => ({
  history: loadHistory(),
  addSimulation: (sim) => {
    const next = [sim, ...get().history.filter((s) => s.id_sim !== sim.id_sim)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ history: next });
  },
}));
