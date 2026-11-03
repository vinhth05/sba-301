/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import apiClient from './apiClient';

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
};
