package com.campuscycle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public final class NotificationDtos {

    private NotificationDtos() {
    }

    public record NotificationResponse(
            @JsonProperty("_id") Long id,
            String type,
            String title,
            String message,
            String link,
            boolean read,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
    }

    public record NotificationPageResponse(
            List<NotificationResponse> notifications,
            long total,
            long unread,
            long totalPages) {
    }
}
