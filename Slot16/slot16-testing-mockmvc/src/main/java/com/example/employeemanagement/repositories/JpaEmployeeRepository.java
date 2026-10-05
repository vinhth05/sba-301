package com.example.employeemanagement.repositories;

import com.example.employeemanagement.entities.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaEmployeeRepository extends JpaRepository<EmployeeEntity, String> {
    List<EmployeeEntity> findByDesignation(String designation);
}
