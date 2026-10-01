package com.fpt.sba301.slot15.service;

import com.fpt.sba301.slot15.model.News;
import com.fpt.sba301.slot15.repository.NewsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

@Service
public class NewsService {

    private final NewsRepository repository;

    public NewsService(NewsRepository repository) {
        this.repository = repository;
    }

    public Page<News> findPage(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Slice<News> findActiveSlice(Pageable pageable) {
        return repository.findByActive(true, pageable);
    }
}
