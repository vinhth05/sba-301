/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class CustomerRequest {

    @NotBlank(message = "Customer full name is required")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String customerFullName;

    @Size(max = 20, message = "Telephone cannot exceed 20 characters")
    private String telephone;

    @NotBlank(message = "Email address is required")
    @Email(message = "Invalid email address format")
    @Size(max = 100, message = "Email address cannot exceed 100 characters")
    private String emailAddress;

    private LocalDate customerBirthday;

    @NotNull(message = "Customer status is required (1: Active, 0: Inactive)")
    private Integer customerStatus;

    // Optional for update, required for create if provided
    private String password;

    public CustomerRequest() {
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public Integer getCustomerStatus() {
        return customerStatus;
    }

    public void setCustomerStatus(Integer customerStatus) {
        this.customerStatus = customerStatus;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

