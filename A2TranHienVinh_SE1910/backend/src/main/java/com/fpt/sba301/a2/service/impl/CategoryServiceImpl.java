package com.fpt.sba301.a2.service.impl;

import com.fpt.sba301.a2.dto.CategoryRequest;
import com.fpt.sba301.a2.dto.CategoryResponse;
import com.fpt.sba301.a2.entity.Category;
import com.fpt.sba301.a2.exception.BusinessConflictException;
import com.fpt.sba301.a2.exception.ResourceNotFoundException;
import com.fpt.sba301.a2.repository.CategoryRepository;
import com.fpt.sba301.a2.repository.NewsArticleRepository;
import com.fpt.sba301.a2.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, NewsArticleRepository newsArticleRepository) {
        this.categoryRepository = categoryRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> searchCategories(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllCategories();
        }
        return categoryRepository.findByCategoryNameContainingIgnoreCase(name.trim()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Short id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToResponse(cat);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setCategoryName(request.getCategoryName().trim());
        category.setCategoryDesciption(request.getCategoryDesciption().trim());
        category.setParentCategoryID(request.getParentCategoryID());
        category.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Short id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        category.setCategoryName(request.getCategoryName().trim());
        category.setCategoryDesciption(request.getCategoryDesciption().trim());
        category.setParentCategoryID(request.getParentCategoryID());
        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        }

        Category updated = categoryRepository.save(category);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Short id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }

        // Business Rule: The delete action will delete an item in the case this item is not belong to any news articles.
        // If the item is already stored in a news article cannot delete.
        if (newsArticleRepository.existsByCategory_CategoryID(id)) {
            throw new BusinessConflictException("Cannot delete this category because it is already associated with one or more news articles.");
        }

        if (categoryRepository.existsByParentCategoryID(id)) {
            throw new BusinessConflictException("Cannot delete this category because it has subcategories.");
        }

        categoryRepository.deleteById(id);
    }

    private CategoryResponse mapToResponse(Category cat) {
        boolean hasArticles = newsArticleRepository.existsByCategory_CategoryID(cat.getCategoryID());
        boolean hasChildren = categoryRepository.existsByParentCategoryID(cat.getCategoryID());
        boolean canDelete = !hasArticles && !hasChildren;

        return new CategoryResponse(
                cat.getCategoryID(),
                cat.getCategoryName(),
                cat.getCategoryDesciption(),
                cat.getParentCategoryID(),
                cat.getIsActive(),
                canDelete
        );
    }
}
