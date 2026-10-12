package com.campuscycle.service;

import com.campuscycle.dto.NotificationDtos.NotificationPageResponse;
import com.campuscycle.dto.NotificationDtos.NotificationResponse;
import com.campuscycle.dto.UserDtos;
import com.campuscycle.dto.UserDtos.MessageOnlyResponse;
import com.campuscycle.entity.Notification;
import com.campuscycle.repository.NotificationRepository;
import com.campuscycle.security.CurrentUserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;
    private final MappingHelper mapper;

    public NotificationService(NotificationRepository notificationRepository,
                               CurrentUserService currentUserService, MappingHelper mapper) {
        this.notificationRepository = notificationRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public NotificationPageResponse getNotifications(Integer page, Integer limit) {
        Long userId = currentUserService.currentUserId();
        int currentPage = page == null || page < 1 ? 1 : page;
        int currentLimit = limit == null || limit < 1 ? 20 : limit;

        List<NotificationResponse> notifications = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(currentPage - 1, currentLimit))
                .stream().map(mapper::toNotificationResponse).toList();
        long total = notificationRepository.countByUserId(userId);
        long unread = notificationRepository.countByUserIdAndReadFalse(userId);
        long totalPages = currentLimit == 0 ? 0 : (total + currentLimit - 1) / currentLimit;
        return new NotificationPageResponse(notifications, total, unread, totalPages);
    }

    @Transactional(readOnly = true)
    public UserDtos.CountResponse getUnreadCount() {
        long count = notificationRepository.countByUserIdAndReadFalse(currentUserService.currentUserId());
        return new UserDtos.CountResponse(count);
    }

    @Transactional
    public MessageOnlyResponse markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
        return new MessageOnlyResponse("Notification marked as read");
    }

    @Transactional
    public MessageOnlyResponse markAllAsRead() {
        notificationRepository.markAllAsRead(currentUserService.currentUserId());
        return new MessageOnlyResponse("All notifications marked as read");
    }

    @Transactional
    public MessageOnlyResponse deleteNotification(Long id) {
        notificationRepository.deleteById(id);
        return new MessageOnlyResponse("Notification deleted");
    }
}
