package com.fpt.sba301.a3.repository;

import com.fpt.sba301.a3.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {

    List<BookingReservation> findByCustomerIDOrderByBookingDateDesc(Integer customerID);

    List<BookingReservation> findAllByOrderByBookingDateDesc();

    boolean existsByCustomerID(Integer customerID);

    @Query("SELECT b FROM BookingReservation b WHERE " +
           "(:customerID IS NULL OR b.customerID = :customerID) AND " +
           "(:status IS NULL OR b.bookingStatus = :status) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(b.customer.customerFullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.customer.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "CAST(b.bookingReservationID AS string) LIKE CONCAT('%', :keyword, '%')) " +
           "ORDER BY b.bookingDate DESC")
    List<BookingReservation> searchBookings(@Param("keyword") String keyword,
                                           @Param("customerID") Integer customerID,
                                           @Param("status") Integer status);
}

