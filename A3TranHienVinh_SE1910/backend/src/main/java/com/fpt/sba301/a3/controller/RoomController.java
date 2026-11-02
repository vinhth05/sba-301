package com.fpt.sba301.a3.controller;

import com.fpt.sba301.a3.dto.request.RoomRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.RoomResponse;
import com.fpt.sba301.a3.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@PreAuthorize("hasRole('STAFF')")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRoomsForStaff());
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomResponse>> searchRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer roomTypeID,
            @RequestParam(required = false) Integer status) {
        return ResponseEntity.ok(roomService.searchRoomsForStaff(keyword, roomTypeID, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Integer id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        RoomResponse response = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable Integer id,
            @Valid @RequestBody RoomRequest request) {
        RoomResponse response = roomService.updateRoom(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteRoom(@PathVariable Integer id) {
        ApiResponse response = roomService.deleteRoom(id);
        return ResponseEntity.ok(response);
    }
}

