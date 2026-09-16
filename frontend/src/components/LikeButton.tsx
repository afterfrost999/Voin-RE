// 좋아요 버튼 (하트 + 누를 때 팝 애니메이션)
import { useState } from 'react';

interface Props {
    liked: boolean;
    count: number;
    onToggle: () => void;
    size?: number;
}

const LikeButton = ({ liked, count, onToggle, size = 22 }: Props) => {
    const [bump, setBump] = useState(0);
    const textClass = size >= 24 ? 'text-[15px]' : 'text-[13px]';

    const handleClick = () => {
        setBump((b) => b + 1); // key 변경으로 애니메이션 재생
        onToggle();
    };

    return (
        <button onClick={handleClick} className="inline-flex items-center gap-1.5" aria-label="좋아요">
            {/* key로 remount 시켜 매 클릭마다 애니메이션 재생 (최초 로드 때는 재생 안 함) */}
            <span key={bump} className={`inline-flex ${bump ? 'like-pop-anim' : ''}`}>
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill={liked ? '#FF5A78' : 'none'}
                    stroke={liked ? '#FF5A78' : '#B6BAC2'}
                    strokeWidth="2"
                    strokeLinejoin="round"
                >
                    <path d="M12 20.7l-1.1-1C6.1 15.3 3 12.5 3 9.1 3 6.6 4.9 4.8 7.3 4.8c1.4 0 2.7.6 3.5 1.6l1.2 1.4 1.2-1.4c.8-1 2.1-1.6 3.5-1.6 2.4 0 4.3 1.8 4.3 4.3 0 3.4-3.1 6.2-7.9 10.6l-1.1 1z" />
                </svg>
            </span>
            <span className={`${textClass} ${liked ? 'text-[#FF5A78]' : 'text-grey-60'}`}>{count}</span>
        </button>
    );
};

export default LikeButton;
