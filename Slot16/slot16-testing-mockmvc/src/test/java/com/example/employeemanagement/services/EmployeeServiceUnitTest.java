package com.example.employeemanagement.services;

import com.example.employeemanagement.exceptions.EmployeeNotFoundException;
import com.example.employeemanagement.pojos.Employee;
import com.example.employeemanagement.repositories.IEmployeeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceUnitTest {

    @Mock
    private IEmployeeRepository repository;

    @InjectMocks
    private EmployeeService service;

    @Test
    @DisplayName("getEmployeeById - When employee exists, returns employee object")
    void getById_existing_returnsEmployee() {
        Employee e = new Employee("E001", "An", "Developer", 15_000_000.0);
        when(repository.getEmployeeById("E001")).thenReturn(e);

        Employee result = service.getEmployeeById("E001");

        assertThat(result).isSameAs(e);
        verify(repository).getEmployeeById("E001");
    }

    @Test
    @DisplayName("getEmployeeById - When employee is missing, throws EmployeeNotFoundException")
    void getById_missing_throwsException() {
        when(repository.getEmployeeById("E999")).thenReturn(null);

        assertThatThrownBy(() -> service.getEmployeeById("E999"))
                .isInstanceOf(EmployeeNotFoundException.class)
                .hasMessageContaining("E999");

        verify(repository).getEmployeeById("E999");
    }

    @Test
    @DisplayName("createEmployee - Delegates creation to repository")
    void create_valid_delegatesToRepository() {
        Employee e = new Employee("E004", "Dung", "HR", 14_000_000.0);
        when(repository.create(e)).thenReturn(e);

        Employee result = service.createEmployee(e);

        assertThat(result).isSameAs(e);
        verify(repository).create(e);
    }
}
