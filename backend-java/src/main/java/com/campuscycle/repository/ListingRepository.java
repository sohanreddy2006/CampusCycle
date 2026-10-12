package com.campuscycle.repository;

import com.campuscycle.entity.Listing;
import com.campuscycle.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long>, JpaSpecificationExecutor<Listing> {

    List<Listing> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<Listing> findByOwnerIdAndStatusInOrderByUpdatedAtDesc(Long ownerId, List<ListingStatus> statuses);

    List<Listing> findByDomainIdAndStatusOrderByCreatedAtDesc(Long domainId, ListingStatus status);

    @Query("SELECT DISTINCT l FROM Listing l JOIN l.tags t WHERE t = :tag AND l.status = :status ORDER BY l.createdAt DESC")
    List<Listing> findByTagNameAndStatusOrderByCreatedAtDesc(@Param("tag") String tag, @Param("status") ListingStatus status);
}
