package com.voin.service;

import com.voin.dto.response.NotificationDto;
import com.voin.dto.response.NotificationResponse;
import com.voin.entity.Notification;
import com.voin.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    public void sendToUser(String memberId, NotificationDto payload) {
        // 클라이언트가 구독하는 경로: /user/queue/notifications
        messagingTemplate.convertAndSendToUser(memberId, "/queue/notifications", payload);
    }

    private UUID currentMemberId() {
        return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    /** 알림 생성 (수신자에게). 이벤트 발생 지점에서 호출한다. */
    @Transactional
    public void create(UUID recipientId, String type, String message, String linkType, Long linkId) {
        if (recipientId == null) return;
        notificationRepository.save(Notification.builder()
                .recipientId(recipientId)
                .type(type)
                .message(message)
                .linkType(linkType)
                .linkId(linkId)
                .build());
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications() {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(currentMemberId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByRecipientIdAndIsReadFalse(currentMemberId());
    }

    @Transactional
    public void markAllRead() {
        notificationRepository.markAllReadByRecipient(currentMemberId());
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .message(n.getMessage())
                .linkType(n.getLinkType())
                .linkId(n.getLinkId())
                .isRead(Boolean.TRUE.equals(n.getIsRead()))
                .createdAt(n.getCreatedAt())
                .build();
    }
}
