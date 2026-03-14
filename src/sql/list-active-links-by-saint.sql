-- @name ListActiveLinksBySaint
SELECT id, saint_id, label, url, created_at FROM links WHERE saint_id = :saint_id AND deleted_at IS NULL ORDER BY created_at ASC;
