package com.voin.controller;

import com.voin.dto.response.ApiResponse;
import com.voin.dto.response.NotificationResponse;
import com.voin.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "🔔 Notification", description = "알림 API")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "내 알림 목록")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success("알림을 조회했습니다.", notificationService.getMyNotifications()));
    }

    @Operation(summary = "안읽은 알림 수")
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> unreadCount() {
        return ResponseEntity.ok(ApiResponse.success("안읽은 알림 수", notificationService.getUnreadCount()));
    }

    @Operation(summary = "알림 모두 읽음 처리")
    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> readAll() {
        notificationService.markAllRead();
        return ResponseEntity.ok(ApiResponse.<Void>success("모두 읽음 처리했습니다.", null));
    }
}
