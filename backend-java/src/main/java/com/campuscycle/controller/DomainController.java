package com.campuscycle.controller;

import com.campuscycle.service.DomainService;
import com.campuscycle.service.dto.DomainDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/domains")
public class DomainController {

    private final DomainService domainService;

    public DomainController(DomainService domainService) {
        this.domainService = domainService;
    }

    @GetMapping
    public ResponseEntity<List<DomainDto>> getAll() {
        return ResponseEntity.ok(domainService.getAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<DomainDto> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(domainService.getBySlug(slug));
    }
}
