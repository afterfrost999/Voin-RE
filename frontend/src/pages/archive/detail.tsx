// src/pages/archive/detail.tsx — 카드 상세 조회 + 삭제(수정 불가)
import TopNavigation from '@/components/common/TopNavigation';
import ActionButton from '@/components/common/ActionButton';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchArchive, deleteCard, type Archive, type ArchiveCard, type ArchiveType } from '@/services/archiveService';
import { getAdvantageIcon } from '@/icons/advantageIcons';

const fmtDate = (iso?: string) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

const ArchiveCardDetail = () => {
    const navigate = useNavigate();
    const { type, coinId, cardId } = useParams<{ type: ArchiveType; coinId: string; cardId: string }>();
    const [archive, setArchive] = useState<Archive | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchArchive().then(setArchive).catch((e) => console.error('아카이브 조회 실패:', e));
    }, []);

    const card: ArchiveCard | undefined = useMemo(() => {
        const list = archive?.[(type ?? 'created') as ArchiveType];
        return (list ?? []).find((c) => String(c.id) === cardId);
    }, [archive, type, cardId]);

    const handleDelete = async () => {
        if (deleting || !card) return;
        if (!window.confirm('이 카드를 삭제할까요? 삭제하면 코인 개수도 줄어들어요. (되돌릴 수 없어요)')) return;
        try {
            setDeleting(true);
            await deleteCard(card.id);
            navigate(`/archive/${type}`);
        } catch (e) {
            console.error(e);
            alert('카드 삭제에 실패했어요. 잠시 후 다시 시도해주세요.');
        } finally {
            setDeleting(false);
        }
    };

    if (archive && !card) {
        return (
            <div className="w-full h-full flex flex-col">
                <TopNavigation title="카드" onBackClick={() => navigate(`/archive/${type}/${coinId}`)} />
                <div className="w-full text-center text-grey-60 text-[14px] mt-16">카드를 찾을 수 없어요.</div>
            </div>
        );
    }

    const coin = card?.keyword?.coin;
    const Icon = card?.keyword?.name ? getAdvantageIcon(card.keyword.name) : null;

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title="장점 카드" onBackClick={() => navigate(`/archive/${type}/${coinId}`)} />

            {card && (
                <div className="w-full px-6 flex flex-col overflow-y-auto pb-4">
                    {/* 코인/키워드 헤더 — 사진이 있으면 배경으로, 없으면 코인 색 배경 */}
                    <div className="w-full shrink-0 rounded-3xl overflow-hidden mt-2 relative">
                        {card.imageUrl ? (
                            <>
                                <img src={card.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                {/* 텍스트 가독성을 위한 그라데이션 오버레이(아래쪽이 더 진함) */}
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
                            {Icon && (
                                <span className="my-3 home-svg-white">
                                    <Icon className="h-14 w-14" />
                                </span>
                            )}
                            <span className="text-[22px] font-semibold">{card.keyword?.name}</span>
                            {card.keyword?.description && (
                                <span className="text-[13px] font-medium mt-1 text-center">{card.keyword.description}</span>
                            )}
                            <span className="text-[12px] mt-3">{fmtDate(card.createdAt)}</span>
                        </div>
                    </div>

                    {/* 코인이 발견된 순간 (스토리 본문) */}
                    {card.story?.content && (
                        <div className="w-full mt-6">
                            <div className="text-[16px] font-semibold text-grey-15 mb-2">코인이 발견된 순간</div>
                            <div className="w-full rounded-2xl bg-grey-98 p-4 text-[14px] text-grey-30 whitespace-pre-wrap leading-relaxed">
                                {card.story.content}
                            </div>
                        </div>
                    )}

                    {/* 한마디 */}
                    {card.content && (
                        <div className="w-full mt-5">
                            <div className="text-[16px] font-semibold text-grey-15 mb-2">남긴 한마디</div>
                            <div className="w-full rounded-2xl bg-grey-98 p-4 text-[14px] text-grey-30 whitespace-pre-wrap leading-relaxed">
                                {card.content}
                            </div>
                        </div>
                    )}

                    {/* 삭제 (수정은 불가) */}
                    <div className="w-full mt-8">
                        <ActionButton
                            buttonText={deleting ? '삭제 중...' : '카드 삭제'}
                            onClick={handleDelete}
                            disabled={deleting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArchiveCardDetail;
