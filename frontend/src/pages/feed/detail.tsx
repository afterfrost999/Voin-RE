// src/pages/feed/detail.tsx — 피드 카드 상세 (전체 카드)
import TopNavigation from '@/components/common/TopNavigation';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCardView, toggleLike, type CardViewDetail } from '@/services/feedService';
import { getAdvantageIcon } from '@/icons/advantageIcons';
import LikeButton from '@/components/LikeButton';

const fmtDate = (iso?: string) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

const FeedDetail = () => {
    const navigate = useNavigate();
    const { cardId } = useParams<{ cardId: string }>();
    const [card, setCard] = useState<CardViewDetail | null>(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        if (!cardId) return;
        fetchCardView(Number(cardId))
            .then((c) => { setCard(c); setLiked(!!c.likedByMe); setLikeCount(c.likeCount ?? 0); })
            .catch((e) => console.error('카드 조회 실패:', e));
    }, [cardId]);

    const handleLike = async () => {
        if (!card) return;
        setLiked((v) => !v);
        setLikeCount((n) => n + (liked ? -1 : 1));
        try {
            const res = await toggleLike(card.id);
            setLiked(res.liked);
            setLikeCount(res.likeCount);
        } catch {
            setLiked((v) => !v);
            setLikeCount((n) => n + (liked ? 1 : -1));
        }
    };

    const coin = card?.keyword?.coin;
    const Icon = card?.keyword?.name ? getAdvantageIcon(card.keyword.name) : null;

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title="장점 카드" onBackClick={() => navigate('/feed')} />

            {card && (
                <div className="w-full px-6 flex flex-col overflow-y-auto pb-6">
                    {/* 코인 카드 헤더 (사진 있으면 배경, 없으면 코인 색) */}
                    <div className="w-full shrink-0 rounded-3xl overflow-hidden mt-2 relative">
                        {card.imageUrl ? (
                            <>
                                <img src={card.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/60" />
                            </>
                        ) : (
                            <div className="absolute inset-0" style={{ backgroundColor: coin?.color || '#55CFE5' }} />
                        )}
                        <div
                            className="relative p-6 flex flex-col items-center text-white"
                            style={card.imageUrl ? { textShadow: '0 1px 4px rgba(0,0,0,0.55)' } : undefined}
                        >
                            <span className="text-[13px] font-medium opacity-95">{coin?.name}</span>
                            {card.ownerNickname && (
                                <span className="text-[12px] font-medium opacity-95 mt-1">{card.ownerNickname}님의 장점</span>
                            )}
                            {Icon && (
                                <span className="my-3 home-svg-white"><Icon className="h-14 w-14" /></span>
                            )}
                            <span className="text-[22px] font-semibold">{card.keyword?.name}</span>
                            {card.keyword?.description && (
                                <span className="text-[13px] font-medium mt-1 text-center">{card.keyword.description}</span>
                            )}
                            <span className="text-[12px] mt-3">{fmtDate(card.createdAt)}</span>
                        </div>
                    </div>

                    {/* 핵심 한 줄 요약 */}
                    {card.summary && (
                        <div className="w-full mt-6">
                            <div className="text-[16px] font-semibold text-grey-15 mb-2">한 줄 요약</div>
                            <div className="w-full rounded-2xl bg-grey-98 p-4 text-[14px] text-grey-30 leading-relaxed">{card.summary}</div>
                        </div>
                    )}

                    {/* 발견된 순간(스토리 본문) */}
                    {card.story?.content && (
                        <div className="w-full mt-5">
                            <div className="text-[16px] font-semibold text-grey-15 mb-2">이 장점이 드러난 순간</div>
                            <div className="w-full rounded-2xl bg-grey-98 p-4 text-[14px] text-grey-30 whitespace-pre-wrap leading-relaxed">{card.story.content}</div>
                        </div>
                    )}

                    {/* 남긴 한마디 */}
                    {card.content && (
                        <div className="w-full mt-5">
                            <div className="text-[16px] font-semibold text-grey-15 mb-2">남긴 한마디</div>
                            <div className="w-full rounded-2xl bg-grey-98 p-4 text-[14px] text-grey-30 whitespace-pre-wrap leading-relaxed">{card.content}</div>
                        </div>
                    )}

                    {/* 좋아요 */}
                    <div className="w-full mt-6 flex items-center gap-2">
                        <LikeButton liked={liked} count={likeCount} onToggle={handleLike} size={26} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedDetail;
