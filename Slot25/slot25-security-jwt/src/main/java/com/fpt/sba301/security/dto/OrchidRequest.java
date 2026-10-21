package com.fpt.sba301.security.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OrchidRequest(
    @NotBlank(message = "Orchid name is required")
    @Size(max = 150, message = "Orchid name must be at most 150 characters")
    String orchidName,

    Boolean isNatural,

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    String orchidDescription,

    Boolean isAttractive,

    @Size(max = 500, message = "URL must be at most 500 characters")
    String orchidURL
) {}
