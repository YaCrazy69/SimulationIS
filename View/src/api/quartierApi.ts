import api from "./axios";
import type { Quartier, QuartierCreate } from "@/types";

export const quartierApi = {
  create: (data: QuartierCreate) =>
    api.post<Quartier>("/quartier/Create_Quartier", data),

  getAll: () => api.get<Quartier[]>("/quartier/all"),

  getById: (id: number) => api.get<Quartier>(`/quartier/${id}`),

  update: (id: number, data: QuartierCreate) =>
    api.put<Quartier>(`/quartier/update/${id}`, data),

  remove: (id: number) => api.delete(`/quartier/delete/${id}`),
};
