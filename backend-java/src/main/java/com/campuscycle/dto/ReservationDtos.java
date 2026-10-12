package com.campuscycle.dto;

import com.campuscycle.dto.AuthDtos.UserSummary;
import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.campuscycle.entity.ReservationStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public final class ReservationDtos {

    private ReservationDtos() {
    }

    public record CreateReservationRequest(
            @NotNull(message = "listingId is required") Long listingId,
            Integer duration) {
    }

    public record ReservationResponse(
            @JsonProperty("_id") Long id,
            ListingResponse listing,
            UserSummary user,
            LocalDateTime expiresAt,
            ReservationStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
    }

    public record MessageResponse(String message) {
    }
}
