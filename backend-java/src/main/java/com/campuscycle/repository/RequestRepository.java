package com.campuscycle.repository;

import com.campuscycle.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long>, JpaSpecificationExecutor<Request> {

    List<Request> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);
}
