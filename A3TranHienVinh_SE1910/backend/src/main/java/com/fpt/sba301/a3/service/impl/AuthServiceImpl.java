/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.service.impl;

import com.fpt.sba301.a3.config.StaffProperties;
import com.fpt.sba301.a3.dto.request.ChangePasswordRequest;
import com.fpt.sba301.a3.dto.request.LoginRequest;
import com.fpt.sba301.a3.dto.request.ProfileUpdateRequest;
import com.fpt.sba301.a3.dto.request.RegisterRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.AuthResponse;
import com.fpt.sba301.a3.dto.response.CustomerResponse;
import com.fpt.sba301.a3.entity.Customer;
import com.fpt.sba301.a3.exception.BadRequestException;
import com.fpt.sba301.a3.exception.ResourceNotFoundException;
import com.fpt.sba301.a3.repository.BookingReservationRepository;
import com.fpt.sba301.a3.repository.CustomerRepository;
import com.fpt.sba301.a3.security.JwtTokenProvider;
import com.fpt.sba301.a3.security.UserPrincipal;
import com.fpt.sba301.a3.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private StaffProperties staffProperties;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingReservationRepository bookingReservationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim();
        String rawPassword = request.getPassword().trim();

        // 1. Check if login matches Staff configured in application.properties
        if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email)) {
            String staffPass = staffProperties.getPassword();
            boolean match = staffPass.equals(rawPassword) || passwordEncoder.matches(rawPassword, staffPass);
            if (!match) {
                throw new BadCredentialsException("Invalid staff password");
            }
            UserPrincipal staffPrincipal = UserPrincipal.createStaff(
                    staffProperties.getEmail(),
                    passwordEncoder.encode(staffPass),
                    staffProperties.getFullName()
            );
            String token = jwtTokenProvider.generateToken(staffPrincipal);
            return new AuthResponse(token, "STAFF", 0, staffProperties.getEmail(), staffProperties.getFullName(), staffProperties.getTelephone());
        }

        // 2. Check Customer in Database
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new BadCredentialsException("Email not registered in the system"));

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new BadRequestException("Your customer account is currently deactivated. Please contact support.");
        }

        boolean passMatches = false;
        if (customer.getPassword().startsWith("$2a$") || customer.getPassword().startsWith("$2b$")) {
            passMatches = passwordEncoder.matches(rawPassword, customer.getPassword());
        } else {
            passMatches = customer.getPassword().equals(rawPassword);
        }

        if (!passMatches) {
            throw new BadCredentialsException("Incorrect customer password");
        }

        UserPrincipal customerPrincipal = UserPrincipal.createCustomer(
                customer.getCustomerID(),
                customer.getEmailAddress(),
                customer.getPassword(),
                customer.getCustomerFullName(),
                true
        );
        String token = jwtTokenProvider.generateToken(customerPrincipal);

        return new AuthResponse(
                token,
                "CUSTOMER",
                customer.getCustomerID(),
                customer.getEmailAddress(),
                customer.getCustomerFullName(),
                customer.getTelephone()
        );
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmailAddress().trim();

        if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email)) {
            throw new BadRequestException("This email is reserved for staff management.");
        }

        if (customerRepository.existsByEmailAddress(email)) {
            throw new BadRequestException("Email is already registered. Please choose another one.");
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setEmailAddress(email);
        customer.setTelephone(request.getTelephone() != null ? request.getTelephone().trim() : null);
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus(1);
        customer.setPassword(passwordEncoder.encode(request.getPassword().trim()));

        customer = customerRepository.save(customer);

        UserPrincipal principal = UserPrincipal.createCustomer(
                customer.getCustomerID(),
                customer.getEmailAddress(),
                customer.getPassword(),
                customer.getCustomerFullName(),
                true
        );
        String token = jwtTokenProvider.generateToken(principal);

        return new AuthResponse(
                token,
                "CUSTOMER",
                customer.getCustomerID(),
                customer.getEmailAddress(),
                customer.getCustomerFullName(),
                customer.getTelephone()
        );
    }

    @Override
    public CustomerResponse getProfile(String email) {
        if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email.trim())) {
            CustomerResponse staffRes = new CustomerResponse();
            staffRes.setCustomerID(0);
            staffRes.setCustomerFullName(staffProperties.getFullName());
            staffRes.setEmailAddress(staffProperties.getEmail());
            staffRes.setTelephone(staffProperties.getTelephone());
            staffRes.setCustomerStatus(1);
            return staffRes;
        }

        Customer customer = customerRepository.findByEmailAddress(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));

        CustomerResponse response = new CustomerResponse();
        response.setCustomerID(customer.getCustomerID());
        response.setCustomerFullName(customer.getCustomerFullName());
        response.setEmailAddress(customer.getEmailAddress());
        response.setTelephone(customer.getTelephone());
        response.setCustomerBirthday(customer.getCustomerBirthday());
        response.setCustomerStatus(customer.getCustomerStatus());
        response.setTotalBookings(bookingReservationRepository.findByCustomerIDOrderByBookingDateDesc(customer.getCustomerID()).size());
        return response;
    }

    @Override
    @Transactional
    public CustomerResponse updateProfile(String email, ProfileUpdateRequest request) {
        Customer customer = customerRepository.findByEmailAddress(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));

        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone() != null ? request.getTelephone().trim() : null);
        customer.setCustomerBirthday(request.getCustomerBirthday());

        customer = customerRepository.save(customer);

        CustomerResponse response = new CustomerResponse();
        response.setCustomerID(customer.getCustomerID());
        response.setCustomerFullName(customer.getCustomerFullName());
        response.setEmailAddress(customer.getEmailAddress());
        response.setTelephone(customer.getTelephone());
        response.setCustomerBirthday(customer.getCustomerBirthday());
        response.setCustomerStatus(customer.getCustomerStatus());
        return response;
    }

    @Override
    @Transactional
    public ApiResponse changePassword(String email, ChangePasswordRequest request) {
        Customer customer = customerRepository.findByEmailAddress(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));

        boolean oldMatches = false;
        if (customer.getPassword().startsWith("$2a$") || customer.getPassword().startsWith("$2b$")) {
            oldMatches = passwordEncoder.matches(request.getOldPassword(), customer.getPassword());
        } else {
            oldMatches = customer.getPassword().equals(request.getOldPassword());
        }

        if (!oldMatches) {
            throw new BadRequestException("Current password does not match.");
        }

        customer.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        customerRepository.save(customer);

        return ApiResponse.success("Password changed successfully.");
    }
}

