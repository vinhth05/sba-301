package com.example.employeemanagement.repositories;

import com.example.employeemanagement.entities.EmployeeEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class JpaEmployeeRepositoryTest {

    @Autowired
    private JpaEmployeeRepository repository;

    @Test
    @DisplayName("JPA Slice: save and findById round-trip")
    void saveAndFindById_roundTrip() {
        var saved = repository.save(new EmployeeEntity("E010", "Test User", "Tester", 10_000_000.0));
        Optional<EmployeeEntity> found = repository.findById(saved.getEmpId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test User");
        assertThat(found.get().getSalary()).isEqualTo(10_000_000.0);
    }

    @Test
    @DisplayName("JPA Slice: findByDesignation returns matching rows")
    void findByDesignation_returnsMatchingRows() {
        repository.save(new EmployeeEntity("E101", "Developer A", "Developer", 12_000_000.0));
        repository.save(new EmployeeEntity("E102", "Tester B", "Tester", 10_000_000.0));

        List<EmployeeEntity> developers = repository.findByDesignation("Developer");

        assertThat(developers)
                .extracting(EmployeeEntity::getDesignation)
                .containsOnly("Developer");
    }
}
