package com.campuscycle.service;

import com.campuscycle.dto.RequestDtos.CreateRequestRequest;
import com.campuscycle.dto.RequestDtos.FulfillRequestRequest;
import com.campuscycle.dto.RequestDtos.RequestPageResponse;
import com.campuscycle.dto.RequestDtos.RequestResponse;
import com.campuscycle.dto.RequestDtos.UpdateRequestRequest;
import com.campuscycle.entity.Domain;
import com.campuscycle.entity.Listing;
import com.campuscycle.entity.Request;
import com.campuscycle.entity.RequestStatus;
import com.campuscycle.entity.RequestType;
import com.campuscycle.entity.User;
import com.campuscycle.exception.BadRequestException;
import com.campuscycle.exception.ForbiddenException;
import com.campuscycle.exception.NotFoundException;
import com.campuscycle.repository.DomainRepository;
import com.campuscycle.repository.ListingRepository;
import com.campuscycle.repository.RequestRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Service
public class RequestService {

    private static final Set<String> SORTABLE = Set.of("createdAt", "updatedAt", "title", "requiredDate");

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final DomainRepository domainRepository;
    private final ListingRepository listingRepository;
    private final CurrentUserService currentUserService;
    private final MappingHelper mapper;

    public RequestService(RequestRepository requestRepository, UserRepository userRepository,
                          DomainRepository domainRepository, ListingRepository listingRepository,
                          CurrentUserService currentUserService, MappingHelper mapper) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.domainRepository = domainRepository;
        this.listingRepository = listingRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Transactional
    public RequestResponse createRequest(CreateRequestRequest request) {
        User requester = userRepository.findById(currentUserService.currentUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Request entity = new Request();
        entity.setRequester(requester);
        entity.setTitle(request.title().trim());
        entity.setDescription(request.description());
        entity.setType(request.type());
        entity.setRequiredDate(parseDate(request.requiredDate()));
        entity.setDuration(request.duration());
        if (request.domain() != null) {
            Domain domain = domainRepository.findById(request.domain())
                    .orElseThrow(() -> new NotFoundException("Domain not found"));
            entity.setDomain(domain);
        }
        entity.setCategory(request.category());
        entity.setTags(normalizeTags(request.tags()));
        requestRepository.save(entity);
        return mapper.toRequestResponse(entity);
    }

    @Transactional(readOnly = true)
    public RequestPageResponse getRequests(String search, String type, Long domain, String category, String status,
                                           Integer page, Integer limit, String sort) {
        int currentPage = page == null || page < 1 ? 1 : page;
        int currentLimit = limit == null || limit < 1 ? 12 : limit;
        String currentStatus = status == null || status.isBlank() ? "active" : status;

        Specification<Request> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), RequestStatus.fromValue(currentStatus)));

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
                predicates.add(cb.equal(root.get("type"), RequestType.fromValue(type)));
            }
            if (domain != null) {
                predicates.add(cb.equal(root.get("domain").get("id"), domain));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sortOrder;
        if (sort == null || sort.isBlank() || sort.equals("-createdAt")) {
            sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        } else {
            boolean desc = sort.startsWith("-");
            String property = desc ? sort.substring(1) : sort;
            sortOrder = SORTABLE.contains(property)
                    ? Sort.by(desc ? Sort.Direction.DESC : Sort.Direction.ASC, property)
                    : Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Page<Request> result = requestRepository.findAll(spec, PageRequest.of(currentPage - 1, currentLimit, sortOrder));
        List<RequestResponse> requests = result.getContent().stream().map(mapper::toRequestResponse).toList();
        return new RequestPageResponse(requests, result.getTotalPages(), result.getNumber() + 1, result.getTotalElements());
    }

    @Transactional(readOnly = true)
    public RequestResponse getRequest(Long id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Request not found"));
        return mapper.toRequestResponse(request);
    }

    @Transactional
    public RequestResponse updateRequest(Long id, UpdateRequestRequest request) {
        Request entity = findOwned(id);
        if (request.title() != null) entity.setTitle(request.title().trim());
        if (request.description() != null) entity.setDescription(request.description());
        if (request.type() != null) entity.setType(request.type());
        if (request.requiredDate() != null) entity.setRequiredDate(parseDate(request.requiredDate()));
        if (request.duration() != null) entity.setDuration(request.duration());
        if (request.domain() != null) {
            Domain domain = domainRepository.findById(request.domain())
                    .orElseThrow(() -> new NotFoundException("Domain not found"));
            entity.setDomain(domain);
        }
        if (request.category() != null) entity.setCategory(request.category());
        if (request.tags() != null) entity.setTags(normalizeTags(request.tags()));
        if (request.status() != null) entity.setStatus(request.status());
        requestRepository.save(entity);
        return mapper.toRequestResponse(entity);
    }

    @Transactional
    public Map<String, Object> deleteRequest(Long id) {
        Request entity = findOwned(id);
        requestRepository.delete(entity);
        return Map.of("message", "Request removed");
    }

    @Transactional(readOnly = true)
    public List<RequestResponse> getMyRequests() {
        return requestRepository.findByRequesterIdOrderByCreatedAtDesc(currentUserService.currentUserId())
                .stream().map(mapper::toRequestResponse).toList();
    }

    @Transactional
    public RequestResponse fulfillRequest(Long id, FulfillRequestRequest request) {
        Request entity = requestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Request not found"));
        entity.setStatus(RequestStatus.FULFILLED);
        if (request != null && request.listingId() != null) {
            Listing listing = listingRepository.findById(request.listingId())
                    .orElseThrow(() -> new NotFoundException("Listing not found"));
            entity.setMatchedListing(listing);
        }
        requestRepository.save(entity);
        return mapper.toRequestResponse(entity);
    }

    private Request findOwned(Long id) {
        Request entity = requestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Request not found"));
        if (!entity.getRequester().getId().equals(currentUserService.currentUserId())) {
            throw new ForbiddenException("Not authorized");
        }
        return entity;
    }

    private LocalDateTime parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value).atStartOfDay();
        } catch (Exception ex) {
            try {
                return LocalDateTime.parse(value);
            } catch (Exception ex2) {
                throw new BadRequestException("Invalid requiredDate");
            }
        }
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
}
