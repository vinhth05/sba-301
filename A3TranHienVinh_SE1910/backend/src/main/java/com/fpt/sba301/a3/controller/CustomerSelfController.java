package com.fpt.sba301.a3.controller;

import com.fpt.sba301.a3.dto.request.ChangePasswordRequest;
import com.fpt.sba301.a3.dto.request.ProfileUpdateRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.BookingResponse;
import com.fpt.sba301.a3.dto.response.CustomerResponse;
import com.fpt.sba301.a3.service.AuthService;
import com.fpt.sba301.a3.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerSelfController {

    @Autowired
    private AuthService authService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/profile")
    public ResponseEntity<CustomerResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        CustomerResponse response = authService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<CustomerResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileUpdateRequest request) {
        CustomerResponse response = authService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        ApiResponse response = authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> bookings = bookingService.getBookingsByCustomerEmail(userDetails.getUsername());
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelMyBooking(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ApiResponse response = bookingService.cancelBooking(id, userDetails.getUsername(), false);
        return ResponseEntity.ok(response);
    }
}

