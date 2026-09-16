// src/services/notificationSocket.ts — 실시간 알림 수신(STOMP over SockJS)
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { authService } from '@/services/authService';
import type { AppNotification } from '@/services/notificationService';

type Listener = (n: AppNotification) => void;

let client: Client | null = null;
const listeners = new Set<Listener>();

const ensureClient = () => {
    if (client) return;
    const token = authService.getStoredToken();
    if (!token) return; // 로그인 안 되어 있으면 연결 안 함

    client = new Client({
        // 브라우저 SockJS는 헤더를 못 붙이므로 ?token= 으로 인증
        webSocketFactory: () => new SockJS(`/ws?token=${encodeURIComponent(token)}`),
        reconnectDelay: 5000, // 끊기면 5초 뒤 자동 재연결
        onConnect: () => {
            client?.subscribe('/user/queue/notifications', (msg: IMessage) => {
                try {
                    const n = JSON.parse(msg.body) as AppNotification;
                    listeners.forEach((l) => l(n));
                } catch {
                    /* 파싱 실패 무시 */
                }
            });
        },
    });
    client.activate();
};

/** 실시간 알림 구독. 콜백은 새 알림이 도착할 때마다 호출된다. 해제 함수를 반환. */
export const subscribeNotifications = (cb: Listener): (() => void) => {
    listeners.add(cb);
    ensureClient();
    return () => {
        listeners.delete(cb);
        if (listeners.size === 0 && client) {
            client.deactivate();
            client = null;
        }
    };
};
