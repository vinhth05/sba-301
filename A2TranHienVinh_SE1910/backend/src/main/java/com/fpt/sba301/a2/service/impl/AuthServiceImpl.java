package com.fpt.sba301.a2.service.impl;

import com.fpt.sba301.a2.dto.LoginRequest;
import com.fpt.sba301.a2.dto.LoginResponse;
import com.fpt.sba301.a2.entity.SystemAccount;
import com.fpt.sba301.a2.exception.ResourceNotFoundException;
import com.fpt.sba301.a2.repository.SystemAccountRepository;
import com.fpt.sba301.a2.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final SystemAccountRepository accountRepository;

    public AuthServiceImpl(SystemAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        SystemAccount account = accountRepository.findByAccountEmail(request.getEmail().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Account with email '" + request.getEmail() + "' not found"));

        if (!account.getAccountPassword().equals(request.getPassword().trim())) {
            throw new ResourceNotFoundException("Invalid password");
        }

        return new LoginResponse(
                account.getAccountID(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole(),
                "Login successful"
        );
    }
}
