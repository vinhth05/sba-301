package com.fpt.sba301.slot14.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "News article entity documented with OpenAPI")
public class News {

    @Schema(description = "Unique identifier", example = "10", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "News article title", example = "FPT University launches advanced AI workshop", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "News detailed text content", example = "Comprehensive hands-on training for students.")
    private String content;

    @Schema(description = "Foreign key linking category", example = "1")
    private Long categoryId;

    @Schema(description = "Publication visibility flag", example = "true")
    private boolean active;

    public News() {
    }

    public News(Long id, String title, String content, Long categoryId, boolean active) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.categoryId = categoryId;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
