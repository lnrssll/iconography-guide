-- @name MarkSectionDeleted
UPDATE sections SET is_current = 0 WHERE id = :id;
