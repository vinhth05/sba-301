/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a3.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private Integer id; // null or 0 for Staff
    private String email;
    private String password;
    private String fullName;
    private String role; // "ROLE_STAFF" or "ROLE_CUSTOMER"
    private boolean active;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Integer id, String email, String password, String fullName, String role, boolean active) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.active = active;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    public static UserPrincipal createStaff(String email, String password, String fullName) {
        return new UserPrincipal(0, email, password, fullName, "ROLE_STAFF", true);
    }

    public static UserPrincipal createCustomer(Integer id, String email, String password, String fullName, boolean active) {
        return new UserPrincipal(id, email, password, fullName, "ROLE_CUSTOMER", active);
    }

    public Integer getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}

