package com.example.employeemanagement.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class EmployeeServiceIntegrationTest {

    @Autowired
    private IEmployeeService service;

    @Test
    @DisplayName("Integration Smoke Test: context loads and wires service with initial repository data")
    void applicationContext_wiresServiceAndRepository() {
        assertThat(service.getAllEmployees()).isNotEmpty();
    }
}
