import apiClient from './apiClient';

export const newsApi = {
  getActive: async () => {
    const res = await apiClient.get('/news-articles/public/active');
    return res.data;
  },
  search: async ({ keyword = '', categoryId = null, status = null } = {}) => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (categoryId) params.categoryId = categoryId;
    if (status !== null && status !== '') params.status = status;
    const res = await apiClient.get('/news-articles', { params });
    return res.data;
  },
  getByStaffHistory: async (staffId) => {
    const res = await apiClient.get(`/news-articles/staff/${staffId}/history`);
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/news-articles/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/news-articles', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/news-articles/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/news-articles/${id}`);
    return res.data;
  },
};
