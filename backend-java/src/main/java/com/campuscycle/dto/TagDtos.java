package com.campuscycle.dto;

import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public final class TagDtos {

    private TagDtos() {
    }

    public record TagResponse(
            @JsonProperty("_id") Long id,
            String name,
            String slug,
            int count,
            List<Long> followers) {
    }

    public record TagWithListingsResponse(
            TagResponse tag,
            List<ListingResponse> listings) {
    }

    public record CreateTagRequest(
            @NotBlank(message = "Name is required") @Size(max = 100) String name) {
    }

    public record TagFollowResponse(
            boolean followed,
            long followersCount) {
    }
}
