package com.fpt.sba301.a2.dto;

public class AccountResponse {
    private Short accountID;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;
    private String roleName;
    private boolean canDelete;

    public AccountResponse() {
    }

    public AccountResponse(Short accountID, String accountName, String accountEmail, Integer accountRole, String roleName, boolean canDelete) {
        this.accountID = accountID;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
        this.roleName = roleName;
        this.canDelete = canDelete;
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

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public boolean isCanDelete() {
        return canDelete;
    }

    public void setCanDelete(boolean canDelete) {
        this.canDelete = canDelete;
    }
}
