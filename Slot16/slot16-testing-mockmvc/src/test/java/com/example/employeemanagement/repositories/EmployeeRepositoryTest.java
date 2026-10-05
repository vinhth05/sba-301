package com.example.employeemanagement.repositories;

import com.example.employeemanagement.pojos.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

class EmployeeRepositoryTest {

    private EmployeeRepository repository;

    @BeforeEach
    void setUp() {
        repository = new EmployeeRepository();
    }

    @Test
    @DisplayName("In-memory repository: create then findById round-trip")
    void create_thenFind_roundTrip() {
        var e = new Employee("E010", "Test User", "Tester", 10_000_000.0);
        repository.create(e);

        Employee found = repository.getEmployeeById("E010");
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Test User");
        assertThat(found.getDesignation()).isEqualTo("Tester");
    }

    @Test
    @DisplayName("In-memory repository: pagination returns correct page slice and totalElements")
    void paging_firstPage_returnsExpectedSize() {
        Page<Employee> page = repository.findAll(PageRequest.of(0, 2));

        assertThat(page.getContent()).hasSize(2);
        assertThat(page.getTotalElements()).isGreaterThanOrEqualTo(3);
        assertThat(page.getTotalPages()).isGreaterThanOrEqualTo(2);
    }
}
