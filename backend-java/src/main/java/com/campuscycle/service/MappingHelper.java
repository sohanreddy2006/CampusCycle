package com.campuscycle.service;

import com.campuscycle.dto.AuthDtos.AuthUserResponse;
import com.campuscycle.dto.AuthDtos.MeUserResponse;
import com.campuscycle.dto.AuthDtos.OwnerSummary;
import com.campuscycle.dto.AuthDtos.PublicUserResponse;
import com.campuscycle.dto.AuthDtos.UserSummary;
import com.campuscycle.dto.ListingDtos.DomainSummary;
import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.campuscycle.dto.NotificationDtos.NotificationResponse;
import com.campuscycle.dto.RequestDtos.RequestResponse;
import com.campuscycle.dto.ReservationDtos.ReservationResponse;
import com.campuscycle.dto.TagDtos.TagResponse;
import com.campuscycle.entity.Domain;
import com.campuscycle.entity.Listing;
import com.campuscycle.entity.Notification;
import com.campuscycle.entity.Request;
import com.campuscycle.entity.Reservation;
import com.campuscycle.entity.Tag;
import com.campuscycle.entity.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MappingHelper {

    public OwnerSummary toOwnerSummary(User user) {
        if (user == null) {
            return null;
        }
        return new OwnerSummary(user.getId(), user.getName(), user.getAvatar(), user.isVerified(), user.getReputation());
    }

    public UserSummary toUserSummary(User user) {
        if (user == null) {
            return null;
        }
        return new UserSummary(user.getId(), user.getName(), user.getAvatar());
    }

    public DomainSummary toDomainSummary(Domain domain) {
        if (domain == null) {
            return null;
        }
        return new DomainSummary(domain.getId(), domain.getName(), domain.getSlug(), domain.getIcon());
    }

    public ListingResponse toListingResponse(Listing listing) {
        if (listing == null) {
            return null;
        }
        return new ListingResponse(
                listing.getId(),
                toOwnerSummary(listing.getOwner()),
                listing.getTitle(),
                listing.getDescription(),
                new ArrayList<>(listing.getPhotos()),
                listing.getType(),
                listing.getPrice(),
                listing.getRentPrice(),
                listing.getRentDuration(),
                listing.getDeposit(),
                listing.getCondition(),
                listing.getAvailability(),
                toDomainSummary(listing.getDomain()),
                listing.getCategory(),
                listing.getSubcategory(),
                new ArrayList<>(listing.getTags()),
                listing.getStatus(),
                listing.getLocation(),
                listing.getViews(),
                toUserSummary(listing.getReservedBy()),
                listing.getReservedUntil(),
                listing.getCreatedAt(),
                listing.getUpdatedAt());
    }

    public RequestResponse toRequestResponse(Request request) {
        if (request == null) {
            return null;
        }
        return new RequestResponse(
                request.getId(),
                toOwnerSummary(request.getRequester()),
                request.getTitle(),
                request.getDescription(),
                request.getType(),
                request.getRequiredDate(),
                request.getDuration(),
                toDomainSummary(request.getDomain()),
                request.getCategory(),
                new ArrayList<>(request.getTags()),
                request.getStatus(),
                toListingResponse(request.getMatchedListing()),
                request.getCreatedAt(),
                request.getUpdatedAt());
    }

    public ReservationResponse toReservationResponse(Reservation reservation) {
        if (reservation == null) {
            return null;
        }
        return new ReservationResponse(
                reservation.getId(),
                toListingResponse(reservation.getListing()),
                toUserSummary(reservation.getUser()),
                reservation.getExpiresAt(),
                reservation.getStatus(),
                reservation.getCreatedAt(),
                reservation.getUpdatedAt());
    }

    public NotificationResponse toNotificationResponse(Notification notification) {
        if (notification == null) {
            return null;
        }
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getLink(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getUpdatedAt());
    }

    public TagResponse toTagResponse(Tag tag) {
        if (tag == null) {
            return null;
        }
        List<Long> followerIds = tag.getFollowers().stream().map(User::getId).toList();
        return new TagResponse(tag.getId(), tag.getName(), tag.getSlug(), tag.getCount(), followerIds);
    }

    public AuthUserResponse toAuthUserResponse(User user) {
        return new AuthUserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isVerified(),
                user.getAvatar(), user.getReputation());
    }

    public MeUserResponse toMeUserResponse(User user) {
        List<Long> followedTagIds = user.getFollowedTags().stream().map(Tag::getId).toList();
        List<Long> wishlistIds = user.getWishlist().stream().map(Listing::getId).toList();
        return new MeUserResponse(user.getId(), user.getName(), user.getEmail(), user.getAvatar(), user.getBio(),
                user.getPhone(), user.isVerified(), user.getRole(), user.getReputation(), followedTagIds, wishlistIds,
                user.isActive(), user.getSuspendedUntil(), user.getCreatedAt(), user.getUpdatedAt());
    }

    public PublicUserResponse toPublicUserResponse(User user) {
        return new PublicUserResponse(user.getId(), user.getName(), user.getAvatar(), user.getBio(), user.isVerified(),
                user.getRole(), user.getReputation(), user.getCreatedAt());
    }
}
