package com.campuscycle.service;

import com.campuscycle.dto.ListingDtos.DomainSummary;
import com.campuscycle.entity.Domain;
import com.campuscycle.exception.NotFoundException;
import com.campuscycle.repository.DomainRepository;
import com.campuscycle.service.dto.DomainDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class DomainService {

    private final DomainRepository domainRepository;

    public DomainService(DomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    @Transactional(readOnly = true)
    public List<DomainDto> getAll() {
        return domainRepository.findAll().stream()
                .sorted(Comparator.comparing(Domain::getName))
                .map(DomainService::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public DomainDto getBySlug(String slug) {
        Domain domain = domainRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Domain not found"));
        return toDto(domain);
    }

    static DomainDto toDto(Domain domain) {
        return new DomainDto(domain.getId(), domain.getName(), domain.getSlug(), domain.getIcon(),
                domain.getCategories());
    }
}
