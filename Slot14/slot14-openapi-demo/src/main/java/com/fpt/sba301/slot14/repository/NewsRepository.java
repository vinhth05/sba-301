package com.fpt.sba301.slot14.repository;

import com.fpt.sba301.slot14.model.News;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class NewsRepository {
    private final Map<Long, News> store = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    public NewsRepository() {
        save(new News(null, "Welcome to SBA301 Slot 14", "OpenAPI and Swagger practice demo", 1L, true));
        save(new News(null, "Springdoc OpenAPI 3.x", "Interactive documentation with Swagger UI", 1L, true));
    }

    public List<News> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<News> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public News save(News news) {
        if (news.getId() == null) {
            news.setId(sequence.incrementAndGet());
        }
        store.put(news.getId(), news);
        return news;
    }

    public void deleteById(Long id) {
        store.remove(id);
    }
}
