package com.fpt.sba301.a2.service.impl;

import com.fpt.sba301.a2.dto.TagRequest;
import com.fpt.sba301.a2.dto.TagResponse;
import com.fpt.sba301.a2.entity.Tag;
import com.fpt.sba301.a2.exception.ResourceNotFoundException;
import com.fpt.sba301.a2.repository.TagRepository;
import com.fpt.sba301.a2.service.TagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponse getTagById(Integer id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + id));
        return mapToResponse(tag);
    }

    @Override
    @Transactional
    public TagResponse createTag(TagRequest request) {
        Tag tag = new Tag();
        if (request.getTagID() != null && request.getTagID() > 0) {
            tag.setTagID(request.getTagID());
        } else {
            Integer maxId = tagRepository.findMaxTagId();
            tag.setTagID(maxId + 1);
        }
        tag.setTagName(request.getTagName().trim());
        tag.setNote(request.getNote() != null ? request.getNote().trim() : null);

        Tag saved = tagRepository.save(tag);
        return mapToResponse(saved);
    }

    private TagResponse mapToResponse(Tag tag) {
        return new TagResponse(tag.getTagID(), tag.getTagName(), tag.getNote());
    }
}
