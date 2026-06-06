import db from "../db.js";

export function getRanking() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.id AS user_id,
        u.username,
        MAX(g.final_score) AS max_score,
        COUNT(g.id) AS games_played
      FROM users u
      JOIN games g ON u.id = g.user_id
      WHERE g.status = 'completed'
      GROUP BY u.id, u.username
      ORDER BY max_score DESC, games_played ASC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}