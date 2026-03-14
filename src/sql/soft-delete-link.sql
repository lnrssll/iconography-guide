-- @name SoftDeleteLink
UPDATE links SET deleted_at = :deleted_at WHERE id = :id;
