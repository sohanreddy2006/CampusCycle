package com.campuscycle.repository;

import com.campuscycle.entity.Reservation;
import com.campuscycle.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findFirstByListingIdAndUserIdAndStatus(Long listingId, Long userId, ReservationStatus status);

    Optional<Reservation> findFirstByUserIdAndStatus(Long userId, ReservationStatus status);

    List<Reservation> findByUserIdAndStatusInOrderByCreatedAtDesc(Long userId, List<ReservationStatus> statuses);

    List<Reservation> findByListingIdAndStatus(Long listingId, ReservationStatus status);
}
