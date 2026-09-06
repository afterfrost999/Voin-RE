import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
// import { useKakaoCallback } from '@/hooks/useKakaoCallback';

import ProfileImage from '@/components/ProfileImage';
import HomeCoinFind from '@/components/home/HomeCoinFind';
import HomeCoinStatus from '@/components/home/HomeCoinStatus';
import Carousel from '@/components/home/Carousel';
import NavigationBar from '@/components/common/NavigationBar';
import BottomSheet from '@/components/common/BottomSheet';

import NotificationIcon from '@/assets/svgs/notificationIcon.svg?react';
import NoteIcon from '@/assets/svgs/TodaysDiary/NoteIcon.svg?react';
import RelationshipIcon from '@/assets/svgs/TodaysDiary/Relationship.svg?react';
import SearchIcon from '@/assets/svgs/TodaysDiary/SearchIcon.svg?react';


const Home = () => {
    const { userInfo, actions } = useAuthStore();
    const navigate = useNavigate();
    
    // 카카오 콜백 처리 (백엔드에서 리다이렉트된 경우)
    // const { isProcessing } = useKakaoCallback();

    const handleLogout = () => {
        console.log('Logout button clicked');
        actions.logout();
        console.log('Logout completed, navigating to login');
        // 로그아웃 후 명시적으로 로그인 페이지로 리다이렉트
        navigate('/login');
    };

    useEffect(() => {
        // meta 태그 테마 색상 설정 (AOS 전용) 나중에 없앨듯?
        const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');

        if (!themeColorMetaTag) {
            return;
        }

        document.body.style.background = "linear-gradient(to bottom, #55CFE5, #F7F5F4)";
        themeColorMetaTag.setAttribute('content', "#55cfe5");

        // 클리님 함수
        return () => {
            document.body.style.background = '#F7F7F8';
            themeColorMetaTag.setAttribute('content', "#F7F7F8");
        };
    }, []);

    // BottomSheet 상태 관리
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const openSheet = () => setIsSheetOpen(true);
    const closeSheet = () => setIsSheetOpen(false);

    // 케러셀 슬라이드 요소
    // NOTE: 코인 통계는 아직 서버에 저장/집계되지 않으므로 빈 상태로 노출한다.
    //       실제 코인 데이터 연동 후 저장된 통계로 채울 것.
    const carouselSlide = [
        <HomeCoinFind onButtonClick={openSheet} />,
        <HomeCoinStatus
            title="나의 장점 코인"
            titleValue="아직 없어요"
            subtitle={["일기를 쓰고 첫 코인을 찾아보세요"]}
        />
    ]

    // 모든 SVG 요소를 흰색으로 강제 지정하는 글로벌 스타일 추가
    // (uniqueId 없이도 적용)
    const globalWhiteSvgStyle = `
        .home-svg-white svg path,
        .home-svg-white svg circle,
        .home-svg-white svg rect,
        .home-svg-white svg polygon,
        .home-svg-white svg ellipse,
        .home-svg-white svg line {
            fill: white !important;
            stroke: white !important;
        }
    `;

    return (
        <div className="w-full h-full flex flex-col">
            <style>{globalWhiteSvgStyle}</style>
            {/* 더미 유저 표시 (개발용) */}
            {userInfo && userInfo.id.startsWith('dummy-user') && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
                    🚀 개발 모드: 더미 유저 "{userInfo.nickname}"로 로그인됨
                </div>
            )}
            {/* Header */}
            <div className="w-full h-12 px-4 py-2 pt-4 mb-2 flex flex-row items-center">
                <div className="h-full inline-flex flex-row items-center gap-2">
                    <ProfileImage src={userInfo?.profileImage}/>
                    {/* 사용자 이름 */}
                    <div className="min-w-fit">
                        <span className="text-base text-white font-semibold">
                            {userInfo?.nickname || '닉네임'}
                        </span>
                        <span className="text-base text-white font-medium mx-0.5">님</span>
                    </div>
                </div>
                <div className='ml-auto h-full inline-flex items-center gap-2'>
                    <button 
                        onClick={handleLogout}
                        className="px-3 py-1 text-sm text-white/80 hover:text-white border border-white/30 rounded-full hover:bg-white/10"
                    >
                        로그아웃
                    </button>
                    <Link to="/notification" className='inline-flex flex-row items-center'>
                        <NotificationIcon style={{ opacity: 0.7 }}/>
                    </Link>
                </div>
            </div>
            
            {/* Home Message */}
            <div className='px-6 py-2 mb-14'>
                <div className="mt-2 display-n font-bold bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                    무심코 지나쳤지만<br />장점이 빛난 순간이<br />있을 거예요.
                </div>
            </div>

            {/* Home Coin */}
            <Carousel slides={carouselSlide} />

            {/* Navigation Bar */}
            <div className='w-full mt-auto px-16 flex flex-col items-center justify-center pb-4'>
                <NavigationBar />
            </div>

            {/* Bottom Sheet */}
            <BottomSheet title="코인 찾기" isOpen={isSheetOpen} onClose={closeSheet}>
                <div className="px-1 pt-4 pb-2">
                    <span className="text-[16px] line-14 font-semibold text-grey-60">나의 장점 코인</span>
                </div>
                <div className="w-full grid grid-cols-2 gap-2">
                    <Link to="/todays-diary" className="pt-6 w-full bg-gradient-to-b from-zinc-100 from-0% via-white/0 via-40% to-white/0 to-100% rounded-3xl shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] outline-2 outline-offset-[-2px] outline-white inline-flex flex-col justify-start items-start">
                        <div className="w-full flex flex-col items-center px-3 gap-y-1">
                            <div className="text-[16px] font-semibold line-14 text-grey-30">오늘의 일기</div>
                            <div className="text-center line-14 font-medium text-[13px] text-grey-60">오늘의 일상을 기록하면서<br />내 장점을 찾아봐요</div>
                        </div>
                        <div className="self-stretch h-28 py-4 inline-flex justify-center items-center">
                            <NoteIcon className="w-28 h-28" />
                        </div>
                    </Link>
                    <Link to="/case-review" className="pt-6 w-full bg-gradient-to-b from-zinc-100 from-0% via-white/0 via-40% to-white/0 to-100% rounded-3xl shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] outline-2 outline-offset-[-2px] outline-white inline-flex flex-col justify-start items-start">
                        <div className="w-full flex flex-col items-center px-3 gap-y-1">
                            <div className="text-[16px] font-semibold line-14 text-grey-30">사례 돌아보기</div>
                            <div className="text-center line-14 font-medium text-[13px] text-grey-60">이전 경험을 돌아보면서<br />내 장점을 찾아봐요</div>
                        </div>
                        <div className="self-stretch h-28 py-4 inline-flex justify-center items-center">
                            <SearchIcon className="w-28 h-28" />
                        </div>
                    </Link>
                </div>
                <div className="px-1 pt-8 pb-2">
                    <span className="text-[16px] line-14 font-semibold text-grey-60">친구의 장점 코인</span>
                </div>
                    <Link to="/memories-together" className="px-4 py-3 w-full bg-gradient-to-b from-zinc-100 from-0% via-white/0 via-40% to-white/0 to-100% rounded-3xl shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] outline-2 outline-offset-[-2px] outline-white inline-flex flex-row items-center">
                        <div className="self-stretch h-28 py-4 inline-flex justify-center items-center mr-8">
                            <RelationshipIcon className="w-28 h-28" />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <div className="text-[16px] font-semibold line-14 text-grey-30">함께한 추억 떠올리기</div>
                            <div className="line-14 font-medium text-[13px] text-grey-60">친구의 장점을 찾아줄 수 있어요</div>
                        </div>
                    </Link>
            </BottomSheet>
        </div>
    )
}

export default Home;