package com.fpt.sba301.a2.dto;

public class CategoryResponse {
    private Short categoryID;
    private String categoryName;
    private String categoryDesciption;
    private Short parentCategoryID;
    private Boolean isActive;
    private boolean canDelete;

    public CategoryResponse() {
    }

    public CategoryResponse(Short categoryID, String categoryName, String categoryDesciption, Short parentCategoryID, Boolean isActive, boolean canDelete) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
        this.categoryDesciption = categoryDesciption;
        this.parentCategoryID = parentCategoryID;
        this.isActive = isActive;
        this.canDelete = canDelete;
    }

    public Short getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Short categoryID) {
        this.categoryID = categoryID;
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

    public boolean isCanDelete() {
        return canDelete;
    }

    public void setCanDelete(boolean canDelete) {
        this.canDelete = canDelete;
    }
}
