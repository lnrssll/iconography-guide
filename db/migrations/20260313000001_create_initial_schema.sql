-- migrate:up

CREATE TABLE saints (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  birth_date  TEXT,
  repose_date TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE feast_days (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  saint_id   INTEGER NOT NULL REFERENCES saints(id),
  label      TEXT    NOT NULL,
  sort_month INTEGER,
  sort_day   INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE sections (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  saint_id      INTEGER NOT NULL REFERENCES saints(id),
  title         TEXT    NOT NULL,
  body          TEXT    NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_current    INTEGER NOT NULL DEFAULT 1,
  superseded_by INTEGER REFERENCES sections(id),
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE links (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  saint_id   INTEGER NOT NULL REFERENCES saints(id),
  label      TEXT    NOT NULL,
  url        TEXT    NOT NULL,
  deleted_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- migrate:down

DROP TABLE links;
DROP TABLE sections;
DROP TABLE feast_days;
DROP TABLE saints;
