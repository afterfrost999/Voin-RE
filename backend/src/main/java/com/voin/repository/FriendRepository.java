package com.voin.repository;

import com.voin.constant.FriendStatus;
import com.voin.entity.Friend;
import com.voin.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    
    boolean existsByFromMemberAndToMemberAndStatus(Member fromMember, Member toMember, FriendStatus status);
    
    List<Friend> findByToMemberAndStatus(Member toMember, FriendStatus status);
    
    // 내가 속한 수락된 친구 관계 행들. 상대방 산출은 서비스(자바)에서 처리한다.
    // (CASE 로 엔티티를 반환하던 기존 쿼리는 Hibernate 에서 빈 결과가 나오는 문제가 있었음)
    @Query("SELECT f FROM Friend f " +
           "WHERE (f.fromMember = :member OR f.toMember = :member) " +
           "AND f.status = com.voin.constant.FriendStatus.ACCEPTED")
    List<Friend> findAcceptedRelations(@Param("member") Member member);

    @Query("SELECT f FROM Friend f " +
            "WHERE f.status = com.voin.constant.FriendStatus.ACCEPTED AND " +
            "((f.fromMember.id = :memberId1 AND f.toMember.id = :memberId2) OR " +
            " (f.fromMember.id = :memberId2 AND f.toMember.id = :memberId1))")
    Optional<Friend> findAcceptedFriendBetween(UUID memberId1, UUID memberId2);

} 