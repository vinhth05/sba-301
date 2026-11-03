/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import apiClient from './apiClient';

export const tagApi = {
  getAll: async () => {
    const res = await apiClient.get('/tags');
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/tags/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/tags', data);
    return res.data;
  },
};
