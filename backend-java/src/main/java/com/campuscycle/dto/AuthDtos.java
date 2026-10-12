package com.campuscycle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.campuscycle.entity.Reputation;
import com.campuscycle.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank(message = "Name is required") String name,
            @NotBlank(message = "Email is required") @Email String email,
            @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password) {
    }

    public record LoginRequest(
            @NotBlank(message = "Email is required") String email,
            @NotBlank(message = "Password is required") String password) {
    }

    public record AuthUserResponse(
            @JsonProperty("_id") Long id,
            String name,
            String email,
            UserRole role,
            boolean verified,
            String avatar,
            Reputation reputation) {
    }

    public record MeUserResponse(
            @JsonProperty("_id") Long id,
            String name,
            String email,
            String avatar,
            String bio,
            String phone,
            boolean verified,
            UserRole role,
            Reputation reputation,
            List<Long> followedTags,
            List<Long> wishlist,
            boolean isActive,
            LocalDateTime suspendedUntil,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
    }

    public record PublicUserResponse(
            @JsonProperty("_id") Long id,
            String name,
            String avatar,
            String bio,
            boolean verified,
            UserRole role,
            Reputation reputation,
            LocalDateTime createdAt) {
    }

    public record UserSummary(
            @JsonProperty("_id") Long id,
            String name,
            String avatar) {
    }

    public record OwnerSummary(
            @JsonProperty("_id") Long id,
            String name,
            String avatar,
            boolean verified,
            Reputation reputation) {
    }
}
