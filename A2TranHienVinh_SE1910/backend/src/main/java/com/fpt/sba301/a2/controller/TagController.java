package com.fpt.sba301.a2.controller;

import com.fpt.sba301.a2.dto.TagRequest;
import com.fpt.sba301.a2.dto.TagResponse;
import com.fpt.sba301.a2.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponse> getTagById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(tagService.getTagById(id));
    }

    @PostMapping
    public ResponseEntity<TagResponse> createTag(@Valid @RequestBody TagRequest request) {
        TagResponse created = tagService.createTag(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
