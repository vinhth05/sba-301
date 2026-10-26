package com.fpt.sba301.a2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TagRequest {
    private Integer tagID;

    @NotBlank(message = "Tag name is required")
    @Size(max = 50, message = "Tag name cannot exceed 50 characters")
    private String tagName;

    @Size(max = 400, message = "Note cannot exceed 400 characters")
    private String note;

    public TagRequest() {
    }

    public TagRequest(Integer tagID, String tagName, String note) {
        this.tagID = tagID;
        this.tagName = tagName;
        this.note = note;
    }

    public Integer getTagID() {
        return tagID;
    }

    public void setTagID(Integer tagID) {
        this.tagID = tagID;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
