import apiClient from './apiClient';

export const accountApi = {
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const res = await apiClient.get('/accounts', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/accounts/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/accounts', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/accounts/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/accounts/${id}`);
    return res.data;
  },
};
