import db from "../db.js";

export function getFullNetwork() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        l.id AS line_id,
        l.name AS line_name,
        l.color AS line_color,
        s.id AS station_id,
        s.name AS station_name,
        s.arabic_title,
        s.landmark_name,
        ls.position
      FROM line_stations ls
      JOIN lines l ON ls.line_id = l.id
      JOIN stations s ON ls.station_id = s.id
      ORDER BY l.id, ls.position
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const linesMap = new Map();

      rows.forEach((row) => {
        if (!linesMap.has(row.line_id)) {
          linesMap.set(row.line_id, {
            id: row.line_id,
            name: row.line_name,
            color: row.line_color,
            stations: [],
          });
        }

        linesMap.get(row.line_id).stations.push({
          id: row.station_id,
          name: row.station_name,
          arabicTitle: row.arabic_title,
          landmarkName: row.landmark_name,
          position: row.position,
        });
      });

      resolve(Array.from(linesMap.values()));
    });
  });
}

export function getStations() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        id,
        name,
        arabic_title AS arabicTitle,
        landmark_name AS landmarkName
      FROM stations
      ORDER BY id
    `;

    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getSegments() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        seg.id,
        seg.station_a_id AS stationAId,
        a.name AS stationAName,
        a.arabic_title AS stationAArabicTitle,
        a.landmark_name AS stationALandmarkName,
        seg.station_b_id AS stationBId,
        b.name AS stationBName,
        b.arabic_title AS stationBArabicTitle,
        b.landmark_name AS stationBLandmarkName
      FROM segments seg
      JOIN stations a ON seg.station_a_id = a.id
      JOIN stations b ON seg.station_b_id = b.id
      ORDER BY seg.id
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const segments = rows.map((row) => ({
        id: row.id,
        stationA: {
          id: row.stationAId,
          name: row.stationAName,
          arabicTitle: row.stationAArabicTitle,
          landmarkName: row.stationALandmarkName,
        },
        stationB: {
          id: row.stationBId,
          name: row.stationBName,
          arabicTitle: row.stationBArabicTitle,
          landmarkName: row.stationBLandmarkName,
        },
      }));

      resolve(segments);
    });
  });
}