import api from "./axiosClient";

export const getAllOrchids = () => api.get("/");
export const getOrchidById = (id) => api.get(`/${id}`);
export const createOrchid = (payload) => api.post("/", payload);
export const updateOrchid = (id, payload) => api.put(`/${id}`, payload);
export const deleteOrchid = (id) => api.delete(`/${id}`);
