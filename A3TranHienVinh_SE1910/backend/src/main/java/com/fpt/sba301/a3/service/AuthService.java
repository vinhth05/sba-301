/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.service;

import com.fpt.sba301.a3.dto.request.ChangePasswordRequest;
import com.fpt.sba301.a3.dto.request.LoginRequest;
import com.fpt.sba301.a3.dto.request.ProfileUpdateRequest;
import com.fpt.sba301.a3.dto.request.RegisterRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.AuthResponse;
import com.fpt.sba301.a3.dto.response.CustomerResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    CustomerResponse getProfile(String email);

    CustomerResponse updateProfile(String email, ProfileUpdateRequest request);

    ApiResponse changePassword(String email, ChangePasswordRequest request);
}

