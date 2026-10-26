package com.fpt.sba301.a2.repository;

import com.fpt.sba301.a2.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {
    List<Category> findByCategoryNameContainingIgnoreCase(String name);
    boolean existsByParentCategoryID(Short parentId);
}
