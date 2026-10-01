package com.fpt.sba301.slot14.controller;

import com.fpt.sba301.slot14.model.Employee;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Employees", description = "Employee management documentation demo")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final List<Employee> data = List.of(
            new Employee(1L, "Nguyen Van A", "Backend Developer"),
            new Employee(2L, "Tran Thi B", "QA Engineer")
    );

    @Operation(summary = "Get all employees", description = "Retrieve list of all active employees")
    @ApiResponse(responseCode = "200", description = "Employees successfully returned")
    @GetMapping
    public List<Employee> getAll() {
        return data;
    }

    @Operation(summary = "Get employee by ID", description = "Lookup an employee record by numeric primary key")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Employee found"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getById(
            @Parameter(description = "Employee numeric ID", example = "1", required = true)
            @PathVariable Long id
    ) {
        return data.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
