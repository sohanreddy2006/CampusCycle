package com.campuscycle.service;

import com.campuscycle.dto.AuthDtos.MeUserResponse;
import com.campuscycle.dto.AuthDtos.PublicUserResponse;
import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.campuscycle.dto.TagDtos.TagResponse;
import com.campuscycle.dto.UserDtos.AvatarRequest;
import com.campuscycle.dto.UserDtos.CountResponse;
import com.campuscycle.dto.UserDtos.UpdateProfileRequest;
import com.campuscycle.dto.UserDtos.WishlistToggleResponse;
import com.campuscycle.entity.Listing;
import com.campuscycle.entity.ListingStatus;
import com.campuscycle.entity.Tag;
import com.campuscycle.entity.User;
import com.campuscycle.exception.NotFoundException;
import com.campuscycle.repository.ListingRepository;
import com.campuscycle.repository.UserRepository;
import com.campuscycle.security.CurrentUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final CurrentUserService currentUserService;
    private final MappingHelper mapper;

    public UserService(UserRepository userRepository, ListingRepository listingRepository,
                       CurrentUserService currentUserService, MappingHelper mapper) {
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public MeUserResponse getProfile() {
        return mapper.toMeUserResponse(currentUser());
    }

    @Transactional
    public MeUserResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUser();
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }
        if (request.bio() != null) {
            user.setBio(request.bio());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        userRepository.save(user);
        return mapper.toMeUserResponse(user);
    }

    @Transactional
    public MeUserResponse updateAvatar(AvatarRequest request) {
        User user = currentUser();
        if (request.avatar() != null) {
            user.setAvatar(request.avatar());
        }
        userRepository.save(user);
        return mapper.toMeUserResponse(user);
    }

    @Transactional(readOnly = true)
    public PublicUserResponse getPublicProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return mapper.toPublicUserResponse(user);
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getUserListings(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException("User not found");
        }
        return listingRepository.findByOwnerIdOrderByCreatedAtDesc(id).stream()
                .map(mapper::toListingResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getMyListings() {
        return listingRepository.findByOwnerIdOrderByCreatedAtDesc(currentUserService.currentUserId()).stream()
                .map(mapper::toListingResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getWishlist() {
        return currentUser().getWishlist().stream().map(mapper::toListingResponse).toList();
    }

    @Transactional(readOnly = true)
    public CountResponse getWishlistCount() {
        return new CountResponse(currentUser().getWishlist().size());
    }

    @Transactional
    public WishlistToggleResponse addToWishlist(Long listingId) {
        User user = currentUser();
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NotFoundException("Listing not found"));

        boolean added;
        if (user.getWishlist().contains(listing)) {
            user.getWishlist().remove(listing);
            added = false;
        } else {
            user.getWishlist().add(listing);
            added = true;
        }
        userRepository.save(user);
        List<Long> ids = user.getWishlist().stream().map(Listing::getId).toList();
        return new WishlistToggleResponse(ids, added);
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getFollowedTags() {
        return currentUser().getFollowedTags().stream().map(mapper::toTagResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getHistory() {
        return listingRepository.findByOwnerIdAndStatusInOrderByUpdatedAtDesc(
                        currentUserService.currentUserId(),
                        List.of(ListingStatus.SOLD, ListingStatus.RENTED, ListingStatus.BORROWED, ListingStatus.DONATED))
                .stream().map(mapper::toListingResponse).toList();
    }

    private User currentUser() {
        return userRepository.findById(currentUserService.currentUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
