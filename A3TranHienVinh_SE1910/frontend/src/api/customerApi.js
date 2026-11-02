import axiosClient from './axiosClient';

export const customerApi = {
  getAllCustomers: () => axiosClient.get('/customers'),
  searchCustomers: (keyword) => axiosClient.get('/customers/search', { params: { keyword } }),
  getCustomerById: (id) => axiosClient.get(`/customers/${id}`),
  createCustomer: (data) => axiosClient.post('/customers', data),
  updateCustomer: (id, data) => axiosClient.put(`/customers/${id}`, data),
  deleteCustomer: (id) => axiosClient.delete(`/customers/${id}`),
};

