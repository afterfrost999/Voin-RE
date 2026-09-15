import { create } from 'zustand';

// CaseReview, TodaysDiary 등 다양한 활동에서 사용할 데이터 타입
export interface ActivityData {
    categoryName?: string;
    caseName?: string;
    writtenCase1?: string;
    writtenCase2?: string;
    strengthName?: string;
    strengthDescription?: string;
    coinColor?: string;
    fullDescription?: string;
    coinName?: string;
    uploadedImage?: string;
    comment?: string;
    classify?: string;
    coinId?: number;      // 분류된 카테고리(코인) ID — 저장 시 사용
    keywordId?: number;   // 분류된 키워드 ID — 저장 시 사용
}

interface ActivityStore {
    data: ActivityData;
    setData: (data: Partial<ActivityData>) => void;
    reset: () => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
    data: {},
    setData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
    reset: () => set({ data: {} }),
}));