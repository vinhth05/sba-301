package com.fpt.sba301.a2.service;

import com.fpt.sba301.a2.dto.TagRequest;
import com.fpt.sba301.a2.dto.TagResponse;

import java.util.List;

public interface TagService {
    List<TagResponse> getAllTags();
    TagResponse getTagById(Integer id);
    TagResponse createTag(TagRequest request);
}
