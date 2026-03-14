-- @name ListCurrentSectionsBySaint
SELECT id, saint_id, title, body, sort_order, created_at FROM sections WHERE saint_id = :saint_id AND is_current = 1 ORDER BY sort_order ASC;
