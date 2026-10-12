package com.campuscycle.service;

import com.campuscycle.dto.ReservationDtos.CreateReservationRequest;
import com.campuscycle.dto.ReservationDtos.MessageResponse;
import com.campuscycle.dto.ReservationDtos.ReservationResponse;
import com.campuscycle.entity.Listing;
import com.campuscycle.entity.ListingStatus;
import com.campuscycle.entity.ListingType;
import com.campuscycle.entity.Notification;
import com.campuscycle.entity.Reservation;
import com.campuscycle.entity.ReservationStatus;
import com.campuscycle.entity.User;
import com.campuscycle.exception.BadRequestException;
import com.campuscycle.exception.ForbiddenException;
import com.campuscycle.exception.NotFoundException;
import com.campuscycle.repository.ListingRepository;
import com.campuscycle.repository.NotificationRepository;
import com.campuscycle.repository.ReservationRepository;
import com.campuscycle.repository.UserRepository;
import com.campuscycle.security.CurrentUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;
    private final MappingHelper mapper;

    public ReservationService(ReservationRepository reservationRepository, ListingRepository listingRepository,
                              UserRepository userRepository, NotificationRepository notificationRepository,
                              CurrentUserService currentUserService, MappingHelper mapper) {
        this.reservationRepository = reservationRepository;
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Transactional
    public ReservationResponse createReservation(CreateReservationRequest request) {
        User user = userRepository.findById(currentUserService.currentUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Listing listing = listingRepository.findById(request.listingId())
                .orElseThrow(() -> new NotFoundException("Listing not found"));

        if (listing.getStatus() != ListingStatus.AVAILABLE) {
            throw new BadRequestException("Listing is not available");
        }
        if (listing.getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("Cannot reserve your own listing");
        }
        if (reservationRepository.findFirstByListingIdAndUserIdAndStatus(listing.getId(), user.getId(), ReservationStatus.ACTIVE).isPresent()) {
            throw new BadRequestException("You already have an active reservation");
        }

        int days = request.duration() == null ? 3 : request.duration();
        Reservation reservation = new Reservation();
        reservation.setListing(listing);
        reservation.setUser(user);
        reservation.setExpiresAt(LocalDateTime.now().plusDays(days));
        reservation.setStatus(ReservationStatus.ACTIVE);
        reservationRepository.save(reservation);

        listing.setStatus(ListingStatus.RESERVED);
        listing.setReservedBy(user);
        listing.setReservedUntil(reservation.getExpiresAt());
        listingRepository.save(listing);

        Notification notification = new Notification();
        notification.setUser(listing.getOwner());
        notification.setType("reservation");
        notification.setTitle("Item Reserved");
        notification.setMessage(user.getName() + " reserved your listing \"" + listing.getTitle() + "\"");
        notification.setLink("/listing/" + listing.getId());
        notificationRepository.save(notification);

        return mapper.toReservationResponse(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getMyReservations() {
        return reservationRepository.findByUserIdAndStatusInOrderByCreatedAtDesc(
                        currentUserService.currentUserId(),
                        List.of(ReservationStatus.ACTIVE, ReservationStatus.EXPIRED))
                .stream().map(mapper::toReservationResponse).toList();
    }

    @Transactional
    public MessageResponse cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));
        if (!reservation.getUser().getId().equals(currentUserService.currentUserId())) {
            throw new ForbiddenException("Not authorized");
        }

        reservation.setStatus(ReservationStatus.EXPIRED);
        reservationRepository.save(reservation);

        Listing listing = reservation.getListing();
        listing.setStatus(ListingStatus.AVAILABLE);
        listing.setReservedBy(null);
        listing.setReservedUntil(null);
        listingRepository.save(listing);

        return new MessageResponse("Reservation cancelled");
    }

    @Transactional
    public MessageResponse completeReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));
        Long currentUserId = currentUserService.currentUserId();

        Listing listing = reservation.getListing();
        boolean isOwner = listing.getOwner().getId().equals(currentUserId);
        boolean isRenter = reservation.getUser().getId().equals(currentUserId);
        if (!isOwner && !isRenter) {
            throw new ForbiddenException("Not authorized");
        }

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);

        if (listing.getType() == ListingType.SELL) {
            listing.setStatus(ListingStatus.SOLD);
        } else if (listing.getType() == ListingType.RENT || listing.getType() == ListingType.LEND) {
            listing.setStatus(ListingStatus.AVAILABLE);
        }
        listing.setReservedBy(null);
        listing.setReservedUntil(null);
        listingRepository.save(listing);

        User recipient = isOwner ? reservation.getUser() : listing.getOwner();
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setType("transaction");
        notification.setTitle("Transaction Completed");
        notification.setMessage("The transaction for \"" + listing.getTitle() + "\" has been completed");
        notification.setLink("/listing/" + listing.getId());
        notificationRepository.save(notification);

        return new MessageResponse("Reservation completed");
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getListingReservations(Long listingId) {
        return reservationRepository.findByListingIdAndStatus(listingId, ReservationStatus.ACTIVE)
                .stream().map(mapper::toReservationResponse).toList();
    }
}
