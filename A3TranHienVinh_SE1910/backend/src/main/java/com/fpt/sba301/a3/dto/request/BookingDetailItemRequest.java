/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingDetailItemRequest {

    @NotNull(message = "Room ID is required")
    private Integer roomID;

    @NotNull(message = "Start date (check-in) is required")
    private LocalDate startDate;

    @NotNull(message = "End date (check-out) is required")
    private LocalDate endDate;

    // Optional override price. If null, server takes room's standard price per day * days
    private BigDecimal actualPrice;

    public BookingDetailItemRequest() {
    }

    public BookingDetailItemRequest(Integer roomID, LocalDate startDate, LocalDate endDate, BigDecimal actualPrice) {
        this.roomID = roomID;
        this.startDate = startDate;
        this.endDate = endDate;
        this.actualPrice = actualPrice;
    }

    public Integer getRoomID() {
        return roomID;
    }

    public void setRoomID(Integer roomID) {
        this.roomID = roomID;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getActualPrice() {
        return actualPrice;
    }

    public void setActualPrice(BigDecimal actualPrice) {
        this.actualPrice = actualPrice;
    }
}

