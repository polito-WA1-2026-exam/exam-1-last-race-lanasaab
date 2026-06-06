import db from "../db.js";

export function createGame(userId, startStationId, destinationStationId) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO games (
        user_id,
        start_station_id,
        destination_station_id,
        status,
        initial_coins
      )
      VALUES (?, ?, ?, 'planning', 20)
    `;

    db.run(sql, [userId, startStationId, destinationStationId], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        id: this.lastID,
        userId,
        startStationId,
        destinationStationId,
        status: "planning",
        initialCoins: 20,
      });
    });
  });
}

export function getGameById(gameId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        g.id,
        g.user_id AS userId,
        g.start_station_id AS startStationId,
        start.name AS startStationName,
        start.arabic_title AS startArabicTitle,
        start.landmark_name AS startLandmarkName,
        g.destination_station_id AS destinationStationId,
        dest.name AS destinationStationName,
        dest.arabic_title AS destinationArabicTitle,
        dest.landmark_name AS destinationLandmarkName,
        g.status,
        g.initial_coins AS initialCoins,
        g.final_score AS finalScore,
        g.created_at AS createdAt,
        g.completed_at AS completedAt
      FROM games g
      JOIN stations start ON g.start_station_id = start.id
      JOIN stations dest ON g.destination_station_id = dest.id
      WHERE g.id = ?
    `;

    db.get(sql, [gameId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getAllStations() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        id,
        name,
        arabic_title AS arabicTitle,
        landmark_name AS landmarkName
      FROM stations
    `;

    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getAllSegments() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        id,
        station_a_id AS stationAId,
        station_b_id AS stationBId
      FROM segments
    `;

    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getAllLineStations() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        line_id AS lineId,
        station_id AS stationId,
        position
      FROM line_stations
      ORDER BY line_id, position
    `;

    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getRandomEvent() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, description, effect
      FROM events
      ORDER BY RANDOM()
      LIMIT 1
    `;

    db.get(sql, [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function addGameStep(gameId, stepOrder, fromStationId, toStationId, eventId, coinsAfterStep) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO game_steps (
        game_id,
        step_order,
        from_station_id,
        to_station_id,
        event_id,
        coins_after_step
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [gameId, stepOrder, fromStationId, toStationId, eventId, coinsAfterStep],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

export function completeGame(gameId, finalScore) {
  return new Promise((resolve, reject) => {
    const safeScore = Math.max(0, finalScore);

    const sql = `
      UPDATE games
      SET status = 'completed',
          final_score = ?,
          completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(sql, [safeScore, gameId], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

export function failGame(gameId) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE games
      SET status = 'failed',
          final_score = 0,
          completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(sql, [gameId], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

export function getGameSteps(gameId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        gs.id,
        gs.step_order AS stepOrder,
        gs.from_station_id AS fromStationId,
        from_station.name AS fromStationName,
        from_station.arabic_title AS fromArabicTitle,
        from_station.landmark_name AS fromLandmarkName,
        gs.to_station_id AS toStationId,
        to_station.name AS toStationName,
        to_station.arabic_title AS toArabicTitle,
        to_station.landmark_name AS toLandmarkName,
        e.description AS eventDescription,
        e.effect AS eventEffect,
        gs.coins_after_step AS coinsAfterStep
      FROM game_steps gs
      JOIN stations from_station ON gs.from_station_id = from_station.id
      JOIN stations to_station ON gs.to_station_id = to_station.id
      JOIN events e ON gs.event_id = e.id
      WHERE gs.game_id = ?
      ORDER BY gs.step_order
    `;

    db.all(sql, [gameId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}