package com.campuscycle.controller;

import com.campuscycle.dto.ListingDtos.CreateListingRequest;
import com.campuscycle.dto.ListingDtos.ListingPageResponse;
import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.campuscycle.dto.ListingDtos.StatusUpdateRequest;
import com.campuscycle.dto.ListingDtos.UpdateListingRequest;
import com.campuscycle.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @PostMapping
    public ResponseEntity<ListingResponse> createListing(@Valid @RequestBody CreateListingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(listingService.createListing(request));
    }

    @GetMapping
    public ResponseEntity<ListingPageResponse> getListings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long domain,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "available") String status,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "12") Integer limit,
            @RequestParam(required = false, defaultValue = "-createdAt") String sort) {
        return ResponseEntity.ok(listingService.getListings(search, type, domain, category, condition,
                minPrice, maxPrice, location, status, page, limit, sort));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> getMyListings() {
        return ResponseEntity.ok(listingService.getMyListings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListing(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getListing(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> updateListing(@PathVariable Long id,
                                                         @RequestBody UpdateListingRequest request) {
        return ResponseEntity.ok(listingService.updateListing(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteListing(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.deleteListing(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ListingResponse> updateStatus(@PathVariable Long id,
                                                        @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(listingService.updateStatus(id, request));
    }

    @GetMapping("/domain/{domainId}")
    public ResponseEntity<List<ListingResponse>> getListingsByDomain(@PathVariable Long domainId) {
        return ResponseEntity.ok(listingService.getListingsByDomain(domainId));
    }
}
