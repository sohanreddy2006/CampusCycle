package com.campuscycle.controller;

import com.campuscycle.dto.TagDtos.CreateTagRequest;
import com.campuscycle.dto.TagDtos.TagFollowResponse;
import com.campuscycle.dto.TagDtos.TagResponse;
import com.campuscycle.dto.TagDtos.TagWithListingsResponse;
import com.campuscycle.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("/search/{query}")
    public ResponseEntity<List<TagResponse>> searchTags(@PathVariable String query) {
        return ResponseEntity.ok(tagService.searchTags(query));
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> getPopularTags() {
        return ResponseEntity.ok(tagService.getPopularTags());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<TagWithListingsResponse> getTagBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(tagService.getTagBySlug(slug));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<TagFollowResponse> toggleFollow(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.toggleFollow(id));
    }

    @PostMapping
    public ResponseEntity<TagResponse> createTag(@Valid @RequestBody CreateTagRequest request) {
        TagService.CreateTagResult result = tagService.createTag(request);
        return result.created()
                ? ResponseEntity.status(HttpStatus.CREATED).body(result.tag())
                : ResponseEntity.ok(result.tag());
    }
}
