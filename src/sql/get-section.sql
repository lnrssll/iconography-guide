-- @name GetSection
SELECT id, saint_id, title, body, sort_order, is_current, superseded_by, created_at FROM sections WHERE id = :id;
