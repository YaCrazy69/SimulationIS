import api from "./axios";
import type { Reservoir, ReservoirCreate } from "@/types";

export const reservoirApi = {
  create: (data: ReservoirCreate) =>
    api.post<Reservoir>("/Reservoir_create/Create_reservoir", data),

  getAll: () => api.get<Reservoir[]>("/Reservoir_create/all"),

  getById: (id: number) => api.get<Reservoir>(`/Reservoir_create/${id}`),

  update: (id: number, data: ReservoirCreate) =>
    api.put<Reservoir>(`/Reservoir_create/update/${id}`, data),

  remove: (id: number) => api.delete(`/Reservoir_create/delete/${id}`),
};
