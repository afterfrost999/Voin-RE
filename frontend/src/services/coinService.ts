// src/services/coinService.ts
import { authService } from "@/services/authService";

export type SaveDiaryCoinParams = {
    content: string;                                   // 일기 본문(분류에 사용된 원문)
    keywordId: number;                                 // 선택된 키워드 ID
    storyType?: 'DAILY_DIARY' | 'EXPERIENCE_REFLECTION';
    comment?: string;
    imageUrl?: string;                                 // 첨부 이미지(base64 data URL, 선택)
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
            isPublic: params.isPublic ?? false,
        }),
    });
    if (!response.ok) {
        throw new Error(`코인 저장 실패: ${response.status}`);
    }
};
