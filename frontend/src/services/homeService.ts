// src/services/homeService.ts
import { authService } from "@/services/authService";

export type CoinSummary = {
    totalCoinCount: number;
    coinTypeCount: number;
    mostOwnedCoin?: { coinId: number; coinName: string; count: number; color?: string };
    recentCoin?: { coinId: number; coinName: string; keyword: string; color?: string };
};

/**
 * 홈 화면용 실제 코인 요약(총 보유 수, 가장 많이 보유한 코인, 최근 찾은 코인)을 조회합니다.
 */
export const fetchCoinSummary = async (): Promise<CoinSummary> => {
    const token = authService.getStoredToken();
    const response = await fetch('/api/home/coin-summary', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!response.ok) {
        throw new Error(`코인 요약 조회 실패: ${response.status}`);
    }
    const json = await response.json();
    return json.data as CoinSummary;
};
