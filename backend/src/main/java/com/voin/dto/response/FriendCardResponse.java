package com.voin.dto.response;

import com.voin.entity.Card;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "친구 카드 응답 DTO")
public class FriendCardResponse {
    
    @Schema(description = "카드 ID")
    private Long cardId;
    
    @Schema(description = "작성자 ID")
    private String memberId;
    
    @Schema(description = "작성자 닉네임")
    private String memberNickname;
    
    @Schema(description = "작성자 프로필 이미지")
    private String memberProfileImage;

    @Schema(description = "카드 내용(메시지)")
    private String content;

    @Schema(description = "코인(카테고리) 이름")
    private String coinType;

    @Schema(description = "코인 색상")
    private String coinColor;

    @Schema(description = "키워드 이름")
    private String keywordName;

    @Schema(description = "첨부 이미지 URL")
    private String imageUrl;

    @Schema(description = "좋아요 수")
    private long likeCount;

    @Schema(description = "내가 좋아요 눌렀는지")
    private boolean likedByMe;

    @Schema(description = "생성 시간")
    private LocalDateTime createdAt;
}