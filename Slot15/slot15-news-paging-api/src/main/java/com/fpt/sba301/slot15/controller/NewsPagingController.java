package com.fpt.sba301.slot15.controller;

import com.fpt.sba301.slot15.model.News;
import com.fpt.sba301.slot15.service.NewsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/news")
public class NewsPagingController {

    private final NewsService service;

    public NewsPagingController(NewsService service) {
        this.service = service;
    }

    private static final Set<String> ALLOWED_SORTS = Set.of("id", "title", "publishDate", "active");

    private String validateSort(String requested) {
        if (!ALLOWED_SORTS.contains(requested)) {
            throw new IllegalArgumentException("Unsupported sort field: " + requested);
        }
        return requested;
    }

    // Standard Spring Data Pageable endpoint
    @GetMapping
    public Page<News> getPage(
            @PageableDefault(size = 10, sort = "publishDate", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return service.findPage(pageable);
    }

    // Slice endpoint for infinite scroll / Load More
    @GetMapping("/slice")
    public Slice<News> getActiveSlice(
            @PageableDefault(size = 10, sort = "publishDate", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return service.findActiveSlice(pageable);
    }

    // Controlled endpoint with guardrails (clamp size and whitelist sort field)
    @GetMapping("/safe")
    public Page<News> getSafePage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        String safeSort = validateSort(sortBy);
        Sort.Direction dir = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(dir, safeSort));
        return service.findPage(pageable);
    }
}
