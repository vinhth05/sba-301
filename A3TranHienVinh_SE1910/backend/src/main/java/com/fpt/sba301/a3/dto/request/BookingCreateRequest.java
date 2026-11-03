/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class BookingCreateRequest {

    // CustomerID can be null if customer is booking for themselves (extracted from JWT token)
    // or passed by Staff booking for a customer
    private Integer customerID;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate = LocalDate.now();

    @NotEmpty(message = "At least one room must be selected for booking")
    @Valid
    private List<BookingDetailItemRequest> bookingDetails;

    public BookingCreateRequest() {
    }

    public Integer getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Integer customerID) {
        this.customerID = customerID;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public List<BookingDetailItemRequest> getBookingDetails() {
        return bookingDetails;
    }

    public void setBookingDetails(List<BookingDetailItemRequest> bookingDetails) {
        this.bookingDetails = bookingDetails;
    }
}

