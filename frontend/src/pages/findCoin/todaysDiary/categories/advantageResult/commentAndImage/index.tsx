import TopNavigation from "@/components/common/TopNavigation";
import ImageUploader from "@/components/advantageResult/ImageUploader";
import LargeTextField from "@/components/findCoin/LargeTextField";
import ActionButton from "@/components/common/ActionButton";

import { useState } from "react";
import { useActivityStore } from "@/store/useActivityStore";
import { useNavigate } from "react-router-dom";
import { saveDiaryCoin } from "@/services/coinService";

const CommentAndImage = () => {
    const [comment, setComment] = useState("");
    const [saving, setSaving] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const setActivityData = useActivityStore((state) => state.setData);
    const navigate = useNavigate();

    const handleComplete = async () => {
        if (saving) return;
        const trimmed = comment.trim();
        const data = useActivityStore.getState().data;
        setActivityData({ comment: trimmed, uploadedImage: data.uploadedImage });

        // 코인 영속화: 일기 본문 + 분류된 키워드로 서버에 저장
        try {
            setSaving(true);
            if (data.keywordId && data.writtenCase1) {
                await saveDiaryCoin({
                    content: data.writtenCase1,
                    keywordId: data.keywordId,
                    storyType: 'DAILY_DIARY',
                    comment: trimmed,
                    imageUrl: data.uploadedImage,
                    summary: data.classify,
                    isPublic: isPublic,
                });
            }
            navigate('/todays-diary/final-result');
        } catch (e) {
            console.error('코인 저장 실패:', e);
            alert('코인 저장에 실패했어요. 잠시 후 다시 시도해주세요.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <TopNavigation title={`그 순간을 기록하며,\n사진이나 한마디를 남겨보세요.`} />

            <div className="w-full h-full flex flex-col px-6 gap-y-4">
                <div className="min-h-[190px]">
                <ImageUploader />
                </div>
                
                <LargeTextField
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="다짐, 또는 기억해두고 싶은 한마디를 남겨보세요."
                    maxLength={300}
                />

                {/* 피드 공개 여부 */}
                <div className="w-full flex items-center justify-between rounded-2xl bg-grey-98 p-4">
                    <div className="flex flex-col">
                        <span className="text-[15px] font-semibold text-grey-15">피드에 공개할까요?</span>
                        <span className="text-[12px] text-grey-60">친구들의 피드에 이 카드가 보여요 (추후 수정 가능합니다)</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPublic((v) => !v)}
                        aria-label="피드 공개 여부"
                        className={`relative w-12 h-7 rounded-full transition-colors ${isPublic ? 'bg-VB-50' : 'bg-grey-90'}`}
                    >
                        <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${isPublic ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                </div>

                <div className="w-full mt-2 mb-4">
                    <ActionButton
                        buttonText={saving ? "저장 중..." : "완료"}
                        onClick={handleComplete}
                        disabled={saving}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentAndImage;