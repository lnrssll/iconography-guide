-- @name UpdateSaint
UPDATE saints SET name = :name, birth_date = :birth_date, repose_date = :repose_date WHERE id = :id;
