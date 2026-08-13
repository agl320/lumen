from __future__ import annotations

import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "server" / "storage.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS cards (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	front TEXT NOT NULL,
	back TEXT NOT NULL,
	score INTEGER NOT NULL DEFAULT 0,
	correct_count INTEGER NOT NULL DEFAULT 0,
	incorrect_count INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


def setup() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(SCHEMA)
        connection.commit()


if __name__ == "__main__":
    setup()
    print(f"Database ready at: {DB_PATH}")
