package com.campuscycle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;

public final class UserDtos {

    private UserDtos() {
    }

    public record UpdateProfileRequest(
            String name,
            @Size(max = 500) String bio,
            String phone) {
    }

    public record AvatarRequest(String avatar) {
    }

    public record WishlistToggleResponse(
            @JsonProperty("wishlist") java.util.List<Long> wishlistIds,
            boolean added) {
    }

    public record CountResponse(long count) {
    }

    public record MessageOnlyResponse(String message) {
    }
}
