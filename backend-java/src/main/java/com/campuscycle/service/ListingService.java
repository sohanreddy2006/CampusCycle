package com.campuscycle.service;

import com.campuscycle.dto.ListingDtos.CreateListingRequest;
import com.campuscycle.dto.ListingDtos.ListingPageResponse;
import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.campuscycle.dto.ListingDtos.StatusUpdateRequest;
import com.campuscycle.dto.ListingDtos.UpdateListingRequest;
import com.campuscycle.entity.Domain;
import com.campuscycle.entity.Listing;
import com.campuscycle.entity.ListingStatus;
import com.campuscycle.entity.ListingType;
import com.campuscycle.entity.Notification;
import com.campuscycle.entity.Tag;
import com.campuscycle.entity.User;
import com.campuscycle.exception.ForbiddenException;
import com.campuscycle.exception.NotFoundException;
import com.campuscycle.repository.DomainRepository;
import com.campuscycle.repository.ListingRepository;
import com.campuscycle.repository.NotificationRepository;
import com.campuscycle.repository.TagRepository;
import com.campuscycle.repository.UserRepository;
import com.campuscycle.security.CurrentUserService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ListingService {

    private static final java.util.Set<String> SORTABLE = java.util.Set.of(
            "createdAt", "price", "rentPrice", "deposit", "views", "title", "updatedAt");

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final DomainRepository domainRepository;
    private final TagRepository tagRepository;
    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;
    private final MappingHelper mapper;

    public ListingService(ListingRepository listingRepository, UserRepository userRepository,
                          DomainRepository domainRepository, TagRepository tagRepository,
                          NotificationRepository notificationRepository, CurrentUserService currentUserService,
                          MappingHelper mapper) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
        this.domainRepository = domainRepository;
        this.tagRepository = tagRepository;
        this.notificationRepository = notificationRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Transactional
    public ListingResponse createListing(CreateListingRequest request) {
        Long userId = currentUserService.currentUserId();
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Listing listing = new Listing();
        listing.setOwner(owner);
        listing.setTitle(request.title().trim());
        listing.setDescription(request.description());
        listing.setPhotos(request.photos() != null ? new ArrayList<>(request.photos()) : new ArrayList<>());
        listing.setType(request.type());
        listing.setPrice(request.price());
        listing.setRentPrice(request.rentPrice());
        listing.setRentDuration(request.rentDuration());
        listing.setDeposit(request.deposit() != null ? request.deposit() : 0.0);
        if (request.condition() != null) {
            listing.setCondition(request.condition());
        }
        listing.setAvailability(request.availability());
        if (request.domain() != null) {
            Domain domain = domainRepository.findById(request.domain())
                    .orElseThrow(() -> new NotFoundException("Domain not found"));
            listing.setDomain(domain);
        }
        listing.setCategory(request.category());
        listing.setSubcategory(request.subcategory());
        List<String> tags = normalizeTags(request.tags());
        listing.setTags(tags);
        listing.setLocation(request.location());
        listingRepository.save(listing);

        owner.getReputation().setListings(owner.getReputation().getListings() + 1);
        userRepository.save(owner);

        for (String tagName : tags) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> {
                        Tag created = new Tag();
                        created.setName(tagName);
                        created.setSlug(slugify(tagName));
                        return created;
                    });
            tag.setCount(tag.getCount() + 1);
            tagRepository.save(tag);

            for (User follower : tag.getFollowers()) {
                if (!follower.getId().equals(owner.getId())) {
                    Notification notification = new Notification();
                    notification.setUser(follower);
                    notification.setType("tag_match");
                    notification.setTitle("New listing matches followed tag");
                    notification.setMessage("A new listing \"" + listing.getTitle() + "\" matches #" + tag.getName());
                    notification.setLink("/listing/" + listing.getId());
                    notificationRepository.save(notification);
                }
            }
        }

        return mapper.toListingResponse(listing);
    }

    @Transactional(readOnly = true)
    public ListingPageResponse getListings(String search, String type, Long domain, String category, String condition,
                                           Double minPrice, Double maxPrice, String location, String status,
                                           Integer page, Integer limit, String sort) {
        int currentPage = page == null || page < 1 ? 1 : page;
        int currentLimit = limit == null || limit < 1 ? 12 : limit;
        String currentStatus = status == null || status.isBlank() ? "available" : status;

        Specification<Listing> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), ListingStatus.fromValue(currentStatus)));

            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                Subquery<Integer> sub = query.subquery(Integer.class);
                var subRoot = sub.correlate(root);
                Join<Object, Object> tagJoin = subRoot.join("tags");
                sub.select(subRoot.<Integer>get("id")).where(cb.like(cb.lower(tagJoin.as(String.class)), like));
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.exists(sub)));
            }
            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("type"), ListingType.fromValue(type)));
            }
            if (domain != null) {
                predicates.add(cb.equal(root.get("domain").get("id"), domain));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (condition != null && !condition.isBlank()) {
                predicates.add(cb.equal(root.get("condition"),
                        com.campuscycle.entity.ListingCondition.fromValue(condition)));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sortOrder = parseSort(sort);
        Page<Listing> result = listingRepository.findAll(spec, PageRequest.of(currentPage - 1, currentLimit, sortOrder));

        List<ListingResponse> listings = result.getContent().stream().map(mapper::toListingResponse).toList();
        return new ListingPageResponse(listings, result.getTotalPages(), result.getNumber() + 1, result.getTotalElements());
    }

    @Transactional
    public ListingResponse getListing(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Listing not found"));
        ListingResponse response = mapper.toListingResponse(listing);
        listing.setViews(listing.getViews() + 1);
        listingRepository.save(listing);
        return response;
    }

    @Transactional
    public ListingResponse updateListing(Long id, UpdateListingRequest request) {
        Listing listing = findOwned(id);
        if (request.title() != null) listing.setTitle(request.title().trim());
        if (request.description() != null) listing.setDescription(request.description());
        if (request.photos() != null) listing.setPhotos(new ArrayList<>(request.photos()));
        if (request.type() != null) listing.setType(request.type());
        if (request.price() != null) listing.setPrice(request.price());
        if (request.rentPrice() != null) listing.setRentPrice(request.rentPrice());
        if (request.rentDuration() != null) listing.setRentDuration(request.rentDuration());
        if (request.deposit() != null) listing.setDeposit(request.deposit());
        if (request.condition() != null) listing.setCondition(request.condition());
        if (request.availability() != null) listing.setAvailability(request.availability());
        if (request.domain() != null) {
            Domain domain = domainRepository.findById(request.domain())
                    .orElseThrow(() -> new NotFoundException("Domain not found"));
            listing.setDomain(domain);
        }
        if (request.category() != null) listing.setCategory(request.category());
        if (request.subcategory() != null) listing.setSubcategory(request.subcategory());
        if (request.tags() != null) listing.setTags(normalizeTags(request.tags()));
        if (request.location() != null) listing.setLocation(request.location());
        listingRepository.save(listing);
        return mapper.toListingResponse(listing);
    }

    @Transactional
    public Map<String, Object> deleteListing(Long id) {
        Listing listing = findOwned(id);
        listingRepository.delete(listing);
        return Map.of("message", "Listing removed");
    }

    @Transactional
    public ListingResponse updateStatus(Long id, StatusUpdateRequest request) {
        Listing listing = findOwned(id);
        if (request.status() == null) {
            throw new com.campuscycle.exception.BadRequestException("Status is required");
        }
        listing.setStatus(request.status());
        listingRepository.save(listing);
        return mapper.toListingResponse(listing);
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getMyListings() {
        Long userId = currentUserService.currentUserId();
        return listingRepository.findByOwnerIdOrderByCreatedAtDesc(userId).stream()
                .map(mapper::toListingResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getListingsByDomain(Long domainId) {
        return listingRepository.findByDomainIdAndStatusOrderByCreatedAtDesc(domainId, ListingStatus.AVAILABLE)
                .stream().map(mapper::toListingResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getListingsForUser(Long userId) {
        return listingRepository.findByOwnerIdOrderByCreatedAtDesc(userId).stream()
                .map(mapper::toListingResponse).toList();
    }

    private Listing findOwned(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Listing not found"));
        if (!listing.getOwner().getId().equals(currentUserService.currentUserId())) {
            throw new ForbiddenException("Not authorized");
        }
        return listing;
    }

    private List<String> normalizeTags(List<String> tags) {
        if (tags == null) {
            return new ArrayList<>();
        }
        return tags.stream()
                .filter(Objects::nonNull)
                .map(tag -> tag.toLowerCase().trim())
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
    }

    static String slugify(String value) {
        return value.toLowerCase().trim().replaceAll("\\s+", "-");
    }

    private Sort parseSort(String sort) {
        if (sort == null || sort.isBlank() || sort.equals("-createdAt")) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        boolean desc = sort.startsWith("-");
        String property = desc ? sort.substring(1) : sort;
        if (!SORTABLE.contains(property)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        return Sort.by(desc ? Sort.Direction.DESC : Sort.Direction.ASC, property);
    }
}
