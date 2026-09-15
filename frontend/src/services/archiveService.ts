// src/services/archiveService.ts
import { authService } from "@/services/authService";

export type ArchiveCoin = { id: number; name: string; description?: string; color?: string };
export type ArchiveKeyword = { id: number; name: string; description?: string; coin?: ArchiveCoin };
export type ArchiveStory = {
    id: number;
    title?: string;
    content?: string;
    type?: string;
    answer1?: string;
    answer2?: string;
    situationContext?: string;
};
export type ArchiveCard = {
    id: number;
    content: string | null;
    imageUrl?: string | null;
    createdAt: string;
    isPublic?: boolean;
    isGift?: boolean;
    situationContext?: string | null;
    keyword?: ArchiveKeyword;
    story?: ArchiveStory;
};
export type Archive = { created: ArchiveCard[]; received: ArchiveCard[] };
export type ArchiveType = 'created' | 'received';

const authHeader = (): Record<string, string> => {
    const token = authService.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/** 아카이브 전체(내가 작성 / 타인이 작성) 조회 */
export const fetchArchive = async (): Promise<Archive> => {
    const res = await fetch('/api/cards/archive', { headers: { ...authHeader() } });
    if (!res.ok) throw new Error(`아카이브 조회 실패: ${res.status}`);
    const json = await res.json();
    return json.data as Archive;
};

/** 카드 삭제 (소유자만, 해당 코인 보유량도 -1) */
export const deleteCard = async (cardId: number): Promise<void> => {
    const res = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`카드 삭제 실패: ${res.status}`);
};

/** 카드 목록을 코인(카테고리)별로 그룹핑 */
export const groupByCoin = (cards: ArchiveCard[]) => {
    const groups = new Map<number, { coin: ArchiveCoin; cards: ArchiveCard[] }>();
    for (const card of cards) {
        const coin = card.keyword?.coin;
        if (!coin) continue;
        const g = groups.get(coin.id) ?? { coin, cards: [] };
        g.cards.push(card);
        groups.set(coin.id, g);
    }
    return Array.from(groups.values());
};
