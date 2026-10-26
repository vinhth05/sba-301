package com.fpt.sba301.a2.service;

import com.fpt.sba301.a2.dto.LoginRequest;
import com.fpt.sba301.a2.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
