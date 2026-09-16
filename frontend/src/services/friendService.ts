// src/services/friendService.ts
import { authService } from "@/services/authService";

export type Friend = { memberId: string; nickname: string; profileImage: string | null };
export type FriendRequest = {
    requestId: number;
    fromMemberId: string;
    fromMemberNickname: string;
    toMemberId: string;
    toMemberNickname: string;
    status: string;
    createdAt: string;
};

const authHeader = (): Record<string, string> => {
    const t = authService.getStoredToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
};

/** 내 친구 목록(수락된 관계) */
export const getFriends = async (): Promise<Friend[]> => {
    const r = await fetch('/api/friends', { headers: { ...authHeader() } });
    if (!r.ok) throw new Error(`친구 목록 조회 실패: ${r.status}`);
    return (await r.json()).data ?? [];
};

/** 받은 친구 요청 목록 */
export const getReceivedRequests = async (): Promise<FriendRequest[]> => {
    const r = await fetch('/api/friends/requests/received', { headers: { ...authHeader() } });
    if (!r.ok) throw new Error(`받은 요청 조회 실패: ${r.status}`);
    return (await r.json()).data ?? [];
};

/** 친구 코드로 친구 요청 보내기 */
export const sendFriendRequest = async (friendCode: string): Promise<void> => {
    const r = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ friendCode }),
    });
    if (!r.ok) throw new Error(`친구 요청 실패: ${r.status}`);
};

/** 친구 요청 수락 */
export const acceptRequest = async (requestId: number): Promise<void> => {
    const r = await fetch(`/api/friends/requests/${requestId}/accept`, { method: 'POST', headers: { ...authHeader() } });
    if (!r.ok) throw new Error(`수락 실패: ${r.status}`);
};

/** 친구 요청 거절 */
export const rejectRequest = async (requestId: number): Promise<void> => {
    const r = await fetch(`/api/friends/requests/${requestId}/reject`, { method: 'POST', headers: { ...authHeader() } });
    if (!r.ok) throw new Error(`거절 실패: ${r.status}`);
};

/** 친구 삭제 */
export const deleteFriend = async (memberId: string): Promise<void> => {
    const r = await fetch(`/api/friends/${memberId}`, { method: 'DELETE', headers: { ...authHeader() } });
    if (!r.ok) throw new Error(`친구 삭제 실패: ${r.status}`);
};
