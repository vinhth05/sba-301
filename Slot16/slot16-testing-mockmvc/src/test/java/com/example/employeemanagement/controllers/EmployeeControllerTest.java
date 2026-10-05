package com.example.employeemanagement.controllers;

import com.example.employeemanagement.exceptions.EmployeeNotFoundException;
import com.example.employeemanagement.pojos.Employee;
import com.example.employeemanagement.services.IEmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IEmployeeService employeeService;

    @Test
    @DisplayName("GET /api/employees - Should return paged employees")
    void getAll_returnsPagedData() throws Exception {
        var employees = List.of(
                new Employee("E001", "Nguyen Van An", "Developer", 15_000_000.0),
                new Employee("E002", "Tran Thi Binh", "Tester", 12_000_000.0)
        );
        when(employeeService.getAllEmployees(any(Pageable.class)))
                .thenReturn(new PageImpl<>(employees, PageRequest.of(0, 10), 2));

        mockMvc.perform(get("/api/employees")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].empId").value("E001"))
                .andExpect(jsonPath("$.content[0].name").value("Nguyen Van An"));
    }

    @Test
    @DisplayName("GET /api/employees/{id} - Existing ID returns 200 OK")
    void getById_existing_returns200AndJson() throws Exception {
        var e = new Employee("E001", "Nguyen Van An", "Developer", 15_000_000.0);
        when(employeeService.getEmployeeById("E001")).thenReturn(e);

        mockMvc.perform(get("/api/employees/E001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.empId").value("E001"))
                .andExpect(jsonPath("$.name").value("Nguyen Van An"))
                .andExpect(jsonPath("$.designation").value("Developer"));
    }

    @Test
    @DisplayName("GET /api/employees/{id} - Non-existent ID returns 404 Not Found")
    void getById_missing_returns404() throws Exception {
        when(employeeService.getEmployeeById("E999"))
                .thenThrow(new EmployeeNotFoundException("E999"));

        mockMvc.perform(get("/api/employees/E999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Employee not found with id = E999"));
    }

    @Test
    @DisplayName("POST /api/employees - Valid employee creation returns 201 Created")
    void create_valid_returns201() throws Exception {
        var input = new Employee("E004", "Pham Thi Dung", "HR", 14_000_000.0);
        when(employeeService.createEmployee(any(Employee.class))).thenReturn(input);

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/employees/E004"))
                .andExpect(jsonPath("$.empId").value("E004"))
                .andExpect(jsonPath("$.name").value("Pham Thi Dung"));
    }
}
