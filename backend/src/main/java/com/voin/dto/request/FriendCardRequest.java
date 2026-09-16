package com.voin.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 친구에게 보내는 장점 카드 생성 요청.
 * 보낸 사람(sender)이 받는 친구(receiver)의 장점을 상황/행동/느낌으로 적고 키워드를 지정한다.
 */
@Data
@Schema(description = "친구 장점 카드 생성 요청")
public class FriendCardRequest {

    @Schema(description = "받는 친구 회원 ID(UUID)")
    @NotBlank(message = "받는 친구는 필수입니다")
    private String receiverId;

    @Schema(description = "상황 맥락(S1)", example = "인간관계 속 대화, 행동")
    private String situationContext;

    @Schema(description = "구체적인 행동(S2)")
    @NotBlank(message = "행동 내용은 필수입니다")
    private String action;

    @Schema(description = "느낀 점/생각(S3)")
    private String feeling;

    @Schema(description = "선택된 키워드 ID(S4)")
    @NotNull(message = "키워드 ID는 필수입니다")
    private Long keywordId;

    @Schema(description = "전하고 싶은 메시지(S6, 선택)")
    private String message;

    @Schema(description = "첨부 이미지(base64 data URL, 선택)")
    private String imageUrl;

    @Schema(description = "핵심 한 줄 요약(선택)")
    private String summary;

    @Schema(description = "공개 여부(기본 true — 친구 피드 노출)", example = "true")
    private Boolean isPublic = true;
}
