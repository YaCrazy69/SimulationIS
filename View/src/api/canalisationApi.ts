import api from "./axios";
import type { Canalisation, CanalisationCreate } from "@/types";

export const canalisationApi = {
  create: (data: CanalisationCreate) =>
    api.post<Canalisation>("/canalisation/Create_Canalisation", data),

  getAll: () => api.get<Canalisation[]>("/canalisation/all"),

  getById: (id: number) => api.get<Canalisation>(`/canalisation/${id}`),

  update: (id: number, data: CanalisationCreate) =>
    api.put<Canalisation>(`/canalisation/update/${id}`, data),

  remove: (id: number) => api.delete(`/canalisation/delete/${id}`),
};
