package com.campuscycle.service.dto;

import com.campuscycle.entity.embedded.Category;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record DomainDto(
        @JsonProperty("_id") Long id,
        String name,
        String slug,
        String icon,
        List<Category> categories) {
}
