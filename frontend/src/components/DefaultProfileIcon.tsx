// 기본 프로필 아이콘 (사람 실루엣). 프로필 이미지가 없을 때 공통으로 사용.
interface Props {
    className?: string;
}

const DefaultProfileIcon = ({ className = '' }: Props) => (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="#E5E7EB" />
        <circle cx="32" cy="26" r="11" fill="#B6BAC2" />
        <path d="M13 53c0-10.5 8.5-17 19-17s19 6.5 19 17v3H13v-3z" fill="#B6BAC2" />
    </svg>
);

export default DefaultProfileIcon;
