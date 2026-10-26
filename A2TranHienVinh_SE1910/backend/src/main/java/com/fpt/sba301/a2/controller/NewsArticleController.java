package com.fpt.sba301.a2.controller;

import com.fpt.sba301.a2.dto.NewsArticleRequest;
import com.fpt.sba301.a2.dto.NewsArticleResponse;
import com.fpt.sba301.a2.service.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news-articles")
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    public NewsArticleController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    /**
     * Public endpoint: No authentication required to view active news articles.
     */
    @GetMapping("/public/active")
    public ResponseEntity<List<NewsArticleResponse>> getActiveNewsArticles() {
        return ResponseEntity.ok(newsArticleService.getActiveNewsArticles());
    }

    /**
     * Search and list news articles with filters.
     */
    @GetMapping
    public ResponseEntity<List<NewsArticleResponse>> searchNewsArticles(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryId", required = false) Short categoryId,
            @RequestParam(value = "status", required = false) Boolean status) {
        return ResponseEntity.ok(newsArticleService.searchNewsArticles(keyword, categoryId, status));
    }

    /**
     * Staff news history created by the specified staff ID.
     */
    @GetMapping("/staff/{staffId}/history")
    public ResponseEntity<List<NewsArticleResponse>> getStaffNewsHistory(
            @PathVariable("staffId") Short staffId) {
        return ResponseEntity.ok(newsArticleService.getArticlesByStaffId(staffId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleResponse> getArticleById(@PathVariable("id") String id) {
        return ResponseEntity.ok(newsArticleService.getArticleById(id));
    }

    @PostMapping
    public ResponseEntity<NewsArticleResponse> createArticle(@Valid @RequestBody NewsArticleRequest request) {
        NewsArticleResponse created = newsArticleService.createArticle(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleResponse> updateArticle(
            @PathVariable("id") String id,
            @Valid @RequestBody NewsArticleRequest request) {
        NewsArticleResponse updated = newsArticleService.updateArticle(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable("id") String id) {
        newsArticleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
