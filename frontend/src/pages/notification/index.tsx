// src/pages/notification/index.tsx — 알림 목록 (실데이터)
import TopNavigation from '@/components/common/TopNavigation';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markAllRead, type AppNotification } from '@/services/notificationService';
import { subscribeNotifications } from '@/services/notificationSocket';

const relTime = (iso?: string) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return '방금 전';
    if (m < 60) return `${m}분 전`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}일 전`;
    return iso.slice(0, 10).replace(/-/g, '.');
};

const NotificationPage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications()
            .then(setItems)
            .catch((e) => console.error('알림 조회 실패:', e))
            .finally(() => setLoading(false));
        // 열면 모두 읽음 처리(배지 제거)
        markAllRead().catch(() => {});
        // 페이지가 열려있는 동안 새 알림이 오면 맨 위에 추가
        const unsub = subscribeNotifications((n) => {
            setItems((prev) => (prev.some((p) => p.id === n.id) ? prev : [n, ...prev]));
        });
        return unsub;
    }, []);

    const handleClick = (n: AppNotification) => {
        if (n.linkType === 'card' && n.linkId) navigate(`/feed/${n.linkId}`);
        else if (n.linkType === 'friends') navigate('/friends');
    };

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title="알림" onBackClick={() => navigate('/home')} />

            <div className="w-full px-6 flex flex-col gap-2 overflow-y-auto pb-8">
                {!loading && items.length === 0 && (
                    <div className="w-full text-center text-grey-60 text-[14px] mt-20">새로운 알림이 없어요.</div>
                )}

                {items.map((n) => (
                    <button
                        key={n.id}
                        onClick={() => handleClick(n)}
                        className={`w-full text-left rounded-2xl p-4 flex items-start gap-3 outline-1 outline-offset-[-1px] ${n.isRead ? 'bg-white outline-grey-95' : 'bg-VB-98 outline-VB-90'}`}
                    >
                        {/* 안읽음 점 */}
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-VB-50'}`} />
                        <div className="flex flex-col">
                            <span className="text-[14px] text-grey-15 leading-snug">{n.message}</span>
                            <span className="text-[12px] text-grey-60 mt-1">{relTime(n.createdAt)}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NotificationPage;
