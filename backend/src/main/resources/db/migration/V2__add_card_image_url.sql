-- 카드에 첨부 이미지 URL 컬럼 추가 (카드 생성 시 올린 사진)
ALTER TABLE cards ADD COLUMN image_url varchar(500);
