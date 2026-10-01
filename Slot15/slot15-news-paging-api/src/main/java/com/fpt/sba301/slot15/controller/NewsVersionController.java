package com.fpt.sba301.slot15.controller;

import com.fpt.sba301.slot15.model.NewsV1;
import com.fpt.sba301.slot15.model.NewsV2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class NewsVersionController {

    private final List<NewsV1> v1Data = List.of(
            new NewsV1(1L, "Welcome to SBA301 v1"),
            new NewsV1(2L, "Spring Boot Paging v1")
    );

    private final List<NewsV2> v2Data = List.of(
            new NewsV2(1L, "Welcome to SBA301 v2", LocalDate.now(), true),
            new NewsV2(2L, "Spring Boot Paging v2", LocalDate.now().minusDays(1), true)
    );

    // 1. Path / URI versioning
    @GetMapping("/v1/news")
    public List<NewsV1> getV1ByPath() {
        return v1Data;
    }

    @GetMapping("/v2/news")
    public List<NewsV2> getV2ByPath() {
        return v2Data;
    }

    // 2. Query parameter versioning
    @GetMapping(value = "/news/version", params = "version=1")
    public List<NewsV1> getV1ByParam() {
        return v1Data;
    }

    @GetMapping(value = "/news/version", params = "version=2")
    public List<NewsV2> getV2ByParam() {
        return v2Data;
    }

    // 3. Custom header versioning
    @GetMapping(value = "/news/version", headers = "X-API-Version=1")
    public List<NewsV1> getV1ByHeader() {
        return v1Data;
    }

    @GetMapping(value = "/news/version", headers = "X-API-Version=2")
    public List<NewsV2> getV2ByHeader() {
        return v2Data;
    }

    // 4. Accept / Media Type versioning
    @GetMapping(value = "/news/version", produces = "application/vnd.funews.v1+json")
    public List<NewsV1> getV1ByMediaType() {
        return v1Data;
    }

    @GetMapping(value = "/news/version", produces = "application/vnd.funews.v2+json")
    public List<NewsV2> getV2ByMediaType() {
        return v2Data;
    }
}
