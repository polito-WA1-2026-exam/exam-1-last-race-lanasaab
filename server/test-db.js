import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, "db", "database_new.sqlite"));
const KEYLEN = 64;

db.get("SELECT * FROM users WHERE username = 'lana'", (err, user) => {
  if (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
  if (!user) {
    console.log("User 'lana' not found!");
    process.exit(1);
  }

  console.log("User found in DB:", user.username);
  console.log("Salt in DB:", user.salt);
  console.log("Hash in DB:", user.hash);

  const testPassword = "password";
  crypto.scrypt(testPassword, user.salt, KEYLEN, { N: 16384 }, (err, derivedKey) => {
    if (err) throw err;
    const derivedHash = derivedKey.toString("hex");
    console.log("Derived Hash for 'password':", derivedHash);
    console.log("Match:", derivedHash === user.hash);
    db.close();
  });
});
