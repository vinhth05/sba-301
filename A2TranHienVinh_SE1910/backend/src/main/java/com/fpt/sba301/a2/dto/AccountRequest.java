package com.fpt.sba301.a2.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AccountRequest {
    private Short accountID;

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String accountName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 70, message = "Email cannot exceed 70 characters")
    private String accountEmail;

    @NotNull(message = "Role is required (1: Admin, 2: Staff)")
    private Integer accountRole;

    @NotBlank(message = "Password is required")
    @Size(max = 70, message = "Password cannot exceed 70 characters")
    private String accountPassword;

    public AccountRequest() {
    }

    public Short getAccountID() {
        return accountID;
    }

    public void setAccountID(Short accountID) {
        this.accountID = accountID;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }
}
