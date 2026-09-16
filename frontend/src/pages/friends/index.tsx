// src/pages/friends/index.tsx — 친구 관리: 내 코드 / 친구 추가 / 받은 요청 / 친구 목록
import TopNavigation from '@/components/common/TopNavigation';
import DefaultProfileIcon from '@/components/DefaultProfileIcon';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import {
    getFriends, getReceivedRequests, sendFriendRequest, acceptRequest, rejectRequest, deleteFriend,
    type Friend, type FriendRequest,
} from '@/services/friendService';

const Avatar = ({ src, size = 40 }: { src?: string | null; size?: number }) => {
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

const Friends = () => {
    const navigate = useNavigate();
    const userInfo = useAuthStore((s) => s.userInfo);
    const myFriendCode = (userInfo as unknown as { friendCode?: string })?.friendCode ?? '';

    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [code, setCode] = useState('');
    const [busy, setBusy] = useState(false);

    const refresh = () => {
        getFriends().then(setFriends).catch((e) => console.error(e));
        getReceivedRequests().then(setRequests).catch((e) => console.error(e));
    };
    useEffect(refresh, []);

    const handleAdd = async () => {
        const c = code.trim().toUpperCase();
        if (!c || busy) return;
        try {
            setBusy(true);
            await sendFriendRequest(c);
            setCode('');
            alert('친구 요청을 보냈어요.');
        } catch {
            alert('친구 요청에 실패했어요. (코드가 틀렸거나 이미 친구/요청한 사이일 수 있어요)');
        } finally {
            setBusy(false);
        }
    };

    const handleAccept = async (id: number) => {
        try { await acceptRequest(id); refresh(); } catch { alert('수락에 실패했어요.'); }
    };
    const handleReject = async (id: number) => {
        try { await rejectRequest(id); refresh(); } catch { alert('거절에 실패했어요.'); }
    };
    const handleDelete = async (memberId: string) => {
        if (!window.confirm('이 친구를 삭제할까요?')) return;
        try { await deleteFriend(memberId); refresh(); } catch { alert('친구 삭제에 실패했어요.'); }
    };

    const copyCode = () => {
        if (!myFriendCode) return;
        navigator.clipboard?.writeText(myFriendCode).then(
            () => alert('내 친구 코드를 복사했어요.'),
            () => {}
        );
    };

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title="친구" caption="친구를 맺고 서로의 장점을 나눠보세요." onBackClick={() => navigate('/home')} />

            <div className="w-full px-6 flex flex-col gap-6 overflow-y-auto pb-8">
                {/* 내 친구 코드 */}
                <div className="w-full rounded-2xl bg-VB-98 p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[13px] text-grey-60">내 친구 코드</span>
                        <span className="text-[20px] font-semibold text-VB-50 tracking-widest">{myFriendCode || '-'}</span>
                    </div>
                    <button onClick={copyCode} className="px-3 py-1.5 text-[13px] text-VB-50 border border-VB-50/40 rounded-full">복사</button>
                </div>

                {/* 친구 추가 */}
                <div className="w-full">
                    <div className="text-[15px] font-semibold text-grey-30 mb-2">친구 추가</div>
                    <div className="flex gap-2">
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="친구 코드 입력"
                            maxLength={8}
                            className="flex-1 px-4 py-3 rounded-xl bg-grey-98 outline-1 outline-grey-95 text-[15px] uppercase tracking-widest"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!code.trim() || busy}
                            className="px-4 py-3 rounded-xl bg-VB-50 text-white text-[15px] font-semibold disabled:opacity-40"
                        >
                            요청
                        </button>
                    </div>
                </div>

                {/* 받은 친구 요청 */}
                {requests.length > 0 && (
                    <div className="w-full">
                        <div className="text-[15px] font-semibold text-grey-30 mb-2">받은 친구 요청 {requests.length}</div>
                        <div className="flex flex-col gap-2">
                            {requests.map((r) => (
                                <div key={r.requestId} className="w-full rounded-2xl bg-white shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] outline-1 outline-offset-[-1px] outline-grey-95 p-3 flex items-center justify-between">
                                    <span className="text-[15px] font-medium text-grey-15">{r.fromMemberNickname}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAccept(r.requestId)} className="px-3 py-1.5 text-[13px] text-white bg-VB-50 rounded-full">수락</button>
                                        <button onClick={() => handleReject(r.requestId)} className="px-3 py-1.5 text-[13px] text-grey-60 border border-grey-90 rounded-full">거절</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 친구 목록 */}
                <div className="w-full">
                    <div className="text-[15px] font-semibold text-grey-30 mb-2">내 친구 {friends.length}</div>
                    {friends.length === 0 ? (
                        <div className="w-full text-center text-grey-60 text-[14px] py-8">아직 친구가 없어요. 친구 코드로 추가해보세요.</div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {friends.map((f) => (
                                <div key={f.memberId} className="w-full rounded-2xl bg-white shadow-[0px_5px_15px_-5px_rgba(35,48,59,0.10)] outline-1 outline-offset-[-1px] outline-grey-95 p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar src={f.profileImage} />
                                        <span className="text-[15px] font-medium text-grey-15">{f.nickname}</span>
                                    </div>
                                    <button onClick={() => handleDelete(f.memberId)} className="text-[12px] text-grey-60">삭제</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Friends;
