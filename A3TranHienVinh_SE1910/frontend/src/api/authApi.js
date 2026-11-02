import axiosClient from './axiosClient';

export const authApi = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),
  getProfile: () => axiosClient.get('/customer/profile'),
  updateProfile: (data) => axiosClient.put('/customer/profile', data),
  changePassword: (data) => axiosClient.put('/customer/change-password', data),
};

