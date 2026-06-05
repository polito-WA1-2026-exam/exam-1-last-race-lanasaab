import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(
  join(__dirname, "db", "database_v4.sqlite"),
  (err) => {
    if (err) {
      console.error("Database connection error:", err.message);
    } else {
      console.log("Connected to SQLite database.");

      db.run("PRAGMA foreign_keys = ON");
      db.run("PRAGMA busy_timeout = 5000");
    }
  }
);

export default db;