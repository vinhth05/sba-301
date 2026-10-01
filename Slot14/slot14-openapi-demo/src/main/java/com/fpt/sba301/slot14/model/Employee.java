package com.fpt.sba301.slot14.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Employee entity exposed by Demo 1")
public class Employee {

    @Schema(description = "Employee unique identifier", example = "1")
    private Long id;

    @Schema(description = "Full name of the employee", example = "Nguyen Van A", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "Job role or title", example = "Backend Developer")
    private String position;

    public Employee() {
    }

    public Employee(Long id, String name, String position) {
        this.id = id;
        this.name = name;
        this.position = position;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }
}
