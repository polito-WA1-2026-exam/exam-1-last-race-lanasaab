import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'db', 'database_new.sqlite');
const KEYLEN = 64;

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.log('Usage: node server/addUser.js <username> <password>');
    process.exit(1);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
});

const salt = crypto.randomBytes(16).toString('hex');

crypto.scrypt(password, salt, KEYLEN, { N: 16384 }, (err, derivedKey) => {
    if (err) {
        console.error('Encryption error:', err);
        process.exit(1);
    }

    const hash = derivedKey.toString('hex');
    const sql = 'INSERT INTO users (username, hash, salt) VALUES (?, ?, ?)';

    db.run(sql, [username, hash, salt], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                console.error(`Error: User "${username}" already exists.`);
            } else {
                console.error('Error adding user:', err.message);
            }
        } else {
            console.log(`Successfully added user "${username}" with ID ${this.lastID}.`);
        }
        db.close();
    });
});
