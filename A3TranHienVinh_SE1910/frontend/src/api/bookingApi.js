/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import axiosClient from './axiosClient';

export const bookingApi = {
  createBooking: (data) => axiosClient.post('/bookings', data),
  getMyBookings: () => axiosClient.get('/customer/bookings'),
  cancelMyBooking: (id) => axiosClient.put(`/customer/bookings/${id}/cancel`),

  // Staff
  getAllBookings: () => axiosClient.get('/bookings/all'),
  searchBookings: (keyword, customerID, status) =>
    axiosClient.get('/bookings/search', { params: { keyword, customerID, status } }),
  getBookingById: (id) => axiosClient.get(`/bookings/${id}`),
  updateStatus: (id, status) => axiosClient.put(`/bookings/${id}/status`, null, { params: { status } }),
  deleteBooking: (id) => axiosClient.delete(`/bookings/${id}`),
};

