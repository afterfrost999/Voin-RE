import EnabledButton from '@/assets/svgs/selectShare/EnabledButton.svg?react';
import DisabledButton from '@/assets/svgs/selectShare/DisabledButton.svg?react';
import AppShareIcon from '@/assets/svgs/selectShare/appShareIcon.svg?react';
import KakaoShareIcon from '@/assets/svgs/selectShare/kakaoShareIcon.svg?react';

import TopNavigation from '@/components/common/TopNavigation';
import BottomSheet from '@/components/common/BottomSheet';
import ActionButton from '@/components/common/ActionButton';
import FriendSelectList from '@/components/advantageResult/FriendSelectList';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityStore } from '@/store/useActivityStore';
import { getFriends, type Friend } from '@/services/friendService';
import { sendFriendCard } from '@/services/coinService';

const shareTypes = [
    { title: '앱 친구에게 전송', subtitle: 'Voin 앱에서 친구를 맺은 분에게 바로 전달할 수 있어요.', value: 'app', SvgComponent: AppShareIcon },
    { title: '카카오톡 링크로 공유', subtitle: '아직 앱에 가입하지 않은 분에게 링크로 전달할 수 있어요', value: 'kakao', SvgComponent: KakaoShareIcon },
];

const SelectShareType = () => {
    const navigate = useNavigate();
    const data = useActivityStore((s) => s.data);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        getFriends().then(setFriends).catch((e) => console.error('친구 목록 조회 실패:', e));
    }, []);

    const closeSheet = () => setIsSheetOpen(false);
    const handleClick = (index: number) => setSelectedIndex(selectedIndex === index ? null : index);

    const handleButtonClick = () => {
        if (selectedIndex === null) return;
        const type = shareTypes[selectedIndex].value;
        if (type === 'kakao') {
            alert('카카오톡 링크 공유는 곧 지원될 예정이에요. 지금은 앱 친구에게 보내기를 이용해주세요.');
            return;
        }
        setIsSheetOpen(true);
    };

    const handleSendToFriend = async (friend: { id: string }) => {
        if (sending) return;
        if (!data.keywordId || !data.writtenCase1) {
            alert('작성 정보가 부족해요. 처음부터 다시 시도해주세요.');
            return;
        }
        try {
            setSending(true);
            await sendFriendCard({
                receiverId: friend.id,
                situationContext: data.caseName,
                action: data.writtenCase1,
                feeling: data.writtenCase2,
                keywordId: data.keywordId,
                message: data.comment,
                imageUrl: data.uploadedImage,
                summary: data.classify,
                isPublic: true,
            });
            navigate('/memories-together/final-result');
        } catch (e) {
            console.error(e);
            alert('친구에게 보내는 데 실패했어요. 잠시 후 다시 시도해주세요.');
        } finally {
            setSending(false);
        }
    };

    const friendItems = friends.map((f) => ({ id: f.memberId, name: f.nickname, profileImage: f.profileImage ?? undefined, userTag: '' }));

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title="이 코인을 어떻게 전해볼까요?" caption="서로의 장점을 나누면, 이 코인을 볼 수 있어요." />

            <div className="flex flex-col gap-y-4 px-4 mt-6 w-full h-full">
                {shareTypes.map((type, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                        <div
                            key={type.value}
                            onClick={() => handleClick(index)}
                            className="relative flex flex-row items-center aspect-[2.3/1] px-6 py-8 rounded-[24px] cursor-pointer shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] transition-all duration-200 bg-transparent"
                            style={{ minHeight: 140 }}
                        >
                            <DisabledButton preserveAspectRatio="none" className={`absolute top-0 left-0 w-full h-full z-[-1] transition-opacity duration-200 ${!isSelected ? 'opacity-100' : 'opacity-0'}`} />
                            <EnabledButton preserveAspectRatio="none" className={`absolute top-0 left-0 w-full h-full z-[-1] transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                            <div className="flex-shrink-0 mr-6"><type.SvgComponent /></div>
                            <div className="flex flex-col">
                                <div className={`text-[18px] line-14 font-semibold mb-1 duration-200 ${isSelected ? 'text-white' : 'text-grey-30'}`}>{type.title}</div>
                                <div className={`text-[13px] line-14 duration-200 ${isSelected ? 'text-white' : 'text-grey-60'}`}>{type.subtitle}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="w-full mt-auto px-4 mb-4">
                <ActionButton buttonText="다음" onClick={handleButtonClick} disabled={selectedIndex === null} />
            </div>

            <BottomSheet title="친구를 선택해주세요" isOpen={isSheetOpen} onClose={closeSheet}>
                <div>
                    {friendItems.length === 0 ? (
                        <div className="w-full text-center text-grey-60 text-[14px] py-10">
                            아직 친구가 없어요. 먼저 친구를 추가해주세요.
                        </div>
                    ) : (
                        <FriendSelectList
                            friends={friendItems}
                            onFriendSelect={() => {}}
                            onComplete={handleSendToFriend}
                            completing={sending}
                        />
                    )}
                </div>
            </BottomSheet>
        </div>
    );
};

export default SelectShareType;
