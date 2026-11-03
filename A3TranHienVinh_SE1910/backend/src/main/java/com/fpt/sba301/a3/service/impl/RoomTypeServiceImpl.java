/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.service.impl;

import com.fpt.sba301.a3.dto.response.RoomTypeResponse;
import com.fpt.sba301.a3.entity.RoomType;
import com.fpt.sba301.a3.exception.ResourceNotFoundException;
import com.fpt.sba301.a3.repository.RoomTypeRepository;
import com.fpt.sba301.a3.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Override
    public List<RoomTypeResponse> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomTypeResponse getRoomTypeById(Integer id) {
        RoomType rt = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));
        return mapToResponse(rt);
    }

    private RoomTypeResponse mapToResponse(RoomType rt) {
        return new RoomTypeResponse(
                rt.getRoomTypeID(),
                rt.getRoomTypeName(),
                rt.getTypeDescription(),
                rt.getTypeNote()
        );
    }
}

