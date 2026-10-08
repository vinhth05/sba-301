import { http } from "./httpClient";

export const getOrchids = () => http.get("/orchids");
export const getOrchid = id => http.get(`/orchids/${id}`);
export const createOrchid = body => http.post("/orchids", body);
export const updateOrchid = (id, body) => http.put(`/orchids/${id}`, body);
export const deleteOrchid = id => http.delete(`/orchids/${id}`);
