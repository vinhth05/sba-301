/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.service.impl;

import com.fpt.sba301.a3.dto.request.BookingCreateRequest;
import com.fpt.sba301.a3.dto.request.BookingDetailItemRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.BookingDetailResponse;
import com.fpt.sba301.a3.dto.response.BookingResponse;
import com.fpt.sba301.a3.entity.BookingDetail;
import com.fpt.sba301.a3.entity.BookingDetailId;
import com.fpt.sba301.a3.entity.BookingReservation;
import com.fpt.sba301.a3.entity.Customer;
import com.fpt.sba301.a3.entity.RoomInformation;
import com.fpt.sba301.a3.exception.BadRequestException;
import com.fpt.sba301.a3.exception.ResourceNotFoundException;
import com.fpt.sba301.a3.repository.BookingDetailRepository;
import com.fpt.sba301.a3.repository.BookingReservationRepository;
import com.fpt.sba301.a3.repository.CustomerRepository;
import com.fpt.sba301.a3.repository.RoomInformationRepository;
import com.fpt.sba301.a3.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingReservationRepository reservationRepository;

    @Autowired
    private BookingDetailRepository detailRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoomInformationRepository roomRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request, String userEmail, boolean isStaff) {
        Customer customer;
        if (isStaff) {
            if (request.getCustomerID() == null) {
                throw new BadRequestException("Staff must specify Customer ID when making a reservation.");
            }
            customer = customerRepository.findById(request.getCustomerID())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerID()));
        } else {
            customer = customerRepository.findByEmailAddress(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("Logged-in customer not found: " + userEmail));
        }

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new BadRequestException("Customer account is inactive. Cannot place reservation.");
        }

        if (request.getBookingDetails() == null || request.getBookingDetails().isEmpty()) {
            throw new BadRequestException("Reservation must include at least one room.");
        }

        BookingReservation reservation = new BookingReservation();
        reservation.setBookingDate(request.getBookingDate() != null ? request.getBookingDate() : LocalDate.now());
        reservation.setCustomer(customer);
        reservation.setBookingStatus(1); // 1: Confirmed / Active
        reservation.setTotalPrice(BigDecimal.ZERO);

        // Pre-save to generate ID
        reservation = reservationRepository.save(reservation);

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<BookingDetail> details = new ArrayList<>();

        for (BookingDetailItemRequest item : request.getBookingDetails()) {
            RoomInformation room = roomRepository.findById(item.getRoomID())
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + item.getRoomID()));

            if (room.getRoomStatus() != null && room.getRoomStatus() == 0) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is currently inactive and cannot be booked.");
            }

            if (item.getEndDate().isBefore(item.getStartDate())) {
                throw new BadRequestException("Check-out date must be after check-in date for room " + room.getRoomNumber());
            }

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            if (days <= 0) {
                days = 1;
            }

            BigDecimal itemPrice = item.getActualPrice();
            if (itemPrice == null || itemPrice.compareTo(BigDecimal.ZERO) <= 0) {
                itemPrice = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
            }

            totalPrice = totalPrice.add(itemPrice);

            BookingDetail detail = new BookingDetail();
            detail.setId(new BookingDetailId(reservation.getBookingReservationID(), room.getRoomID()));
            detail.setBookingReservation(reservation);
            detail.setRoomInformation(room);
            detail.setStartDate(item.getStartDate());
            detail.setEndDate(item.getEndDate());
            detail.setActualPrice(itemPrice);

            details.add(detail);
        }

        reservation.setTotalPrice(totalPrice);
        reservation.setBookingDetails(details);
        detailRepository.saveAll(details);
        reservation = reservationRepository.save(reservation);

        return mapToResponse(reservation);
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return reservationRepository.findAllByOrderByBookingDateDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> searchBookings(String keyword, Integer customerID, Integer status) {
        return reservationRepository.searchBookings(keyword, customerID, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getBookingsByCustomerEmail(String email) {
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        return reservationRepository.findByCustomerIDOrderByBookingDateDesc(customer.getCustomerID()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Integer bookingId, String userEmail, boolean isStaff) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        if (!isStaff && (reservation.getCustomer() == null || !reservation.getCustomer().getEmailAddress().equalsIgnoreCase(userEmail))) {
            throw new AccessDeniedException("You are not authorized to view this booking reservation.");
        }

        return mapToResponse(reservation);
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Integer bookingId, Integer status) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        reservation.setBookingStatus(status);
        reservation = reservationRepository.save(reservation);
        return mapToResponse(reservation);
    }

    @Override
    @Transactional
    public ApiResponse cancelBooking(Integer bookingId, String userEmail, boolean isStaff) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        if (!isStaff && (reservation.getCustomer() == null || !reservation.getCustomer().getEmailAddress().equalsIgnoreCase(userEmail))) {
            throw new AccessDeniedException("You are not authorized to cancel this booking.");
        }

        reservation.setBookingStatus(0); // 0: Cancelled
        reservationRepository.save(reservation);
        return ApiResponse.success("Đã hủy đơn đặt phòng #" + bookingId + " thành công.");
    }

    @Override
    @Transactional
    public ApiResponse deleteBooking(Integer bookingId) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        reservationRepository.delete(reservation);
        return ApiResponse.success("Đã xóa đơn đặt phòng #" + bookingId + " thành công.");
    }

    private BookingResponse mapToResponse(BookingReservation b) {
        BookingResponse res = new BookingResponse();
        res.setBookingReservationID(b.getBookingReservationID());
        res.setBookingDate(b.getBookingDate());
        res.setTotalPrice(b.getTotalPrice());
        res.setBookingStatus(b.getBookingStatus());

        if (b.getCustomer() != null) {
            res.setCustomerID(b.getCustomer().getCustomerID());
            res.setCustomerFullName(b.getCustomer().getCustomerFullName());
            res.setCustomerEmail(b.getCustomer().getEmailAddress());
            res.setCustomerPhone(b.getCustomer().getTelephone());
        }

        List<BookingDetail> details = detailRepository.findById_BookingReservationID(b.getBookingReservationID());
        List<BookingDetailResponse> detailResponses = details.stream().map(d -> {
            BookingDetailResponse dr = new BookingDetailResponse();
            dr.setBookingReservationID(d.getId().getBookingReservationID());
            dr.setRoomID(d.getId().getRoomID());
            if (d.getRoomInformation() != null) {
                dr.setRoomNumber(d.getRoomInformation().getRoomNumber());
                if (d.getRoomInformation().getRoomType() != null) {
                    dr.setRoomTypeName(d.getRoomInformation().getRoomType().getRoomTypeName());
                }
            }
            dr.setStartDate(d.getStartDate());
            dr.setEndDate(d.getEndDate());
            dr.setActualPrice(d.getActualPrice());
            long days = ChronoUnit.DAYS.between(d.getStartDate(), d.getEndDate());
            dr.setTotalDays(days <= 0 ? 1 : days);
            return dr;
        }).collect(Collectors.toList());

        res.setBookingDetails(detailResponses);
        return res;
    }
}

