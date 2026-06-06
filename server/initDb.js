import sqlite3 from "sqlite3";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "db", "database_new.sqlite");
const sqlPath = join(__dirname, "db", "db.sql");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }

  db.run("PRAGMA busy_timeout = 5000");
  console.log("Connected to SQLite database for initialization.");

  const sql = fs.readFileSync(sqlPath, "utf8");

  db.exec(sql, (err) => {
    if (err) {
      console.error("Error initializing database:", err.message);
    } else {
      console.log("Database initialized successfully from db.sql.");
    }
    db.close();
  });
});
