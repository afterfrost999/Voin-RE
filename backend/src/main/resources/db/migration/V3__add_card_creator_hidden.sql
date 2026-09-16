-- 작성자가 '친구에게 써준 카드' 목록에서 숨겼는지 여부 (실제 카드는 유지)
ALTER TABLE cards ADD COLUMN creator_hidden boolean NOT NULL DEFAULT false;
