import fs from "fs";
import db from "./db.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlFile = join(__dirname, "db", "db.sql");
const schema = fs.readFileSync(sqlFile, "utf8");

db.serialize(() => {
  db.exec(schema, (err) => {
    if (err) {
      console.error("❌ Database initialization failed:");
      console.error(err.message);
      process.exit(1);
    }

    console.log("✅ Database initialized successfully.");

    db.close((closeErr) => {
      if (closeErr) {
        console.error("Error closing database:", closeErr.message);
      } else {
        console.log("✅ Database connection closed.");
      }
      process.exit(0);
    });
  });
});