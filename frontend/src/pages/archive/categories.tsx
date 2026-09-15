// src/pages/archive/categories.tsx — 선택한 타입의 카드를 장점 카테고리(코인)별로 분류
import TopNavigation from '@/components/common/TopNavigation';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchArchive, groupByCoin, type Archive, type ArchiveType } from '@/services/archiveService';

const ArchiveCategories = () => {
    const navigate = useNavigate();
    const { type } = useParams<{ type: ArchiveType }>();
    const [archive, setArchive] = useState<Archive | null>(null);

    useEffect(() => {
        fetchArchive().then(setArchive).catch((e) => console.error('아카이브 조회 실패:', e));
    }, []);

    const title = type === 'received' ? '타인이 작성한 카드' : '내가 작성한 카드';
    const cards = type === 'received' ? archive?.received : archive?.created;
    const groups = useMemo(() => (cards ? groupByCoin(cards) : []), [cards]);

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title={title} caption="장점 카테고리별로 모아봤어요." onBackClick={() => navigate('/archive')} />

            <div className="w-full px-6 flex flex-col gap-3 mt-2 overflow-y-auto pb-6">
                {archive && groups.length === 0 && (
                    <div className="w-full text-center text-grey-60 text-[14px] mt-16">
                        아직 카드가 없어요.
                    </div>
                )}

                {groups.map(({ coin, cards }) => (
                    <button
                        key={coin.id}
                        onClick={() => navigate(`/archive/${type}/${coin.id}`)}
                        className="w-full px-5 py-4 rounded-2xl bg-white shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] outline-1 outline-offset-[-1px] outline-grey-95 flex flex-row items-center justify-between"
                    >
                        <div className="flex flex-row items-center gap-3">
                            <span
                                className="w-9 h-9 rounded-full inline-block"
                                style={{ backgroundColor: coin.color || '#DBDCDF' }}
                            />
                            <span className="text-[16px] font-semibold text-grey-15">{coin.name}</span>
                        </div>
                        <span className="text-[14px] font-medium text-grey-60">{cards.length}개</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ArchiveCategories;
