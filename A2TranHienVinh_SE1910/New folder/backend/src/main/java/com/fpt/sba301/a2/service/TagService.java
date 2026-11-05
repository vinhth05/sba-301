/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a2.service;

import com.fpt.sba301.a2.dto.TagRequest;
import com.fpt.sba301.a2.dto.TagResponse;

import java.util.List;

public interface TagService {
    List<TagResponse> getAllTags();
    TagResponse getTagById(Integer id);
    TagResponse createTag(TagRequest request);
}
