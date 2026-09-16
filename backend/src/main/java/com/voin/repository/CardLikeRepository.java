package com.voin.repository;

import com.voin.entity.CardLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CardLikeRepository extends JpaRepository<CardLike, Long> {

    Optional<CardLike> findByMemberIdAndCardId(UUID memberId, Long cardId);

    long countByCardId(Long cardId);

    /** 여러 카드의 좋아요 수: [cardId, count] */
    @Query("SELECT cl.cardId, COUNT(cl) FROM CardLike cl WHERE cl.cardId IN :cardIds GROUP BY cl.cardId")
    List<Object[]> countByCardIds(@Param("cardIds") List<Long> cardIds);

    /** 내가 좋아요한 카드 ID 목록(주어진 카드들 중) */
    @Query("SELECT cl.cardId FROM CardLike cl WHERE cl.memberId = :memberId AND cl.cardId IN :cardIds")
    List<Long> findLikedCardIds(@Param("memberId") UUID memberId, @Param("cardIds") List<Long> cardIds);
}
