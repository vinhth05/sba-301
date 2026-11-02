package com.fpt.sba301.a3.service;

import com.fpt.sba301.a3.dto.response.RoomTypeResponse;
import java.util.List;

public interface RoomTypeService {

    List<RoomTypeResponse> getAllRoomTypes();

    RoomTypeResponse getRoomTypeById(Integer id);
}

