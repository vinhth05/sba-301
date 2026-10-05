package com.example.employeemanagement.exceptions;

public record ApiError(
    int status,
    String error,
    String message
) { }
