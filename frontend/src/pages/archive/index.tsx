// src/pages/archive/index.tsx — 아카이브 홈: 내가 작성 / 타인이 작성 선택
import TopNavigation from '@/components/common/TopNavigation';
import NavigationBar from '@/components/common/NavigationBar';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchArchive, type Archive } from '@/services/archiveService';

const cardClass =
    'w-full px-6 py-6 bg-gradient-to-b from-zinc-100 from-0% via-white/0 via-40% to-white/0 to-100% ' +
    'rounded-3xl shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] outline-2 outline-offset-[-2px] outline-white ' +
    'flex flex-row items-center justify-between';

const ArchiveHome = () => {
    const navigate = useNavigate();
    const [archive, setArchive] = useState<Archive | null>(null);

    useEffect(() => {
        fetchArchive().then(setArchive).catch((e) => console.error('아카이브 조회 실패:', e));
    }, []);

    const createdCount = archive?.created.length ?? 0;
    const receivedCount = archive?.received.length ?? 0;

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title="아카이브" caption="내가 모은 장점 카드를 모아봤어요." onBackClick={() => navigate('/home')} />

            <div className="w-full px-6 flex flex-col gap-4 mt-2">
                <button className={cardClass} onClick={() => navigate('/archive/created')}>
                    <div className="flex flex-col items-start">
                        <span className="text-[16px] font-semibold line-14 text-grey-30">내가 작성한 카드</span>
                        <span className="text-[13px] font-medium text-grey-60 mt-1">스스로 찾은 나의 장점</span>
                    </div>
                    <span className="text-[18px] font-semibold text-VB-50">{createdCount}개</span>
                </button>

                <button className={cardClass} onClick={() => navigate('/archive/received')}>
                    <div className="flex flex-col items-start">
                        <span className="text-[16px] font-semibold line-14 text-grey-30">타인이 작성한 카드</span>
                        <span className="text-[13px] font-medium text-grey-60 mt-1">친구가 찾아준 나의 장점</span>
                    </div>
                    <span className="text-[18px] font-semibold text-VB-50">{receivedCount}개</span>
                </button>
            </div>

            <div className="w-full mt-auto px-16 flex flex-col items-center justify-center pb-4">
                <NavigationBar />
            </div>
        </div>
    );
};

export default ArchiveHome;
