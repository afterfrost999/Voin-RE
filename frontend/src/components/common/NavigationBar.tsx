import CopyIcon from '@/assets/svgs/navigationBar/copy.svg?react';
import HomeIcon from '@/assets/svgs/navigationBar/home.svg?react';
import MoneyBagIcon from '@/assets/svgs/navigationBar/money-bag.svg?react';

import { useLocation, useNavigate } from 'react-router-dom';

const ACTIVE = '#00BEDB';
const INACTIVE = '#DBDCDF';

const NavigationBar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isHome = pathname === '/' || pathname.startsWith('/home');
    const isArchive = pathname.startsWith('/archive');

    return (
        <div className="px-8 py-4 bg-gradient-to-b from-white/0 to-white rounded-full shadow-[0px_10px_20px_-5px_rgba(35,48,59,0.05)] outline-1 outline-offset-[-1px] outline-white/70 backdrop-blur-[50px] inline-flex justify-start items-center gap-6 overflow-hidden">
            {/* 피드 (아직 미구현) */}
            <div className="w-11 aspect-square opacity-60">
                <div className="flex justify-center mb-auto">
                    <CopyIcon fill={INACTIVE} />
                </div>
                <div className="w-full text-center mt-auto">
                    <span className="text-grey-95 line-15 font-semibold text-[13px]">피드</span>
                </div>
            </div>

            {/* 홈 */}
            <button type="button" onClick={() => navigate('/home')} className="w-11 aspect-square">
                <div className="flex justify-center">
                    <HomeIcon fill={isHome ? ACTIVE : INACTIVE} />
                </div>
                <div className="w-full text-center">
                    <span className={`line-15 font-semibold text-[13px] ${isHome ? 'text-VB-50' : 'text-grey-95'}`}>홈</span>
                </div>
            </button>

            {/* 아카이브 */}
            <button type="button" onClick={() => navigate('/archive')} className="w-11 aspect-square">
                <div className="flex justify-center">
                    <MoneyBagIcon fill={isArchive ? ACTIVE : INACTIVE} />
                </div>
                <div className="w-full text-center">
                    <span className={`line-15 font-semibold whitespace-nowrap text-[13px] ${isArchive ? 'text-VB-50' : 'text-grey-95'}`}>아카이브</span>
                </div>
            </button>
        </div>
    );
};

export default NavigationBar;
