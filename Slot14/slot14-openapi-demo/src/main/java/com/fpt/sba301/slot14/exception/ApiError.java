package com.fpt.sba301.slot14.exception;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard API error response representation")
public record ApiError(
    @Schema(description = "HTTP status code", example = "404")
    int status,

    @Schema(description = "Error reason phrase", example = "Not Found")
    String error,

    @Schema(description = "Detailed error explanation", example = "News not found with id = 999")
    String message,

    @Schema(description = "Request URI path", example = "/api/news/999")
    String path
) { }
