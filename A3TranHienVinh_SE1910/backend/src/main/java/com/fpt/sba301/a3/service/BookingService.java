/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.service;

import com.fpt.sba301.a3.dto.request.BookingCreateRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingCreateRequest request, String userEmail, boolean isStaff);

    List<BookingResponse> getAllBookings();

    List<BookingResponse> searchBookings(String keyword, Integer customerID, Integer status);

    List<BookingResponse> getBookingsByCustomerEmail(String email);

    BookingResponse getBookingById(Integer bookingId, String userEmail, boolean isStaff);

    BookingResponse updateBookingStatus(Integer bookingId, Integer status);

    ApiResponse cancelBooking(Integer bookingId, String userEmail, boolean isStaff);

    ApiResponse deleteBooking(Integer bookingId);
}

