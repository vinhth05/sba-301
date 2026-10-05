package com.example.employeemanagement.repositories;

import com.example.employeemanagement.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class EmployeeRepository implements IEmployeeRepository {

    private final Map<String, Employee> store = new ConcurrentHashMap<>();

    public EmployeeRepository() {
        store.put("E001", new Employee("E001", "Nguyen Van An", "Developer", 15_000_000.0));
        store.put("E002", new Employee("E002", "Tran Thi Binh", "Tester", 12_000_000.0));
        store.put("E003", new Employee("E003", "Le Van Cuong", "DevOps", 18_000_000.0));
    }

    @Override
    public List<Employee> getAllEmployees() {
        return new ArrayList<>(store.values());
    }

    @Override
    public Page<Employee> findAll(Pageable pageable) {
        List<Employee> all = new ArrayList<>(store.values());
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), all.size());
        List<Employee> sublist = (start <= all.size()) ? all.subList(start, end) : List.of();
        return new PageImpl<>(sublist, pageable, all.size());
    }

    @Override
    public Employee getEmployeeById(String id) {
        return store.get(id);
    }

    @Override
    public Employee create(Employee employee) {
        store.put(employee.getEmpId(), employee);
        return employee;
    }

    @Override
    public Employee update(String id, Employee employee) {
        employee.setEmpId(id);
        store.put(id, employee);
        return employee;
    }

    @Override
    public boolean delete(String id) {
        return store.remove(id) != null;
    }
}
