package com.voin.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@Schema(description = "알림")
public class NotificationResponse {
    private Long id;
    private String type;
    private String message;
    private String linkType;
    private Long linkId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
