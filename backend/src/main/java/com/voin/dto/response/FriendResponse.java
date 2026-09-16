package com.voin.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

/**
 * 친구(수락된 관계) 목록 항목.
 */
@Getter
@Builder
@Schema(description = "친구 정보")
public class FriendResponse {

    @Schema(description = "친구 회원 ID")
    private String memberId;

    @Schema(description = "닉네임")
    private String nickname;

    @Schema(description = "프로필 이미지 URL")
    private String profileImage;
}
