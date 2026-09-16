// src/pages/archive/cards.tsx — 선택한 카테고리(코인)의 카드 목록
import TopNavigation from '@/components/common/TopNavigation';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchArchive, type Archive, type ArchiveType } from '@/services/archiveService';

const fmtDate = (iso?: string) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

const ArchiveCardList = () => {
    const navigate = useNavigate();
    const { type, coinId } = useParams<{ type: ArchiveType; coinId: string }>();
    const [archive, setArchive] = useState<Archive | null>(null);

    useEffect(() => {
        fetchArchive().then(setArchive).catch((e) => console.error('아카이브 조회 실패:', e));
    }, []);

    const list = archive?.[(type ?? 'created') as ArchiveType];
    const cards = useMemo(
        () => (list ?? []).filter((c) => String(c.keyword?.coin?.id) === coinId),
        [list, coinId]
    );
    const coinName = cards[0]?.keyword?.coin?.name ?? '카테고리';
    const coinColor = cards[0]?.keyword?.coin?.color || '#DBDCDF';

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title={coinName} caption="카드를 눌러 자세히 볼 수 있어요." onBackClick={() => navigate(`/archive/${type}`)} />

            <div className="w-full px-6 flex flex-col gap-3 mt-2 overflow-y-auto pb-6">
                {archive && cards.length === 0 && (
                    <div className="w-full text-center text-grey-60 text-[14px] mt-16">카드가 없어요.</div>
                )}

                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => navigate(`/archive/${type}/${coinId}/${card.id}`)}
                        className="w-full px-5 py-4 rounded-2xl bg-white shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] outline-1 outline-offset-[-1px] outline-grey-95 flex flex-row items-center justify-between"
                    >
                        <div className="flex flex-row items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: coinColor }} />
                            <div className="flex flex-col items-start">
                                <span className="text-[16px] font-semibold text-grey-15">{card.keyword?.name}</span>
                                {card.story?.content && (
                                    <span className="text-[13px] text-grey-60 mt-0.5 line-clamp-1 text-left">
                                        {card.story.content}
                                    </span>
                                )}
                            </div>
                        </div>
                        <span className="text-[12px] text-grey-70 whitespace-nowrap ml-2">{fmtDate(card.createdAt)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ArchiveCardList;
