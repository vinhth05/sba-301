package com.example.employeemanagement.repositories;

import com.example.employeemanagement.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEmployeeRepository {
    List<Employee> getAllEmployees();
    Page<Employee> findAll(Pageable pageable);
    Employee getEmployeeById(String id);
    Employee create(Employee employee);
    Employee update(String id, Employee employee);
    boolean delete(String id);
}
