// src/services/feedService.ts
import { authService } from "@/services/authService";

export type FeedCard = {
    cardId: number;
    memberId: string;
    memberNickname: string;
    memberProfileImage?: string | null;
    content?: string | null;
    coinType?: string | null;   // 코인(카테고리) 이름
    coinColor?: string | null;
    keywordName?: string | null;
    imageUrl?: string | null;
    likeCount: number;
    likedByMe: boolean;
    createdAt: string;
};

const authHeader = (): Record<string, string> => {
    const t = authService.getStoredToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
};

/** 친구들의 공개 카드 피드 */
export const fetchFeed = async (): Promise<FeedCard[]> => {
    const r = await fetch('/api/friends/feed', { headers: { ...authHeader() } });
    if (!r.ok) throw new Error(`피드 조회 실패: ${r.status}`);
    return (await r.json()).data ?? [];
};

/** 카드 좋아요 토글 → { liked, likeCount } */
export const toggleLike = async (cardId: number): Promise<{ liked: boolean; likeCount: number }> => {
    const r = await fetch(`/api/cards/${cardId}/like`, { method: 'POST', headers: { ...authHeader() } });
    if (!r.ok) throw new Error(`좋아요 실패: ${r.status}`);
    return (await r.json()).data;
};
