// src/pages/auth/KakaoCallback.tsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import type { Member } from '@/services/authService';

const KakaoCallback = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const { actions } = useAuthStore();
    const hasRun = useRef(false); // StrictMode 두 번 실행 방지

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(search);
        const token = params.get('token'); // 서버 콜백 방식: ?token=...
        const type = (params.get('type') as 'Login' | 'Signup' | null) ?? null;

        if (!token) {
            const error = params.get('error') ?? 'unknown';
            console.error('카카오 로그인 실패: token missing', error);
            alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
            navigate('/login', { replace: true });
            return;
        }

        (async () => {
            try {
                // 1) 토큰 저장
                authService.storeAuthData(token, null as any);

                // 2) 서버에서 내 정보(닉네임/프로필사진)를 불러와 스토어를 채움
                //    (시크릿 창/새 세션처럼 localStorage 가 비어 있어도 프로필이 뜨도록)
                try {
                    const resp = await fetch('/api/members/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (resp.ok) {
                        const api = await resp.json();
                        const m = api.data;
                        const member: Member = {
                            id: m.id,
                            nickname: m.nickname,
                            profileImage: m.profileImage ?? null,
                            kakaoId: m.kakaoId,
                            friendCode: m.friendCode,
                            isActive: m.isActive,
                            createdAt: m.createdAt ?? '',
                            updatedAt: m.updatedAt ?? '',
                        };
                        actions.setAuthData(token, member);
                    } else {
                        await actions.checkAuthStatus();
                    }
                } catch {
                    await actions.checkAuthStatus();
                }

                // 3) 최종 목적지 결정: sessionStorage > type 파라미터 > 기본값(/home)
                const saved = sessionStorage.getItem('postLoginRedirect');
                const fallback = type === 'Signup' ? '/signup' : '/home';
                const to = saved || fallback;
                sessionStorage.removeItem('postLoginRedirect');

                // 4) URL 정리 후 이동(선택)
                window.history.replaceState({}, '', '/api/auth/kakao/callback');
                // isNew 로 신규 가입 여부 확실하게 표시함
                const isNew = type === 'Signup';
                sessionStorage.setItem('isNewMember', isNew ? '1' : '0');

                navigate(to, { replace: true });
            } catch (e) {
                console.error('콜백 처리 중 오류:', e);
                alert('로그인 처리에 실패했습니다.');
                navigate('/login', { replace: true });
            }
        })();
    }, [search, navigate, actions]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">카카오 로그인 처리 중입니다...</p>
        </div>
    );
};

export default KakaoCallback;
