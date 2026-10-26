package com.fpt.sba301.a2.service.impl;

import com.fpt.sba301.a2.dto.NewsArticleRequest;
import com.fpt.sba301.a2.dto.NewsArticleResponse;
import com.fpt.sba301.a2.dto.TagResponse;
import com.fpt.sba301.a2.entity.Category;
import com.fpt.sba301.a2.entity.NewsArticle;
import com.fpt.sba301.a2.entity.SystemAccount;
import com.fpt.sba301.a2.entity.Tag;
import com.fpt.sba301.a2.exception.BusinessConflictException;
import com.fpt.sba301.a2.exception.ResourceNotFoundException;
import com.fpt.sba301.a2.repository.CategoryRepository;
import com.fpt.sba301.a2.repository.NewsArticleRepository;
import com.fpt.sba301.a2.repository.SystemAccountRepository;
import com.fpt.sba301.a2.repository.TagRepository;
import com.fpt.sba301.a2.service.NewsArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NewsArticleServiceImpl implements NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    private static final String[] DEFAULT_IMAGES = {
            "hodiep.jpg", "alba.jpg", "damari.jpg", "longtu.jpg", "yellow.jpg",
            "3mau.jpg", "4n.jpg", "thohong.jpg", "yaya.jpg"
    };

    public NewsArticleServiceImpl(NewsArticleRepository newsArticleRepository,
                                  CategoryRepository categoryRepository,
                                  SystemAccountRepository accountRepository,
                                  TagRepository tagRepository) {
        this.newsArticleRepository = newsArticleRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    public List<NewsArticleResponse> getActiveNewsArticles() {
        return newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsArticleResponse> searchNewsArticles(String keyword, Short categoryId, Boolean status) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        return newsArticleRepository.searchNewsArticles(cleanKeyword, categoryId, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsArticleResponse> getArticlesByStaffId(Short staffId) {
        return newsArticleRepository.findByCreatedBy_AccountIDOrderByCreatedDateDesc(staffId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NewsArticleResponse getArticleById(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        return mapToResponse(article);
    }

    @Override
    @Transactional
    public NewsArticleResponse createArticle(NewsArticleRequest request) {
        String articleId = request.getNewsArticleID();
        if (articleId == null || articleId.trim().isEmpty()) {
            articleId = String.valueOf(System.currentTimeMillis() % 1000000);
        } else {
            articleId = articleId.trim();
        }

        if (newsArticleRepository.existsById(articleId)) {
            throw new BusinessConflictException("News article with ID '" + articleId + "' already exists.");
        }

        Category category = categoryRepository.findById(request.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryID()));

        SystemAccount creator = null;
        if (request.getCreatedByID() != null) {
            creator = accountRepository.findById(request.getCreatedByID()).orElse(null);
        }

        NewsArticle article = new NewsArticle();
        article.setNewsArticleID(articleId);
        article.setNewsTitle(request.getNewsTitle() != null ? request.getNewsTitle().trim() : "");
        article.setHeadline(request.getHeadline().trim());
        article.setNewsContent(request.getNewsContent() != null ? request.getNewsContent().trim() : "");

        // Embed image info in newsSource if specified
        String source = request.getNewsSource() != null ? request.getNewsSource().trim() : "Internal FU";
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            source = source + " | img:" + request.getImageUrl().trim();
        }
        article.setNewsSource(source);

        article.setCategory(category);
        article.setNewsStatus(request.getNewsStatus() != null ? request.getNewsStatus() : true);
        article.setCreatedBy(creator);
        article.setUpdatedBy(creator);
        article.setCreatedDate(LocalDateTime.now());
        article.setModifiedDate(LocalDateTime.now());

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            article.setTags(new HashSet<>(tags));
        }

        NewsArticle saved = newsArticleRepository.save(article);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public NewsArticleResponse updateArticle(String id, NewsArticleRequest request) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryID()));

        article.setNewsTitle(request.getNewsTitle() != null ? request.getNewsTitle().trim() : "");
        article.setHeadline(request.getHeadline().trim());
        article.setNewsContent(request.getNewsContent() != null ? request.getNewsContent().trim() : "");

        String source = request.getNewsSource() != null ? request.getNewsSource().trim() : "Internal FU";
        // remove old image marker if any
        if (source.contains(" | img:")) {
            source = source.substring(0, source.indexOf(" | img:")).trim();
        }
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            source = source + " | img:" + request.getImageUrl().trim();
        }
        article.setNewsSource(source);

        article.setCategory(category);
        if (request.getNewsStatus() != null) {
            article.setNewsStatus(request.getNewsStatus());
        }

        if (request.getUpdatedByID() != null) {
            SystemAccount updater = accountRepository.findById(request.getUpdatedByID()).orElse(null);
            article.setUpdatedBy(updater);
        }
        article.setModifiedDate(LocalDateTime.now());

        if (request.getTagIds() != null) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            article.setTags(new HashSet<>(tags));
        }

        NewsArticle updated = newsArticleRepository.save(article);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteArticle(String id) {
        if (!newsArticleRepository.existsById(id)) {
            throw new ResourceNotFoundException("News article not found with ID: " + id);
        }
        newsArticleRepository.deleteById(id);
    }

    private NewsArticleResponse mapToResponse(NewsArticle article) {
        NewsArticleResponse res = new NewsArticleResponse();
        res.setNewsArticleID(article.getNewsArticleID());
        res.setNewsTitle(article.getNewsTitle());
        res.setHeadline(article.getHeadline());
        res.setCreatedDate(article.getCreatedDate());
        res.setNewsContent(article.getNewsContent());
        res.setNewsStatus(article.getNewsStatus());
        res.setModifiedDate(article.getModifiedDate());

        // Extract image from newsSource if present
        String rawSource = article.getNewsSource();
        String displaySource = rawSource;
        String resolvedImage = null;

        if (rawSource != null && rawSource.contains(" | img:")) {
            int idx = rawSource.indexOf(" | img:");
            displaySource = rawSource.substring(0, idx).trim();
            resolvedImage = rawSource.substring(idx + 7).trim();
        } else if (rawSource != null && rawSource.toLowerCase().endsWith(".jpg")) {
            resolvedImage = rawSource.trim();
        }

        // Fallback image using article ID hash code
        if (resolvedImage == null || resolvedImage.isEmpty()) {
            int hash = Math.abs(article.getNewsArticleID() != null ? article.getNewsArticleID().hashCode() : 0);
            resolvedImage = DEFAULT_IMAGES[hash % DEFAULT_IMAGES.length];
        }

        res.setNewsSource(displaySource);
        res.setImageUrl(resolvedImage);

        if (article.getCategory() != null) {
            res.setCategoryID(article.getCategory().getCategoryID());
            res.setCategoryName(article.getCategory().getCategoryName());
        }

        if (article.getCreatedBy() != null) {
            res.setCreatedByID(article.getCreatedBy().getAccountID());
            res.setCreatedByName(article.getCreatedBy().getAccountName());
        }

        if (article.getUpdatedBy() != null) {
            res.setUpdatedByID(article.getUpdatedBy().getAccountID());
            res.setUpdatedByName(article.getUpdatedBy().getAccountName());
        }

        if (article.getTags() != null) {
            Set<TagResponse> tagResponses = article.getTags().stream()
                    .map(t -> new TagResponse(t.getTagID(), t.getTagName(), t.getNote()))
                    .collect(Collectors.toSet());
            res.setTags(tagResponses);
        } else {
            res.setTags(new HashSet<>());
        }

        return res;
    }
}
