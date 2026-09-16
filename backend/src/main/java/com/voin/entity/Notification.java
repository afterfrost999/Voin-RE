package com.voin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 사용자 알림 (친구 요청/수락, 카드 수신, 좋아요 등).
 */
@Entity
@Table(name = "notifications",
       indexes = { @Index(name = "idx_notification_recipient", columnList = "recipient_id") })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "recipient_id", nullable = false, columnDefinition = "uuid")
    private UUID recipientId;

    /** FRIEND_REQUEST, FRIEND_ACCEPTED, CARD_RECEIVED, CARD_LIKED */
    @Column(name = "type", nullable = false, length = 30)
    private String type;

    @Column(name = "message", nullable = false, length = 255)
    private String message;

    /** 이동 대상 종류: card | friends (null 가능) */
    @Column(name = "link_type", length = 20)
    private String linkType;

    /** 이동 대상 식별자(예: cardId) */
    @Column(name = "link_id")
    private Long linkId;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public void markRead() {
        this.isRead = true;
    }
}
