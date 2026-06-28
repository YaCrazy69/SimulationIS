import api from "./axios";
import type { PointSim, ResultatSim } from "@/types";

export const resultatApi = {
  // GET /simulation/{simulationId}/points → list[PointSimResponse]
  getPoints: (simulationId: number) =>
    api.get<PointSim[]>(`/simulation/${simulationId}/points`),

  // GET /simulation/{simulationId}/resultat → ResultatSimResponse
  getResultat: (simulationId: number) =>
    api.get<ResultatSim>(`/simulation/${simulationId}/resultat`),
};
