package com.fpt.sba301.security.controller;

import com.fpt.sba301.security.repository.AppUserRepository;
import com.fpt.sba301.security.repository.OrchidRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AppUserRepository userRepository;
    private final OrchidRepository orchidRepository;

    public AdminController(AppUserRepository userRepository, OrchidRepository orchidRepository) {
        this.userRepository = userRepository;
        this.orchidRepository = orchidRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "status", "ACTIVE",
                "caller", authentication.getName(),
                "totalUsers", userRepository.count(),
                "totalOrchids", orchidRepository.count(),
                "timestamp", Instant.now().toString(),
                "message", "Welcome to Admin Security Control Dashboard"
        ));
    }
}
