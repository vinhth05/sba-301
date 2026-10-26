package com.fpt.sba301.a2.service;

import com.fpt.sba301.a2.dto.CategoryRequest;
import com.fpt.sba301.a2.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    List<CategoryResponse> searchCategories(String name);
    CategoryResponse getCategoryById(Short id);
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Short id, CategoryRequest request);
    void deleteCategory(Short id);
}
