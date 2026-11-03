/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.security;

import com.fpt.sba301.a3.config.StaffProperties;
import com.fpt.sba301.a3.entity.Customer;
import com.fpt.sba301.a3.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private StaffProperties staffProperties;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check Staff account from application.properties
        if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email.trim())) {
            String staffPassword = staffProperties.getPassword();
            // Encode staff password with BCrypt for AuthenticationManager comparison if not already encoded
            String encodedStaffPass = staffPassword.startsWith("$2a$") ? staffPassword : passwordEncoder.encode(staffPassword);
            return UserPrincipal.createStaff(staffProperties.getEmail(), encodedStaffPass, staffProperties.getFullName());
        }

        // 2. Check Customer from database
        Customer customer = customerRepository.findByEmailAddress(email.trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        boolean isActive = customer.getCustomerStatus() != null && customer.getCustomerStatus() == 1;
        String customerPassword = customer.getPassword();
        // If password in DB is plain text, encode it on the fly so BCrypt can match
        if (customerPassword != null && !customerPassword.startsWith("$2a$") && !customerPassword.startsWith("$2b$")) {
            customerPassword = passwordEncoder.encode(customerPassword);
        }

        return UserPrincipal.createCustomer(
                customer.getCustomerID(),
                customer.getEmailAddress(),
                customerPassword,
                customer.getCustomerFullName(),
                isActive
        );
    }
}

