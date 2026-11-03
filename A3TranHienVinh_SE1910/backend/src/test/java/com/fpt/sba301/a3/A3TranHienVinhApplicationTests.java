/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3;

import com.fpt.sba301.a3.dto.request.LoginRequest;
import com.fpt.sba301.a3.dto.response.AuthResponse;
import com.fpt.sba301.a3.security.JwtTokenProvider;
import com.fpt.sba301.a3.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class A3TranHienVinhApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void testStaffLoginFromApplicationProperties() {
        LoginRequest req = new LoginRequest("staff@fuminhotel.com", "@1");
        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertNotNull(res.getToken());
        assertEquals("STAFF", res.getRole());
        assertTrue(jwtTokenProvider.validateToken(res.getToken()));
        assertEquals("staff@fuminhotel.com", jwtTokenProvider.getUsernameFromJwt(res.getToken()));
    }
}

