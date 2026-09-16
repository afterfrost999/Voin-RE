import WritingPrompt from '@/components/findCoin/WritingPrompt';

const WriteCase = () => {
    return (
        <WritingPrompt
            title="그 모습을 보고 어떤 생각이나 감정을 느꼈나요?"
            tip="그때 그분의 행동을 돌이켜봤을 때, 느꼈던 감정이나 인상 깊었던 점을 편하게 적어보세요."
            placeholder="그 모습을 보고 느낀 감정이나 생각을 자유롭게 적어주세요."
            directLinkToAi='/memories-together/ai-classify'
            directLinkTo="/memories-together/categories"
            minLength={0}
            showBottomSheet={true}
            dataKey="writtenCase2"
        />
    );
}

export default WriteCase;
