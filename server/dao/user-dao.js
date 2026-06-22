import db from "../db.js";
import crypto from "crypto";

const KEYLEN = 64;

//find user by username, used for login
//find user by id, used for session management
//verify password by hashing the provided password with the stored salt and comparing it to the stored hash
export function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username = ?";

    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getUserById(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, username FROM users WHERE id = ?";

    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function checkPassword(user, password) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, user.salt, KEYLEN, { N: 16384 }, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString("hex") === user.hash);
    });
  });
}