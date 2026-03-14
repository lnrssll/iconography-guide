-- @name MarkSectionSuperseded
UPDATE sections SET is_current = 0, superseded_by = :superseded_by WHERE id = :id;
