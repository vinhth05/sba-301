package com.fpt.sba301.security.dto;

public record OrchidResponse(
    Long orchidID,
    String orchidName,
    Boolean isNatural,
    String orchidDescription,
    Boolean isAttractive,
    String orchidURL
) {}
