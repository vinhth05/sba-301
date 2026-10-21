package com.fpt.sba301.security.dto;

public record AuthResponse(
    String accessToken,
    String tokenType,
    long expiresIn
) {}
