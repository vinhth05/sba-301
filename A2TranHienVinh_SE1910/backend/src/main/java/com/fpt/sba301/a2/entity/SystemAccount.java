package com.fpt.sba301.a2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "SystemAccount")
public class SystemAccount {

    @Id
    @Column(name = "AccountID")
    private Short accountID;

    @Column(name = "AccountName", length = 100)
    private String accountName;

    @Column(name = "AccountEmail", length = 70, unique = true)
    private String accountEmail;

    @Column(name = "AccountRole")
    private Integer accountRole; // 1 = Admin, 2 = Staff

    @Column(name = "AccountPassword", length = 70)
    private String accountPassword;

    public SystemAccount() {
    }

    public SystemAccount(Short accountID, String accountName, String accountEmail, Integer accountRole, String accountPassword) {
        this.accountID = accountID;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
        this.accountPassword = accountPassword;
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
