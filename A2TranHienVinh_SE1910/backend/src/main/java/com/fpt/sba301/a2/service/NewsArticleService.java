package com.fpt.sba301.a2.service;

import com.fpt.sba301.a2.dto.NewsArticleRequest;
import com.fpt.sba301.a2.dto.NewsArticleResponse;

import java.util.List;

public interface NewsArticleService {
    List<NewsArticleResponse> getActiveNewsArticles();
    List<NewsArticleResponse> searchNewsArticles(String keyword, Short categoryId, Boolean status);
    List<NewsArticleResponse> getArticlesByStaffId(Short staffId);
    NewsArticleResponse getArticleById(String id);
    NewsArticleResponse createArticle(NewsArticleRequest request);
    NewsArticleResponse updateArticle(String id, NewsArticleRequest request);
    void deleteArticle(String id);
}
