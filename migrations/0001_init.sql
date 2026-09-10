CREATE TABLE IF NOT EXISTS visitors (
    ip TEXT PRIMARY KEY,
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    visit_count INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    visited_at TEXT NOT NULL,
    path TEXT NOT NULL DEFAULT '/'
);

CREATE INDEX IF NOT EXISTS idx_visits_ip
ON visits(ip);

CREATE INDEX IF NOT EXISTS idx_visits_visited_at
ON visits(visited_at);
