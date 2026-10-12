package com.campuscycle.dto;

import com.campuscycle.dto.AuthDtos.OwnerSummary;
import com.campuscycle.dto.ListingDtos.DomainSummary;
import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.campuscycle.entity.RequestStatus;
import com.campuscycle.entity.RequestType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public final class RequestDtos {

    private RequestDtos() {
    }

    public record CreateRequestRequest(
            @NotBlank(message = "Title is required") @Size(max = 200) String title,
            @Size(max = 2000) String description,
            @NotNull(message = "Request type is required") RequestType type,
            String requiredDate,
            String duration,
            Long domain,
            String category,
            List<String> tags) {
    }

    public record UpdateRequestRequest(
            @Size(max = 200) String title,
            @Size(max = 2000) String description,
            RequestType type,
            String requiredDate,
            String duration,
            Long domain,
            String category,
            List<String> tags,
            RequestStatus status) {
    }

    public record FulfillRequestRequest(Long listingId) {
    }

    public record RequestResponse(
            @JsonProperty("_id") Long id,
            OwnerSummary requester,
            String title,
            String description,
            RequestType type,
            LocalDateTime requiredDate,
            String duration,
            DomainSummary domain,
            String category,
            List<String> tags,
            RequestStatus status,
            ListingResponse matchedListing,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
    }

    public record RequestPageResponse(
            List<RequestResponse> requests,
            long totalPages,
            long currentPage,
            long total) {
    }
}
