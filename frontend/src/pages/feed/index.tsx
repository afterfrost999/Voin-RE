// src/pages/feed/index.tsx — 친구들의 공개 카드 피드 (좋아요만)
import TopNavigation from '@/components/common/TopNavigation';
import NavigationBar from '@/components/common/NavigationBar';
import DefaultProfileIcon from '@/components/DefaultProfileIcon';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFeed, toggleLike, type FeedCard } from '@/services/feedService';

const fmtDate = (iso?: string) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

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

const Heart = ({ filled }: { filled: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? '#FF5A78' : 'none'} stroke={filled ? '#FF5A78' : '#B6BAC2'} strokeWidth="2" strokeLinejoin="round">
        <path d="M12 20.7l-1.1-1C6.1 15.3 3 12.5 3 9.1 3 6.6 4.9 4.8 7.3 4.8c1.4 0 2.7.6 3.5 1.6l1.2 1.4 1.2-1.4c.8-1 2.1-1.6 3.5-1.6 2.4 0 4.3 1.8 4.3 4.3 0 3.4-3.1 6.2-7.9 10.6l-1.1 1z" />
    </svg>
);

const Feed = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState<FeedCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeed().then(setCards).catch((e) => console.error('피드 조회 실패:', e)).finally(() => setLoading(false));
    }, []);

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
            <TopNavigation title="피드" caption="친구들이 모은 장점을 구경해보세요." />

            <div className="flex-1 w-full px-6 flex flex-col gap-4 overflow-y-auto pb-4">
                {!loading && cards.length === 0 && (
                    <div className="w-full text-center text-grey-60 text-[14px] mt-16">
                        아직 볼 수 있는 친구 카드가 없어요.<br />친구를 맺고 서로의 장점을 공개해보세요.
                    </div>
                )}

                {cards.map((card) => (
                    <div
                        key={card.cardId}
                        onClick={() => navigate(`/feed/${card.cardId}`)}
                        className="w-full rounded-3xl bg-white shadow-[0px_10px_20px_-8px_rgba(35,48,59,0.12)] outline-1 outline-offset-[-1px] outline-white overflow-hidden cursor-pointer"
                    >
                        {/* 코인 색 상단 띠 */}
                        <div className="h-1.5 w-full" style={{ backgroundColor: card.coinColor || '#55CFE5' }} />
                        <div className="p-4 flex flex-col gap-3">
                            {/* 작성자 */}
                            <div className="flex items-center gap-3">
                                <Avatar src={card.memberProfileImage} />
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-semibold text-grey-15">{card.memberNickname}</span>
                                    <span className="text-[12px] text-grey-60">{fmtDate(card.createdAt)}</span>
                                </div>
                            </div>

                            {/* 코인/키워드 */}
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: card.coinColor || '#55CFE5' }}>{card.coinType}</span>
                                <span className="text-[16px] font-semibold text-grey-15">{card.keywordName}</span>
                            </div>

                            {/* 핵심 한 줄 요약 (없으면 메시지) */}
                            {(card.summary || card.content) && (
                                <div className="text-[14px] text-grey-30 line-clamp-1">{card.summary || card.content}</div>
                            )}

                            {/* 좋아요 (카드 이동과 분리) */}
                            <div className="flex items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => handleLike(card.cardId)} className="inline-flex items-center gap-1.5" aria-label="좋아요">
                                    <Heart filled={card.likedByMe} />
                                    <span className={`text-[14px] ${card.likedByMe ? 'text-[#FF5A78]' : 'text-grey-60'}`}>{card.likeCount}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full px-16 flex flex-col items-center justify-center pb-4 pt-2">
                <NavigationBar />
            </div>
        </div>
    );
};

export default Feed;
