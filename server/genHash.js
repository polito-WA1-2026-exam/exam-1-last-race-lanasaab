import crypto from "crypto";

const password = "password";
const salt = crypto.randomBytes(16).toString("hex");
const KEYLEN = 64;

crypto.scrypt(password, salt, KEYLEN, { N: 16384 }, (err, derivedKey) => {
  if (err) throw err;
  console.log("SALT:", salt);
  console.log("HASH:", derivedKey.toString("hex"));
});
