import axiosClient from './axiosClient';

export const roomApi = {
  // Public
  getPublicRooms: () => axiosClient.get('/rooms/public'),
  searchPublicRooms: (keyword, roomTypeID) =>
    axiosClient.get('/rooms/public/search', { params: { keyword, roomTypeID } }),
  getPublicRoomById: (id) => axiosClient.get(`/rooms/public/${id}`),
  getPublicRoomTypes: () => axiosClient.get('/room-types/public'),

  // Staff
  getAllRooms: () => axiosClient.get('/rooms'),
  searchRooms: (keyword, roomTypeID, status) =>
    axiosClient.get('/rooms/search', { params: { keyword, roomTypeID, status } }),
  getRoomById: (id) => axiosClient.get(`/rooms/${id}`),
  createRoom: (data) => axiosClient.post('/rooms', data),
  updateRoom: (id, data) => axiosClient.put(`/rooms/${id}`, data),
  deleteRoom: (id) => axiosClient.delete(`/rooms/${id}`),
};

