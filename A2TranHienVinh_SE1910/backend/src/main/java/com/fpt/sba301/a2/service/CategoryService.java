/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
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
