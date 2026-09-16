package com.voin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 카드 좋아요. 한 회원이 한 카드에 한 번만 좋아요할 수 있다(member_id, card_id 유니크).
 */
@Entity
@Table(name = "card_likes",
       uniqueConstraints = @UniqueConstraint(name = "uk_card_like", columnNames = {"member_id", "card_id"}),
       indexes = { @Index(name = "idx_card_like_card_id", columnList = "card_id") })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class CardLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "member_id", nullable = false, columnDefinition = "uuid")
    private UUID memberId;

    @Column(name = "card_id", nullable = false)
    private Long cardId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public static CardLike of(UUID memberId, Long cardId) {
        return CardLike.builder().memberId(memberId).cardId(cardId).build();
    }
}
