package com.voin.dto.request;

import com.voin.constant.StoryType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 일기(또는 사례 돌아보기) 내용과 GPT가 분류한 키워드로
 * 스토리·카드를 생성하고 코인 보유량을 증가시키는 요청.
 */
@Data
@Schema(description = "일기 기반 코인(카드) 생성 요청")
public class DiaryCardRequest {

    @Schema(description = "스토리 타입", example = "DAILY_DIARY")
    @NotNull(message = "스토리 타입은 필수입니다")
    private StoryType storyType;

    @Schema(description = "일기 본문(분류에 사용된 원문)", example = "오늘은 정말 좋은 하루였다...")
    @NotBlank(message = "내용은 필수입니다")
    private String content;

    @Schema(description = "선택된 키워드 ID (이 키워드가 속한 코인이 지급됨)", example = "1")
    @NotNull(message = "키워드 ID는 필수입니다")
    private Long keywordId;

    @Schema(description = "한마디 코멘트(선택)", example = "이 순간을 기억하고 싶다")
    private String comment;

    @Schema(description = "공개 여부", example = "false")
    private Boolean isPublic = false;
}
