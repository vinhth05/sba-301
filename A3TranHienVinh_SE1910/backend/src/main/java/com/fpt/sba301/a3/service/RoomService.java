/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.service;

import com.fpt.sba301.a3.dto.request.RoomRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.RoomResponse;

import java.util.List;

public interface RoomService {

    List<RoomResponse> getPublicActiveRooms();

    List<RoomResponse> searchPublicRooms(String keyword, Integer roomTypeID);

    List<RoomResponse> getAllRoomsForStaff();

    List<RoomResponse> searchRoomsForStaff(String keyword, Integer roomTypeID, Integer status);

    RoomResponse getRoomById(Integer id);

    RoomResponse createRoom(RoomRequest request);

    RoomResponse updateRoom(Integer id, RoomRequest request);

    ApiResponse deleteRoom(Integer id);
}

