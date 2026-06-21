import db from "../db.js";
//create a new game with the given userId, startStationId, and destinationStationId
//explanation of logic:
// 1. The function returns a Promise that resolves with the newly created game object.
// 2. It constructs an SQL INSERT statement to add a new row to the games table with the provided userId, startStationId, and destinationStationId.
// 3. The status is set to 'planning' and initial_coins is set to 20.
// 4. The db.run method executes the SQL statement, and if successful, resolves the Promise with the new game object containing its id and other details. 

//create new game

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
// execute sql statememt 
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
// get game by id and join stations twice 
//to get the start and dest station details
//this returns useful data to frontend 
//efficiency of this function is O(1) because it retrieves a single game by its primary key (id) 
//and joins with the stations table, which is indexed.
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
//returns all stations 
//used for posting a new game
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
//returns all segments
//used for validating a route
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
//the server chooses the random event
//to prevent cheating by client 
//client should not be able to decide if it gets positive/negative event
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

//insert one row into game_steps table for each step in the route
//store coins after each step 
//so the exec page can show updated coin total after each event
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
//for invalid route
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

// Efficiency:
// getGameSteps is O(k), where k is the number of steps for the selected game.
// The query retrieves all steps in one database call and joins stations/events for display.
// For larger data, an index on game_steps(game_id) would improve lookup performance.