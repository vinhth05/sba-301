package com.example.employeemanagement.services;

import com.example.employeemanagement.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEmployeeService {
    List<Employee> getAllEmployees();
    Page<Employee> getAllEmployees(Pageable pageable);
    Employee getEmployeeById(String id);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(String id, Employee employee);
    boolean deleteEmployee(String id);
}
