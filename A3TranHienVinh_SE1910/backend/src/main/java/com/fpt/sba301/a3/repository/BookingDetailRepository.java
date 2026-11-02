package com.fpt.sba301.a3.repository;

import com.fpt.sba301.a3.entity.BookingDetail;
import com.fpt.sba301.a3.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {

    boolean existsById_RoomID(Integer roomID);

    List<BookingDetail> findById_BookingReservationID(Integer bookingReservationID);

    List<BookingDetail> findById_RoomID(Integer roomID);
}

