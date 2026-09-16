// src/services/notificationService.ts
import { authService } from "@/services/authService";

export type AppNotification = {
    id: number;
    type: string;        // FRIEND_REQUEST | FRIEND_ACCEPTED | CARD_RECEIVED | CARD_LIKED
    message: string;
    linkType?: string | null;  // card | friends
    linkId?: number | null;
    isRead: boolean;
    createdAt: string;
};

const authHeader = (): Record<string, string> => {
    const t = authService.getStoredToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
};

export const fetchNotifications = async (): Promise<AppNotification[]> => {
    const r = await fetch('/api/notifications', { headers: { ...authHeader() } });
    if (!r.ok) throw new Error(`알림 조회 실패: ${r.status}`);
    return (await r.json()).data ?? [];
};

export const fetchUnreadCount = async (): Promise<number> => {
    const r = await fetch('/api/notifications/unread-count', { headers: { ...authHeader() } });
    if (!r.ok) return 0;
    return (await r.json()).data ?? 0;
};

export const markAllRead = async (): Promise<void> => {
    await fetch('/api/notifications/read-all', { method: 'POST', headers: { ...authHeader() } });
};
