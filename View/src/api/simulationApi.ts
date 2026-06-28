import api from "./axios";
import type {
  SimulationCreate,
  SimulationCreateResponse,
  SimulationLaunchResponse,
} from "@/types";

export const simulationApi = {
  /**
   * POST /simulation/Create_Sim
   * Authorization: Bearer <id_User> est ajouté automatiquement par l'intercepteur axios.
   * Renvoie {"message": "...", "id_sim": int} — PAS un objet Simulation complet.
   */
  create: (data: SimulationCreate) =>
    api.post<SimulationCreateResponse>("/simulation/Create_Sim", data),

  /**
   * POST /simulation/launch/{simulation_id}
   * Lance le calcul Runge-Kutta et génère les PointSim.
   */
  launch: (simulationId: number) =>
    api.post<SimulationLaunchResponse>(`/simulation/launch/${simulationId}`),
};
