package com.example.funews.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<News> newsItems = new ArrayList<>();

    protected Category() {}

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void addNews(News news) {
        newsItems.add(news);
        news.setCategory(this);
    }

    public void removeNews(News news) {
        newsItems.remove(news);
        news.setCategory(null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public List<News> getNewsItems() { return newsItems; }
}
