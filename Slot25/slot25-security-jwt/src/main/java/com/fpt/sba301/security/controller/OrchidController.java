package com.fpt.sba301.security.controller;

import com.fpt.sba301.security.dto.OrchidRequest;
import com.fpt.sba301.security.dto.OrchidResponse;
import com.fpt.sba301.security.service.OrchidService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orchids")
public class OrchidController {

    private final OrchidService orchidService;

    public OrchidController(OrchidService orchidService) {
        this.orchidService = orchidService;
    }

    @GetMapping
    public ResponseEntity<List<OrchidResponse>> getAllOrchids() {
        return ResponseEntity.ok(orchidService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrchidResponse> getOrchidById(@PathVariable Long id) {
        return ResponseEntity.ok(orchidService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrchidResponse> createOrchid(@Valid @RequestBody OrchidRequest request) {
        OrchidResponse created = orchidService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrchidResponse> updateOrchid(@PathVariable Long id, @Valid @RequestBody OrchidRequest request) {
        return ResponseEntity.ok(orchidService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrchid(@PathVariable Long id) {
        orchidService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
