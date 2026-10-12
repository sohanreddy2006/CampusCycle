package com.campuscycle.repository;

import com.campuscycle.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DomainRepository extends JpaRepository<Domain, Long> {

    Optional<Domain> findBySlug(String slug);
}
