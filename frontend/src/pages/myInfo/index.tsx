// src/pages/myInfo/index.tsx
import TopNavigation from '@/components/common/TopNavigation';
import ProfileUploader from '@/components/ProfileUploader';
import TextInput from '@/components/TextInput';
import ActionButton from '@/components/common/ActionButton';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import type { Member } from '@/services/authService';

type ApiResponse<T> = { success: boolean; message: string; data: T };

type MemberResponse = {
    id: string;
    nickname: string;
    profileImage?: string | null;
    kakaoId: string;
    friendCode: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

const MyInfo = () => {
    const navigate = useNavigate();
    const { userInfo, actions } = useAuthStore();

    const [nickname, setNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [finalProfileImage, setFinalProfileImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    // 현재 값 프리필: 스토어 → (없으면) /api/members/me
    useEffect(() => {
        (async () => {
            let base: MemberResponse | null =
                (userInfo as unknown as MemberResponse | null) ??
                (authService.getStoredUserInfo?.() as unknown as MemberResponse | null) ??
                null;

            if (!base) {
                try {
                    const token = authService.getStoredToken?.();
                    const authHeader = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '';
                    const resp = await fetch('/api/members/me', {
                        headers: authHeader ? { Authorization: authHeader } : undefined,
                        credentials: 'include',
                    });
                    if (resp.ok) {
                        const api: ApiResponse<MemberResponse> = await resp.json();
                        base = api.data ?? null;
                    }
                } catch {
                    // 조회 실패 시 프리필 없이 진행
                }
            }

            if (base) {
                setNickname(base.nickname ?? '');
                setProfileImage(base.profileImage ?? null);
            }
            setBusy(false);
        })();
        // userInfo 는 최초 1회 기준으로만 프리필
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProfileImageChange = (imageUrl: string | null) => {
        setFinalProfileImage(imageUrl);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const sanitizedValue = rawValue.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]/g, '');
        setNickname(sanitizedValue);

        if (rawValue !== sanitizedValue) setError('공백없이 한글, 영문, 숫자만 입력해주세요.');
        else if (sanitizedValue.length > 0 && sanitizedValue.length < 3) setError('3글자 이상 입력해주세요.');
        else setError(null);
    };

    const handleClear = () => {
        setNickname('');
        setError(null);
    };

    const handleSave = async () => {
        if (saving) return;
        try {
            setSaving(true);
            const rawToken = authService.getStoredToken?.();
            if (!rawToken) {
                alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
                navigate('/login', { replace: true });
                return;
            }
            const authHeader = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

            const resp = await fetch('/api/members/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: authHeader },
                credentials: 'include',
                body: JSON.stringify({
                    nickname,
                    profileImage: finalProfileImage ?? profileImage,
                }),
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`내 정보 수정 실패: ${resp.status} ${text}`);
            }

            const api: ApiResponse<MemberResponse> = await resp.json();
            const updated = api.data;

            const mappedMember: Member = {
                id: updated.id,
                nickname: updated.nickname,
                profileImage: updated.profileImage ?? null,
                kakaoId: updated.kakaoId,
                friendCode: updated.friendCode,
                isActive: updated.isActive,
                createdAt: updated.createdAt ?? '',
                updatedAt: updated.updatedAt ?? '',
            };

            // 스토어 동기화 → 홈 좌상단 즉시 반영
            actions.setAuthData(rawToken, mappedMember);
            navigate('/home');
        } catch (e) {
            console.error(e);
            alert(e instanceof Error ? e.message : '내 정보 수정 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (busy) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-grey-60">내 정보를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col pt-4">
            <TopNavigation title="내 정보" caption="프로필 사진과 닉네임을 바꿀 수 있어요." onBackClick={() => navigate('/home')} />
            <ProfileUploader defaultImage={profileImage} onChange={handleProfileImageChange} />
            <div className="w-full px-6">
                <TextInput
                    label="닉네임"
                    placeholder="닉네임을 입력해주세요"
                    maxLength={10}
                    onChange={handleChange}
                    onClear={handleClear}
                    value={nickname}
                    error={error}
                />
            </div>
            <div className="mt-auto pb-4 px-6">
                <ActionButton
                    onClick={handleSave}
                    disabled={!nickname || nickname.length < 3 || !!error || saving}
                    buttonText={saving ? '저장 중...' : '저장'}
                />
            </div>
        </div>
    );
};

export default MyInfo;
