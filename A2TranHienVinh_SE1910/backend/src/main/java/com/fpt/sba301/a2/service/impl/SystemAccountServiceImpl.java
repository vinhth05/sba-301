package com.fpt.sba301.a2.service.impl;

import com.fpt.sba301.a2.dto.AccountRequest;
import com.fpt.sba301.a2.dto.AccountResponse;
import com.fpt.sba301.a2.entity.SystemAccount;
import com.fpt.sba301.a2.exception.BusinessConflictException;
import com.fpt.sba301.a2.exception.ResourceNotFoundException;
import com.fpt.sba301.a2.repository.NewsArticleRepository;
import com.fpt.sba301.a2.repository.SystemAccountRepository;
import com.fpt.sba301.a2.service.SystemAccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SystemAccountServiceImpl implements SystemAccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    public SystemAccountServiceImpl(SystemAccountRepository accountRepository, NewsArticleRepository newsArticleRepository) {
        this.accountRepository = accountRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountResponse> searchAccounts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllAccounts();
        }
        String q = query.trim();
        return accountRepository.findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(q, q).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse getAccountById(Short id) {
        SystemAccount acc = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));
        return mapToResponse(acc);
    }

    @Override
    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        if (accountRepository.existsByAccountEmail(request.getAccountEmail().trim())) {
            throw new BusinessConflictException("An account with email '" + request.getAccountEmail() + "' already exists.");
        }

        SystemAccount account = new SystemAccount();
        if (request.getAccountID() != null && request.getAccountID() > 0) {
            if (accountRepository.existsById(request.getAccountID())) {
                throw new BusinessConflictException("Account ID " + request.getAccountID() + " is already in use.");
            }
            account.setAccountID(request.getAccountID());
        } else {
            Short maxId = accountRepository.findMaxAccountId();
            account.setAccountID((short) (maxId + 1));
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountEmail(request.getAccountEmail().trim());
        account.setAccountRole(request.getAccountRole());
        account.setAccountPassword(request.getAccountPassword().trim());

        SystemAccount saved = accountRepository.save(account);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AccountResponse updateAccount(Short id, AccountRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        // Check if email changed to existing email
        if (!account.getAccountEmail().equalsIgnoreCase(request.getAccountEmail().trim())) {
            if (accountRepository.existsByAccountEmail(request.getAccountEmail().trim())) {
                throw new BusinessConflictException("An account with email '" + request.getAccountEmail() + "' already exists.");
            }
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountEmail(request.getAccountEmail().trim());
        if (request.getAccountRole() != null) {
            account.setAccountRole(request.getAccountRole());
        }
        if (request.getAccountPassword() != null && !request.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(request.getAccountPassword().trim());
        }

        SystemAccount updated = accountRepository.save(account);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteAccount(Short id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Account not found with ID: " + id);
        }

        // Business Rule: The delete action will delete an account in the case this account is not belong to any news articles (created),
        // if the account is already created any news article, cannot delete.
        if (newsArticleRepository.existsByCreatedBy_AccountID(id)) {
            throw new BusinessConflictException("Cannot delete this account because it has created one or more news articles.");
        }

        accountRepository.deleteById(id);
    }

    private AccountResponse mapToResponse(SystemAccount acc) {
        boolean hasArticles = newsArticleRepository.existsByCreatedBy_AccountID(acc.getAccountID());
        boolean canDelete = !hasArticles;
        String roleName = acc.getAccountRole() != null && acc.getAccountRole() == 1 ? "Admin" : "Staff";

        return new AccountResponse(
                acc.getAccountID(),
                acc.getAccountName(),
                acc.getAccountEmail(),
                acc.getAccountRole(),
                roleName,
                canDelete
        );
    }
}
