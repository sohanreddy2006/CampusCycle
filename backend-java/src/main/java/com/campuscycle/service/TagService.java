package com.campuscycle.service;

import com.campuscycle.dto.ListingDtos.ListingResponse;
import com.campuscycle.dto.TagDtos.CreateTagRequest;
import com.campuscycle.dto.TagDtos.TagFollowResponse;
import com.campuscycle.dto.TagDtos.TagResponse;
import com.campuscycle.dto.TagDtos.TagWithListingsResponse;
import com.campuscycle.entity.ListingStatus;
import com.campuscycle.entity.Tag;
import com.campuscycle.entity.User;
import com.campuscycle.exception.NotFoundException;
import com.campuscycle.repository.ListingRepository;
import com.campuscycle.repository.TagRepository;
import com.campuscycle.repository.UserRepository;
import com.campuscycle.security.CurrentUserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final MappingHelper mapper;

    public TagService(TagRepository tagRepository, ListingRepository listingRepository,
                      UserRepository userRepository, CurrentUserService currentUserService, MappingHelper mapper) {
        this.tagRepository = tagRepository;
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getPopularTags() {
        return tagRepository.findTop20ByOrderByCountDesc().stream().map(mapper::toTagResponse).toList();
    }

    @Transactional(readOnly = true)
    public TagWithListingsResponse getTagBySlug(String slug) {
        Tag tag = tagRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Tag not found"));
        List<ListingResponse> listings = listingRepository
                .findByTagNameAndStatusOrderByCreatedAtDesc(tag.getName(), ListingStatus.AVAILABLE)
                .stream().map(mapper::toListingResponse).toList();
        return new TagWithListingsResponse(mapper.toTagResponse(tag), listings);
    }

    @Transactional
    public TagFollowResponse toggleFollow(Long id) {
        User user = userRepository.findById(currentUserService.currentUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag not found"));

        boolean followed;
        if (user.getFollowedTags().contains(tag)) {
            user.getFollowedTags().remove(tag);
            tag.getFollowers().remove(user);
            followed = false;
        } else {
            user.getFollowedTags().add(tag);
            tag.getFollowers().add(user);
            followed = true;
        }
        userRepository.save(user);
        tagRepository.save(tag);
        return new TagFollowResponse(followed, tag.getFollowers().size());
    }

    @Transactional(readOnly = true)
    public List<TagResponse> searchTags(String query) {
        return tagRepository.searchByName(query, PageRequest.of(0, 10))
                .stream().map(mapper::toTagResponse).toList();
    }

    public record CreateTagResult(TagResponse tag, boolean created) {
    }

    @Transactional
    public CreateTagResult createTag(CreateTagRequest request) {
        User user = userRepository.findById(currentUserService.currentUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        String name = request.name().toLowerCase().trim();

        Tag existing = tagRepository.findByName(name).orElse(null);
        if (existing != null) {
            return new CreateTagResult(mapper.toTagResponse(existing), false);
        }

        Tag tag = new Tag();
        tag.setName(name);
        tag.setSlug(ListingService.slugify(name));
        tag.getFollowers().add(user);
        tagRepository.save(tag);

        user.getFollowedTags().add(tag);
        userRepository.save(user);

        return new CreateTagResult(mapper.toTagResponse(tag), true);
    }
}
