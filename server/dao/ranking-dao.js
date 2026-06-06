import db from "../db.js";

export function getRanking() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.id AS user_id,
        u.username,
        MAX(CASE WHEN g.status = 'completed' THEN g.final_score ELSE 0 END) AS max_score,
        COUNT(CASE WHEN g.status = 'completed' THEN 1 ELSE NULL END) AS games_played
      FROM users u
      LEFT JOIN games g ON u.id = g.user_id
      GROUP BY u.id, u.username
      ORDER BY max_score DESC, games_played ASC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}