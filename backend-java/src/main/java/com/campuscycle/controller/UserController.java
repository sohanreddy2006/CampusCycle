package com.campuscycle.controller;

import com.campuscycle.dto.AuthDtos.MeUserResponse;
import com.campuscycle.dto.AuthDtos.PublicUserResponse;
import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.campuscycle.dto.TagDtos.TagResponse;
import com.campuscycle.dto.UserDtos.AvatarRequest;
import com.campuscycle.dto.UserDtos.CountResponse;
import com.campuscycle.dto.UserDtos.UpdateProfileRequest;
import com.campuscycle.dto.UserDtos.WishlistToggleResponse;
import com.campuscycle.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<MeUserResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<MeUserResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/avatar")
    public ResponseEntity<MeUserResponse> updateAvatar(@RequestBody AvatarRequest request) {
        return ResponseEntity.ok(userService.updateAvatar(request));
    }

    @GetMapping("/me/wishlist")
    public ResponseEntity<List<ListingResponse>> getWishlist() {
        return ResponseEntity.ok(userService.getWishlist());
    }

    @GetMapping("/me/wishlist/count")
    public ResponseEntity<CountResponse> getWishlistCount() {
        return ResponseEntity.ok(userService.getWishlistCount());
    }

    @GetMapping("/me/following")
    public ResponseEntity<List<TagResponse>> getFollowedTags() {
        return ResponseEntity.ok(userService.getFollowedTags());
    }

    @GetMapping("/me/history")
    public ResponseEntity<List<ListingResponse>> getHistory() {
        return ResponseEntity.ok(userService.getHistory());
    }

    @GetMapping("/me/listings")
    public ResponseEntity<List<ListingResponse>> getMyListings() {
        return ResponseEntity.ok(userService.getMyListings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicUserResponse> getPublicProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getPublicProfile(id));
    }

    @GetMapping("/{id}/listings")
    public ResponseEntity<List<ListingResponse>> getUserListings(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserListings(id));
    }

    @PostMapping("/wishlist/{listingId}")
    public ResponseEntity<WishlistToggleResponse> addToWishlist(@PathVariable Long listingId) {
        return ResponseEntity.ok(userService.addToWishlist(listingId));
    }
}
