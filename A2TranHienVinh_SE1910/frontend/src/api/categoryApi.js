/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import apiClient from './apiClient';

export const categoryApi = {
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const res = await apiClient.get('/categories', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/categories/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/categories', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  },
};
