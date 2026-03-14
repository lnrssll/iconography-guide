// Raw SQL queries. One named constant per query.

// ---- Saints ----

export const LIST_SAINTS = `
  SELECT id, name, birth_date, repose_date, created_at
  FROM saints
  ORDER BY name ASC
`

export const GET_SAINT = `
  SELECT id, name, birth_date, repose_date, created_at
  FROM saints
  WHERE id = ?
`

export const INSERT_SAINT = `
  INSERT INTO saints (name, birth_date, repose_date)
  VALUES (?, ?, ?)
`

export const UPDATE_SAINT = `
  UPDATE saints
  SET name = ?, birth_date = ?, repose_date = ?
  WHERE id = ?
`

// ---- Feast Days ----

export const LIST_FEAST_DAYS_BY_SAINT = `
  SELECT id, saint_id, label, sort_month, sort_day
  FROM feast_days
  WHERE saint_id = ?
  ORDER BY sort_month ASC, sort_day ASC
`

export const INSERT_FEAST_DAY = `
  INSERT INTO feast_days (saint_id, label, sort_month, sort_day)
  VALUES (?, ?, ?, ?)
`

export const DELETE_FEAST_DAY = `
  DELETE FROM feast_days WHERE id = ?
`

// ---- Sections ----

export const LIST_CURRENT_SECTIONS_BY_SAINT = `
  SELECT id, saint_id, title, body, sort_order, created_at
  FROM sections
  WHERE saint_id = ? AND is_current = 1
  ORDER BY sort_order ASC
`

export const INSERT_SECTION = `
  INSERT INTO sections (saint_id, title, body, sort_order)
  VALUES (?, ?, ?, ?)
`

export const MARK_SECTION_SUPERSEDED = `
  UPDATE sections SET is_current = 0, superseded_by = ? WHERE id = ?
`

export const MARK_SECTION_DELETED = `
  UPDATE sections SET is_current = 0 WHERE id = ?
`

// ---- Links ----

export const LIST_ACTIVE_LINKS_BY_SAINT = `
  SELECT id, saint_id, label, url, created_at
  FROM links
  WHERE saint_id = ? AND deleted_at IS NULL
  ORDER BY created_at ASC
`

export const INSERT_LINK = `
  INSERT INTO links (saint_id, label, url)
  VALUES (?, ?, ?)
`

export const SOFT_DELETE_LINK = `
  UPDATE links SET deleted_at = unixepoch() WHERE id = ?
`
