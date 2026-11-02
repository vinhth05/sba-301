package com.fpt.sba301.a3.service.impl;

import com.fpt.sba301.a3.dto.request.RoomRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.RoomResponse;
import com.fpt.sba301.a3.entity.RoomInformation;
import com.fpt.sba301.a3.entity.RoomType;
import com.fpt.sba301.a3.exception.BadRequestException;
import com.fpt.sba301.a3.exception.ResourceNotFoundException;
import com.fpt.sba301.a3.repository.BookingDetailRepository;
import com.fpt.sba301.a3.repository.RoomInformationRepository;
import com.fpt.sba301.a3.repository.RoomTypeRepository;
import com.fpt.sba301.a3.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomInformationRepository roomRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Override
    public List<RoomResponse> getPublicActiveRooms() {
        return roomRepository.findByRoomStatus(1).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> searchPublicRooms(String keyword, Integer roomTypeID) {
        return roomRepository.searchRooms(keyword, roomTypeID, 1).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getAllRoomsForStaff() {
        return roomRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> searchRoomsForStaff(String keyword, Integer roomTypeID, Integer status) {
        return roomRepository.searchRooms(keyword, roomTypeID, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomById(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        return mapToResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber().trim())) {
            throw new BadRequestException("Room number '" + request.getRoomNumber().trim() + "' already exists.");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeID())
                .orElseThrow(() -> new ResourceNotFoundException("Room Type not found with ID: " + request.getRoomTypeID()));

        RoomInformation room = new RoomInformation();
        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(roomType);
        room.setRoomStatus(request.getRoomStatus() != null ? request.getRoomStatus() : 1);
        room.setRoomPricePerDay(request.getRoomPricePerDay());

        room = roomRepository.save(room);
        return mapToResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(Integer id, RoomRequest request) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        if (roomRepository.existsByRoomNumberAndRoomIDNot(request.getRoomNumber().trim(), id)) {
            throw new BadRequestException("Room number '" + request.getRoomNumber().trim() + "' is already used by another room.");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeID())
                .orElseThrow(() -> new ResourceNotFoundException("Room Type not found with ID: " + request.getRoomTypeID()));

        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(roomType);
        room.setRoomStatus(request.getRoomStatus());
        room.setRoomPricePerDay(request.getRoomPricePerDay());

        room = roomRepository.save(room);
        return mapToResponse(room);
    }

    /**
     * Requirement:
     * "The delete action will delete room information in the case this information is not belong
     * to any renting transaction. If the room information is already stored in a booking detail,
     * just change the status."
     */
    @Override
    @Transactional
    public ApiResponse deleteRoom(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        boolean isRented = bookingDetailRepository.existsById_RoomID(id);

        if (isRented) {
            // Already in a booking transaction: Soft delete by changing status to 0 (Inactive)
            room.setRoomStatus(0);
            roomRepository.save(room);
            return ApiResponse.success("Phòng đã từng có giao dịch đặt phòng, hệ thống đã tự động chuyển trạng thái phòng sang Không hoạt động (Inactive - 0) thay vì xóa vĩnh viễn.", mapToResponse(room));
        } else {
            // Not in any transaction: Hard delete
            roomRepository.delete(room);
            return ApiResponse.success("Đã xóa vĩnh viễn phòng thành công.");
        }
    }

    private RoomResponse mapToResponse(RoomInformation r) {
        RoomResponse res = new RoomResponse();
        res.setRoomID(r.getRoomID());
        res.setRoomNumber(r.getRoomNumber());
        res.setRoomDetailDescription(r.getRoomDetailDescription());
        res.setRoomMaxCapacity(r.getRoomMaxCapacity());
        res.setRoomTypeID(r.getRoomTypeID());
        if (r.getRoomType() != null) {
            res.setRoomTypeName(r.getRoomType().getRoomTypeName());
        }
        res.setRoomStatus(r.getRoomStatus());
        res.setRoomPricePerDay(r.getRoomPricePerDay());
        res.setHasBookings(bookingDetailRepository.existsById_RoomID(r.getRoomID()));
        return res;
    }
}

