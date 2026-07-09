CREATE TABLE IF NOT EXISTS statuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status_id INTEGER NOT NULL DEFAULT 1 REFERENCES statuses(id),
  destination TEXT NOT NULL DEFAULT 'personal',
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO statuses (id, name) VALUES
  (1, 'draft'),
  (2, 'in-progress'),
  (3, 'ready'),
  (4, 'published');
