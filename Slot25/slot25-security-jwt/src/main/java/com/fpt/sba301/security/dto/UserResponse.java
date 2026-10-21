package com.fpt.sba301.security.dto;

public record UserResponse(
    Long id,
    String email,
    String role
) {}
