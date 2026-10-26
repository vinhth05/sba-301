package com.fpt.sba301.a2.dto;

public class LoginResponse {
    private Short accountID;
    private String accountName;
    private String accountEmail;
    private Integer accountRole; // 1 = Admin, 2 = Staff
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(Short accountID, String accountName, String accountEmail, Integer accountRole, String message) {
        this.accountID = accountID;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
        this.message = message;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
