package com.fpt.sba301.a3.controller;

import com.fpt.sba301.a3.dto.response.RoomResponse;
import com.fpt.sba301.a3.dto.response.RoomTypeResponse;
import com.fpt.sba301.a3.service.RoomService;
import com.fpt.sba301.a3.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicRoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping("/rooms/public")
    public ResponseEntity<List<RoomResponse>> getPublicRooms() {
        return ResponseEntity.ok(roomService.getPublicActiveRooms());
    }

    @GetMapping("/rooms/public/search")
    public ResponseEntity<List<RoomResponse>> searchPublicRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer roomTypeID) {
        return ResponseEntity.ok(roomService.searchPublicRooms(keyword, roomTypeID));
    }

    @GetMapping("/rooms/public/{id}")
    public ResponseEntity<RoomResponse> getPublicRoomById(@PathVariable Integer id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/room-types/public")
    public ResponseEntity<List<RoomTypeResponse>> getPublicRoomTypes() {
        return ResponseEntity.ok(roomTypeService.getAllRoomTypes());
    }

    @GetMapping("/room-types/public/{id}")
    public ResponseEntity<RoomTypeResponse> getPublicRoomTypeById(@PathVariable Integer id) {
        return ResponseEntity.ok(roomTypeService.getRoomTypeById(id));
    }
}

