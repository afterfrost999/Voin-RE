package com.voin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberUpdateRequest {

    @NotBlank(message = "닉네임은 필수입니다")
    @Size(min = 2, max = 50, message = "닉네임은 2자 이상 50자 이하여야 합니다")
    private String nickname;

    // base64 data URL(대용량)로 들어올 수 있어 길이 제약을 두지 않는다.
    // 서버에서 파일로 저장 후 짧은 URL(/images/profiles/...)로 정규화되어 DB 에 저장됨.
    private String profileImage;
} 