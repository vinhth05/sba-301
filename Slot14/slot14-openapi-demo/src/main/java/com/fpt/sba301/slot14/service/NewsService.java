package com.fpt.sba301.slot14.service;

import com.fpt.sba301.slot14.exception.NewsNotFoundException;
import com.fpt.sba301.slot14.model.News;
import com.fpt.sba301.slot14.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsService {
    private final NewsRepository repository;

    public NewsService(NewsRepository repository) {
        this.repository = repository;
    }

    public List<News> findAll() {
        return repository.findAll();
    }

    public News findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NewsNotFoundException(id));
    }

    public News create(News news) {
        news.setId(null);
        return repository.save(news);
    }

    public News update(Long id, News input) {
        News current = findById(id);
        current.setTitle(input.getTitle());
        current.setContent(input.getContent());
        current.setCategoryId(input.getCategoryId());
        current.setActive(input.isActive());
        return repository.save(current);
    }

    public void delete(Long id) {
        findById(id);
        repository.deleteById(id);
    }
}
