package com.fpt.sba301.a2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name cannot exceed 100 characters")
    private String categoryName;

    @NotBlank(message = "Category description is required")
    @Size(max = 250, message = "Category description cannot exceed 250 characters")
    private String categoryDesciption;

    private Short parentCategoryID;
    private Boolean isActive = true;

    public CategoryRequest() {
    }

    public CategoryRequest(String categoryName, String categoryDesciption, Short parentCategoryID, Boolean isActive) {
        this.categoryName = categoryName;
        this.categoryDesciption = categoryDesciption;
        this.parentCategoryID = parentCategoryID;
        this.isActive = isActive;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryDesciption() {
        return categoryDesciption;
    }

    public void setCategoryDesciption(String categoryDesciption) {
        this.categoryDesciption = categoryDesciption;
    }

    public Short getParentCategoryID() {
        return parentCategoryID;
    }

    public void setParentCategoryID(Short parentCategoryID) {
        this.parentCategoryID = parentCategoryID;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
