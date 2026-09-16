package com.voin.controller;

import com.voin.dto.request.FriendRequestDto;
import com.voin.dto.response.ApiResponse;
import com.voin.dto.response.FriendRequestResponse;
import com.voin.dto.response.FriendCardResponse;
import com.voin.dto.response.FriendResponse;
import com.voin.service.FriendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friends")
@Tag(name = "👥 Friend", description = "친구 관련 API")
public class FriendController {

    private final FriendService friendService;

    /**
     * 내 친구 목록 조회
     */
    @Operation(summary = "내 친구 목록", description = "수락된 친구 목록을 조회합니다.")
    @GetMapping
    public ApiResponse<List<FriendResponse>> getFriends() {
        return ApiResponse.success(friendService.getFriends());
    }

    /**
     * 친구 요청 보내기
     */
    @Operation(summary = "친구 요청 보내기", description = "친구 코드를 사용하여 다른 사용자에게 친구 요청을 보냅니다.")
    @PostMapping("/request")
    public ApiResponse<FriendRequestResponse> sendFriendRequest(
            @RequestBody FriendRequestDto request) {
        return ApiResponse.success(friendService.sendFriendRequest(request.getFriendCode()));
    }

    /**
     * 받은 친구 요청 목록 조회
     */
    @Operation(summary = "받은 친구 요청 목록", description = "현재 사용자가 받은 친구 요청 목록을 조회합니다.")
    @GetMapping("/requests/received")
    public ApiResponse<List<FriendRequestResponse>> getReceivedFriendRequests() {
        return ApiResponse.success(friendService.getReceivedFriendRequests());
    }

    /**
     * 친구 요청 수락
     */
    @Operation(summary = "친구 요청 수락", description = "받은 친구 요청을 수락합니다.")
    @PostMapping("/requests/{requestId}/accept")
    public ApiResponse<FriendRequestResponse> acceptFriendRequest(
            @PathVariable Long requestId) {
        return ApiResponse.success(friendService.acceptFriendRequest(requestId));
    }

    /**
     * 친구 요청 거절
     */
    @Operation(summary = "친구 요청 거절", description = "받은 친구 요청을 거절합니다.")
    @PostMapping("/requests/{requestId}/reject")
    public ApiResponse<Void> rejectFriendRequest(
            @PathVariable Long requestId) {
        friendService.rejectFriendRequest(requestId);
        return ApiResponse.success(null);
    }

    /**
     * 친구 피드 조회
     */
    @Operation(summary = "친구 피드 조회", description = "모든 친구들의 카드 정보를 조회합니다.")
    @GetMapping("/feed")
    public ApiResponse<List<FriendCardResponse>> getFriendsFeed() {
        return ApiResponse.success(friendService.getFriendsFeed());
    }

    // 친구 삭제
    @Operation(summary = "친구 삭제", description = "친구를 삭제합니다.")
    @DeleteMapping("/{friendMemberId}")
    public ApiResponse<Void> deleteFriend(@PathVariable UUID friendMemberId) {
        friendService.deleteFriend(friendMemberId);
        return ApiResponse.success(null);
    }

} 