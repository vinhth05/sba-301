package com.fpt.sba301.a2.controller;

import com.fpt.sba301.a2.dto.AccountRequest;
import com.fpt.sba301.a2.dto.AccountResponse;
import com.fpt.sba301.a2.service.SystemAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class SystemAccountController {

    private final SystemAccountService accountService;

    public SystemAccountController(SystemAccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts(
            @RequestParam(value = "search", required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(accountService.searchAccounts(search));
        }
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable("id") Short id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody AccountRequest request) {
        AccountResponse created = accountService.createAccount(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponse> updateAccount(
            @PathVariable("id") Short id,
            @Valid @RequestBody AccountRequest request) {
        AccountResponse updated = accountService.updateAccount(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable("id") Short id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
