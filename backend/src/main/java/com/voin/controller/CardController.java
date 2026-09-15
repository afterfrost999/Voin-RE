package com.voin.controller;

import com.voin.dto.request.CardCreateRequest;
import com.voin.dto.request.CardVisibilityUpdateRequest;
import com.voin.dto.request.DiaryCardRequest;
import com.voin.dto.response.ApiResponse;
import com.voin.dto.response.CardResponse;
import com.voin.entity.Card;
import com.voin.service.CardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
@Tag(name = "🪙 Card", description = "장점 카드 생성 및 관리")
public class CardController {

    private final CardService cardService;

    /**
     * 새로운 카드 생성
     */
    @Operation(summary = "카드 생성", description = "스토리와 선택한 코인/키워드로 새로운 카드를 생성합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<CardResponse>> createCard(
            @Valid @RequestBody CardCreateRequest request) {
        log.info("Creating new card: storyId={}, coinId={}", request.getStoryId(), request.getCoinId());
        CardResponse card = cardService.createCardFromStory(request);
        return ResponseEntity.ok(ApiResponse.success("카드가 생성되었습니다.", card));
    }

    /**
     * 일기 기반 코인 획득 (핵심 루프): 스토리·카드 생성 + 코인 보유량 증가
     */
    @Operation(summary = "일기로 코인 획득", description = "일기 내용과 선택 키워드로 스토리·카드를 생성하고 코인 보유량을 증가시킵니다.")
    @PostMapping("/from-diary")
    public ResponseEntity<ApiResponse<CardResponse>> acquireCoinFromDiary(
            @Valid @RequestBody DiaryCardRequest request) {
        log.info("Acquiring coin from diary: keywordId={}", request.getKeywordId());
        CardResponse card = cardService.acquireCoinFromDiary(request);
        return ResponseEntity.ok(ApiResponse.success("코인을 획득했습니다.", card));
    }

    /**
     * 특정 카드 조회
     */
    @Operation(summary = "카드 조회", description = "카드 ID로 특정 카드를 조회합니다.")
    @GetMapping("/{cardId}")
    public ResponseEntity<ApiResponse<CardResponse>> getCard(
            @Parameter(description = "카드 ID") @PathVariable Long cardId) {
        log.info("Getting card: id={}", cardId);
        CardResponse card = cardService.getCard(cardId);
        return ResponseEntity.ok(ApiResponse.success("카드를 조회했습니다.", card));
    }

    /**
     * 아카이브: 내가 작성한 카드 / 타인이 작성한(받은) 카드 목록
     */
    @Operation(summary = "카드 아카이브", description = "내가 작성한 카드와 타인이 작성한(받은) 카드 목록을 함께 반환합니다.")
    @GetMapping("/archive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getArchive() {
        log.info("Getting card archive");
        return ResponseEntity.ok(ApiResponse.success("카드 아카이브를 조회했습니다.", cardService.getArchive()));
    }

    /**
     * 내 카드 목록 조회
     */
    @Operation(summary = "내 카드 목록", description = "현재 사용자가 소유한 모든 카드를 조회합니다.")
    @GetMapping("/my-cards")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyCards() {
        log.info("Getting my cards");
        List<Map<String, Object>> cards = cardService.getMyCardsWithStoryData();
        return ResponseEntity.ok(ApiResponse.success("내 카드 목록을 조회했습니다.", cards));
    }

    /**
     * 공개 카드 목록 조회 (페이징)
     */
    @Operation(summary = "공개 카드 목록", description = "모든 공개 카드를 페이징으로 조회합니다.")
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Page<CardResponse>>> getPublicCards(
            @Parameter(description = "페이징 정보") Pageable pageable) {
        log.info("Getting public cards with pagination");
        Page<CardResponse> cards = cardService.getPublicCards(pageable);
        return ResponseEntity.ok(ApiResponse.success("공개 카드 목록을 조회했습니다.", cards));
    }

    /**
     * 카드 공개/비공개 설정
     */
    @Operation(summary = "카드 공개 설정", description = "카드의 공개/비공개 상태를 변경합니다.")
    @PutMapping("/{cardId}/visibility")
    public ResponseEntity<ApiResponse<CardResponse>> updateCardVisibility(
            @Parameter(description = "카드 ID") @PathVariable Long cardId,
            @Valid @RequestBody CardVisibilityUpdateRequest request) {
        log.info("Updating card visibility: id={}, isPublic={}", cardId, request.getIsPublic());
        CardResponse card = cardService.updateCardVisibility(cardId, request.getIsPublic());
        return ResponseEntity.ok(ApiResponse.success("카드 공개 설정이 변경되었습니다.", card));
    }

    /**
     * 카드 삭제
     */
    @Operation(summary = "카드 삭제", description = "특정 카드를 삭제합니다.")
    @DeleteMapping("/{cardId}")
    public ResponseEntity<ApiResponse<Void>> deleteCard(
            @Parameter(description = "카드 ID") @PathVariable Long cardId) {
        log.info("Deleting card: id={}", cardId);
        cardService.deleteCard(cardId);
        return ResponseEntity.ok(ApiResponse.<Void>success("카드가 삭제되었습니다.", null));
    }
} 