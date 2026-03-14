-- @name ListFeastDaysBySaint
SELECT id, saint_id, label, sort_month, sort_day FROM feast_days WHERE saint_id = :saint_id ORDER BY sort_month ASC, sort_day ASC;
