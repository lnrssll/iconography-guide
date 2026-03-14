-- @name GetSaint
SELECT id, name, birth_date, repose_date, created_at FROM saints WHERE id = :id;
