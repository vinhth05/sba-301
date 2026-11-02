package com.fpt.sba301.a3.dto.response;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private String role; // "STAFF" or "CUSTOMER"
    private Integer customerId; // null if staff
    private String email;
    private String fullName;
    private String telephone;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role, Integer customerId, String email, String fullName, String telephone) {
        this.token = token;
        this.role = role;
        this.customerId = customerId;
        this.email = email;
        this.fullName = fullName;
        this.telephone = telephone;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}

