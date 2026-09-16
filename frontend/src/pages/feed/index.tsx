// src/pages/feed/index.tsx — 친구들의 공개 카드 피드 (좋아요만)
import TopNavigation from '@/components/common/TopNavigation';
import NavigationBar from '@/components/common/NavigationBar';
import DefaultProfileIcon from '@/components/DefaultProfileIcon';
import LikeButton from '@/components/LikeButton';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFeed, toggleLike, type FeedCard } from '@/services/feedService';

const Avatar = ({ src, size = 36 }: { src?: string | null; size?: number }) => {
    const [err, setErr] = useState(false);
    return (
        <div className="rounded-full overflow-hidden bg-gray-200 shrink-0" style={{ width: size, height: size }}>
            {src && !err ? (
                <img src={src} alt="" onError={() => setErr(true)} className="w-full h-full object-cover" />
            ) : (
                <DefaultProfileIcon className="w-full h-full" />
            )}
        </div>
    );
};

const Feed = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState<FeedCard[]>([]);
    const [loading, setLoading] = useState(true);

    // 당겨서 새로고침
    const scrollRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const pulling = useRef(false);
    const [pullY, setPullY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    // 스크롤 내리면 캡션 접기, 올리면 다시 펼치기
    const [captionVisible, setCaptionVisible] = useState(true);
    const lastScroll = useRef(0);
    const onScroll = () => {
        const st = scrollRef.current?.scrollTop ?? 0;
        if (st <= 4) setCaptionVisible(true);
        else if (st > lastScroll.current + 3) setCaptionVisible(false);
        else if (st < lastScroll.current - 3) setCaptionVisible(true);
        lastScroll.current = st;
    };

    const load = () => fetchFeed().then(setCards).catch((e) => console.error('피드 조회 실패:', e));

    useEffect(() => {
        load().finally(() => setLoading(false));
    }, []);

    const onTouchStart = (e: React.TouchEvent) => {
        if ((scrollRef.current?.scrollTop ?? 0) <= 0) {
            startY.current = e.touches[0].clientY;
            pulling.current = true;
        }
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if (!pulling.current) return;
        const dy = e.touches[0].clientY - startY.current;
        if (dy > 0) setPullY(Math.min(dy * 0.5, 70));
        else { pulling.current = false; setPullY(0); }
    };
    const onTouchEnd = async () => {
        if (!pulling.current) return;
        pulling.current = false;
        if (pullY > 45) {
            setRefreshing(true);
            await load();
            setRefreshing(false);
        }
        setPullY(0);
    };

    const handleLike = async (cardId: number) => {
        // 낙관적 업데이트
        setCards((prev) => prev.map((c) => c.cardId === cardId
            ? { ...c, likedByMe: !c.likedByMe, likeCount: c.likeCount + (c.likedByMe ? -1 : 1) }
            : c));
        try {
            const res = await toggleLike(cardId);
            setCards((prev) => prev.map((c) => c.cardId === cardId ? { ...c, likedByMe: res.liked, likeCount: res.likeCount } : c));
        } catch (e) {
            console.error(e);
            // 되돌리기
            setCards((prev) => prev.map((c) => c.cardId === cardId
                ? { ...c, likedByMe: !c.likedByMe, likeCount: c.likeCount + (c.likedByMe ? -1 : 1) }
                : c));
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title="피드" />

            {/* 스크롤에 따라 부드럽게 접히는 캡션 */}
            <div
                className="px-6 -mt-4 overflow-hidden transition-all duration-300 ease-out"
                style={{ maxHeight: captionVisible ? 36 : 0, opacity: captionVisible ? 1 : 0 }}
            >
                <span className="body-n text-grey-70">친구들이 모은 장점을 구경해보세요.</span>
            </div>

            <div
                id="feed-scroll"
                ref={scrollRef}
                onScroll={onScroll}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="flex-1 w-full px-6 overflow-y-auto pb-4 pt-2"
            >
                {/* 당겨서 새로고침 표시 */}
                {(pullY > 0 || refreshing) && (
                    <div className="w-full flex items-center justify-center text-[12px] text-grey-60 overflow-hidden" style={{ height: refreshing ? 36 : pullY }}>
                        {refreshing ? '새로고침 중...' : (pullY > 45 ? '놓으면 새로고침' : '당겨서 새로고침')}
                    </div>
                )}
                {!loading && cards.length === 0 && (
                    <div className="w-full text-center text-grey-60 text-[14px] mt-16">
                        아직 볼 수 있는 친구 카드가 없어요.<br />친구를 맺고 서로의 장점을 공개해보세요.
                    </div>
                )}

                {/* 2열 그리드 (카드 크기 고정, 넘치면 스크롤) */}
                <div className="grid grid-cols-2 gap-3">
                    {cards.map((card) => (
                        <div
                            key={card.cardId}
                            onClick={() => navigate(`/feed/${card.cardId}`)}
                            className="rounded-2xl bg-white shadow-[0px_10px_20px_-8px_rgba(35,48,59,0.12)] outline-1 outline-offset-[-1px] outline-white overflow-hidden cursor-pointer flex flex-col"
                            style={{ minHeight: 210 }}
                        >
                            {/* 코인 색 상단 띠 */}
                            <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: card.coinColor || '#55CFE5' }} />
                            <div className="p-3 flex flex-col gap-2 flex-1">
                                {/* 작성자 */}
                                <div className="flex items-center gap-2">
                                    <Avatar src={card.memberProfileImage} size={28} />
                                    <span className="text-[13px] font-semibold text-grey-15 truncate">{card.memberNickname}</span>
                                </div>

                                {/* 코인 칩 + 키워드 */}
                                <span className="self-start px-2 py-0.5 rounded-full text-[11px] font-semibold text-white" style={{ backgroundColor: card.coinColor || '#55CFE5' }}>{card.coinType}</span>
                                <span className="text-[15px] font-semibold text-grey-15">{card.keywordName}</span>

                                {/* 핵심 요약 (없으면 메시지) */}
                                {(card.summary || card.content) && (
                                    <span className="text-[12px] text-grey-60 line-clamp-2">{card.summary || card.content}</span>
                                )}

                                {/* 좋아요 */}
                                <div className="mt-auto flex items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                                    <LikeButton liked={card.likedByMe} count={card.likeCount} onToggle={() => handleLike(card.cardId)} size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full px-16 flex flex-col items-center justify-center pb-4 pt-2">
                <NavigationBar />
            </div>
        </div>
    );
};

export default Feed;
