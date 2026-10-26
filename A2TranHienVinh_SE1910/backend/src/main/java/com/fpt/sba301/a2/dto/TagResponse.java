package com.fpt.sba301.a2.dto;

public class TagResponse {
    private Integer tagID;
    private String tagName;
    private String note;

    public TagResponse() {
    }

    public TagResponse(Integer tagID, String tagName, String note) {
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
