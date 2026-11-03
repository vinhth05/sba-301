/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.repository;

import com.fpt.sba301.a3.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {

    Optional<RoomInformation> findByRoomNumber(String roomNumber);

    boolean existsByRoomNumber(String roomNumber);

    boolean existsByRoomNumberAndRoomIDNot(String roomNumber, Integer roomID);

    List<RoomInformation> findByRoomStatus(Integer roomStatus);

    @Query("SELECT r FROM RoomInformation r WHERE " +
           "(:status IS NULL OR r.roomStatus = :status) AND " +
           "(:roomTypeID IS NULL OR r.roomTypeID = :roomTypeID) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.roomDetailDescription) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.roomType.roomTypeName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<RoomInformation> searchRooms(@Param("keyword") String keyword,
                                      @Param("roomTypeID") Integer roomTypeID,
                                      @Param("status") Integer status);
}

