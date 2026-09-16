// src/services/coinService.ts
import { authService } from "@/services/authService";

export type SaveDiaryCoinParams = {
    content: string;                                   // 일기 본문(분류에 사용된 원문)
    keywordId: number;                                 // 선택된 키워드 ID
    storyType?: 'DAILY_DIARY' | 'EXPERIENCE_REFLECTION';
    comment?: string;
    imageUrl?: string;                                 // 첨부 이미지(base64 data URL, 선택)
    summary?: string;                                  // 핵심 한 줄 요약
    isPublic?: boolean;
};

/**
 * 일기 내용과 분류된 키워드로 코인을 획득(영속화)합니다.
 * 서버가 한 트랜잭션에서 스토리·카드 생성 + 코인 보유량 증가를 처리합니다.
 */
export const saveDiaryCoin = async (params: SaveDiaryCoinParams): Promise<void> => {
    const token = authService.getStoredToken();
    const response = await fetch('/api/cards/from-diary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
            storyType: params.storyType ?? 'DAILY_DIARY',
            content: params.content,
            keywordId: params.keywordId,
            comment: params.comment ?? '',
            imageUrl: params.imageUrl ?? null,
            summary: params.summary ?? null,
            isPublic: params.isPublic ?? false,
        }),
    });
    if (!response.ok) {
        throw new Error(`코인 저장 실패: ${response.status}`);
    }
};

export type SendFriendCardParams = {
    receiverId: string;       // 받는 친구 회원 ID
    situationContext?: string; // 상황(S1)
    action: string;           // 행동(S2)
    feeling?: string;         // 느낌(S3)
    keywordId: number;        // 키워드(S4)
    message?: string;         // 메시지(S6)
    imageUrl?: string;        // 이미지(S6, base64)
    summary?: string;         // 핵심 한 줄 요약
    isPublic?: boolean;
};

/** 친구에게 장점 카드 보내기 (받는 친구의 코인 +1) */
export const sendFriendCard = async (params: SendFriendCardParams): Promise<void> => {
    const token = authService.getStoredToken();
    const response = await fetch('/api/cards/friend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
            receiverId: params.receiverId,
            situationContext: params.situationContext ?? '',
            action: params.action,
            feeling: params.feeling ?? '',
            keywordId: params.keywordId,
            message: params.message ?? '',
            imageUrl: params.imageUrl ?? null,
            summary: params.summary ?? null,
            isPublic: params.isPublic ?? true,
        }),
    });
    if (!response.ok) {
        throw new Error(`친구 카드 전송 실패: ${response.status}`);
    }
};
