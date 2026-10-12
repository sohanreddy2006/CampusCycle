package com.campuscycle.controller;

import com.campuscycle.dto.NotificationDtos.NotificationPageResponse;
import com.campuscycle.dto.UserDtos.CountResponse;
import com.campuscycle.dto.UserDtos.MessageOnlyResponse;
import com.campuscycle.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<NotificationPageResponse> getNotifications(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer limit) {
        return ResponseEntity.ok(notificationService.getNotifications(page, limit));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<CountResponse> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getUnreadCount());
    }

    @PutMapping("/read-all")
    public ResponseEntity<MessageOnlyResponse> markAllAsRead() {
        return ResponseEntity.ok(notificationService.markAllAsRead());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<MessageOnlyResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageOnlyResponse> deleteNotification(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.deleteNotification(id));
    }
}
