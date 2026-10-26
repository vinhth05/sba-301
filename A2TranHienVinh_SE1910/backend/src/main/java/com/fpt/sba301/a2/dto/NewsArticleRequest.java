package com.fpt.sba301.a2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class NewsArticleRequest {

    private String newsArticleID;

    @Size(max = 400, message = "Title cannot exceed 400 characters")
    private String newsTitle;

    @NotBlank(message = "Headline is required")
    @Size(max = 150, message = "Headline cannot exceed 150 characters")
    private String headline;

    @Size(max = 4000, message = "News content cannot exceed 4000 characters")
    private String newsContent;

    @Size(max = 400, message = "News source cannot exceed 400 characters")
    private String newsSource;

    @NotNull(message = "Category is required")
    private Short categoryID;

    private Boolean newsStatus = true;

    private Short createdByID;

    private Short updatedByID;

    private List<Integer> tagIds;

    private String imageUrl;

    public NewsArticleRequest() {
    }

    public String getNewsArticleID() {
        return newsArticleID;
    }

    public void setNewsArticleID(String newsArticleID) {
        this.newsArticleID = newsArticleID;
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public String getNewsSource() {
        return newsSource;
    }

    public void setNewsSource(String newsSource) {
        this.newsSource = newsSource;
    }

    public Short getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Short categoryID) {
        this.categoryID = categoryID;
    }

    public Boolean getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(Boolean newsStatus) {
        this.newsStatus = newsStatus;
    }

    public Short getCreatedByID() {
        return createdByID;
    }

    public void setCreatedByID(Short createdByID) {
        this.createdByID = createdByID;
    }

    public Short getUpdatedByID() {
        return updatedByID;
    }

    public void setUpdatedByID(Short updatedByID) {
        this.updatedByID = updatedByID;
    }

    public List<Integer> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<Integer> tagIds) {
        this.tagIds = tagIds;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
