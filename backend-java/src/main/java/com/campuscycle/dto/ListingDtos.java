package com.campuscycle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.campuscycle.dto.AuthDtos.OwnerSummary;
import com.campuscycle.dto.AuthDtos.UserSummary;
import com.campuscycle.entity.ListingCondition;
import com.campuscycle.entity.ListingStatus;
import com.campuscycle.entity.ListingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public final class ListingDtos {

    private ListingDtos() {
    }

    public record DomainSummary(
            @JsonProperty("_id") Long id,
            String name,
            String slug,
            String icon) {
    }

    public record CreateListingRequest(
            @NotBlank(message = "Title is required") @Size(max = 200) String title,
            @NotBlank(message = "Description is required") @Size(max = 2000) String description,
            List<String> photos,
            @NotNull(message = "Listing type is required") ListingType type,
            Double price,
            Double rentPrice,
            String rentDuration,
            Double deposit,
            ListingCondition condition,
            String availability,
            Long domain,
            String category,
            String subcategory,
            List<String> tags,
            String location) {
    }

    public record UpdateListingRequest(
            @Size(max = 200) String title,
            @Size(max = 2000) String description,
            List<String> photos,
            ListingType type,
            Double price,
            Double rentPrice,
            String rentDuration,
            Double deposit,
            ListingCondition condition,
            String availability,
            Long domain,
            String category,
            String subcategory,
            List<String> tags,
            String location) {
    }

    public record StatusUpdateRequest(ListingStatus status) {
    }

    public record ListingResponse(
            @JsonProperty("_id") Long id,
            OwnerSummary owner,
            String title,
            String description,
            List<String> photos,
            ListingType type,
            Double price,
            Double rentPrice,
            String rentDuration,
            Double deposit,
            ListingCondition condition,
            String availability,
            DomainSummary domain,
            String category,
            String subcategory,
            List<String> tags,
            ListingStatus status,
            String location,
            int views,
            UserSummary reservedBy,
            LocalDateTime reservedUntil,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
    }

    public record ListingPageResponse(
            List<ListingResponse> listings,
            long totalPages,
            long currentPage,
            long total) {
    }
}
