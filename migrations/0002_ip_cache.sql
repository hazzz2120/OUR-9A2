CREATE TABLE IF NOT EXISTS ip_geo (
    ip TEXT PRIMARY KEY,
    city TEXT,
    region TEXT,
    country TEXT,
    company TEXT,
    asn TEXT,
    updated_at TEXT NOT NULL
);