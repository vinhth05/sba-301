package com.fpt.sba301.a2.repository;

import com.fpt.sba301.a2.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {
    
    boolean existsByCategory_CategoryID(Short categoryID);

    boolean existsByCreatedBy_AccountID(Short accountID);

    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    List<NewsArticle> findByCreatedBy_AccountIDOrderByCreatedDateDesc(Short accountID);

    @Query("SELECT n FROM NewsArticle n WHERE " +
           "(:keyword IS NULL OR LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR n.category.categoryID = :categoryId) AND " +
           "(:status IS NULL OR n.newsStatus = :status) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchNewsArticles(@Param("keyword") String keyword,
                                         @Param("categoryId") Short categoryId,
                                         @Param("status") Boolean status);
}
