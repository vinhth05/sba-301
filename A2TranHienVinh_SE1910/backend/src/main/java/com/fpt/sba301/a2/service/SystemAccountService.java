/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a2.service;

import com.fpt.sba301.a2.dto.AccountRequest;
import com.fpt.sba301.a2.dto.AccountResponse;

import java.util.List;

public interface SystemAccountService {
    List<AccountResponse> getAllAccounts();
    List<AccountResponse> searchAccounts(String query);
    AccountResponse getAccountById(Short id);
    AccountResponse createAccount(AccountRequest request);
    AccountResponse updateAccount(Short id, AccountRequest request);
    void deleteAccount(Short id);
}
