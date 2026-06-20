PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS game_steps;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS segments;
DROP TABLE IF EXISTS line_stations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS lines;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    hash TEXT NOT NULL,
    salt TEXT NOT NULL
);

CREATE TABLE stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    arabic_title TEXT NOT NULL,
    landmark_name TEXT NOT NULL
);

CREATE TABLE lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL
);

CREATE TABLE line_stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_id INTEGER NOT NULL,
    station_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    UNIQUE(line_id, station_id),
    UNIQUE(line_id, position),
    FOREIGN KEY(line_id) REFERENCES lines(id),
    FOREIGN KEY(station_id) REFERENCES stations(id)
);

CREATE TABLE segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_a_id INTEGER NOT NULL,
    station_b_id INTEGER NOT NULL,
    UNIQUE(station_a_id, station_b_id),
    CHECK(station_a_id < station_b_id),
    FOREIGN KEY(station_a_id) REFERENCES stations(id),
    FOREIGN KEY(station_b_id) REFERENCES stations(id)
);

CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    effect INTEGER NOT NULL CHECK(effect BETWEEN -4 AND 4)
);

CREATE TABLE games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    start_station_id INTEGER NOT NULL,
    destination_station_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('planning', 'completed', 'failed')),
    initial_coins INTEGER DEFAULT 20,
    final_score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(start_station_id) REFERENCES stations(id),
    FOREIGN KEY(destination_station_id) REFERENCES stations(id)
);

CREATE TABLE game_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    step_order INTEGER NOT NULL,
    from_station_id INTEGER NOT NULL,
    to_station_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    coins_after_step INTEGER NOT NULL,
    FOREIGN KEY(game_id) REFERENCES games(id),
    FOREIGN KEY(from_station_id) REFERENCES stations(id),
    FOREIGN KEY(to_station_id) REFERENCES stations(id),
    FOREIGN KEY(event_id) REFERENCES events(id)
);

INSERT INTO users (id, username, hash, salt) VALUES
(1, 'lana', 'd66e3cb88a00968b5f82f39f167cfcdcb69e13c38152cdc364e556d100ea17f040d78ecc1ac24f5169c6d50e28f6202a16e4aaecdd8590dca778f492801bc5ff', 'dffd24b63221651121882d3420de87f4'),
(2, 'sara', 'd66e3cb88a00968b5f82f39f167cfcdcb69e13c38152cdc364e556d100ea17f040d78ecc1ac24f5169c6d50e28f6202a16e4aaecdd8590dca778f492801bc5ff', 'dffd24b63221651121882d3420de87f4'),
(3, 'adam', 'd66e3cb88a00968b5f82f39f167cfcdcb69e13c38152cdc364e556d100ea17f040d78ecc1ac24f5169c6d50e28f6202a16e4aaecdd8590dca778f492801bc5ff', 'dffd24b63221651121882d3420de87f4');

INSERT INTO stations (id, name, arabic_title, landmark_name) VALUES
(1, 'Beirut', 'بيروت', 'صخرة الروشة'),
(2, 'Sidon', 'صيدا', 'قلعة صيدا البحرية'),
(3, 'Tyre', 'صور', 'آثار صور'),
(4, 'Baalbek', 'بعلبك', 'معابد بعلبك'),
(5, 'Tripoli', 'طرابلس', 'قلعة طرابلس'),
(6, 'Byblos', 'جبيل', 'قلعة جبيل'),
(7, 'Zahle', 'زحلة', 'وادي البردوني'),
(8, 'Jounieh', 'جونية', 'خليج جونية'),
(9, 'Jezzine', 'جزين', 'شلال جزين'),
(10, 'Batroun', 'البترون', 'سور البترون البحري'),
(11, 'Nabatieh', 'النبطية', 'سوق النبطية'),
(12, 'Chouf', 'الشوف', 'أرز الشوف');

INSERT INTO lines (id, name, color) VALUES
(1, 'Coast Line', '#3498db'),
(2, 'Mountain Line', '#27ae60'),
(3, 'Bekaa Line', '#f1c40f'),
(4, 'North-South Line', '#e74c3c');

INSERT INTO line_stations (line_id, station_id, position) VALUES
(1, 5, 0),
(1, 10, 1),
(1, 6, 2),
(1, 8, 3),
(1, 1, 4),
(1, 2, 5),
(1, 3, 6),

(2, 1, 0),
(2, 12, 1),
(2, 9, 2),
(2, 11, 3),

(3, 4, 0),
(3, 7, 1),
(3, 1, 2),

(4, 5, 0),
(4, 4, 1),
(4, 7, 2),
(4, 2, 3);

INSERT INTO segments (station_a_id, station_b_id) VALUES
(5, 10),
(6, 10),
(6, 8),
(1, 8),
(1, 2),
(2, 3),
(1, 12),
(9, 12),
(9, 11),
(4, 7),
(1, 7),
(4, 5),
(2, 7);

INSERT INTO events (description, effect) VALUES
('Quiet journey through the cedars', 0),
('Wrong platform in Beirut', -2),
('Kind passenger shared some manakish', 1),
('Train delay at the border', -1),
('Found a lost wallet with coins', 3),
('Beautiful sunset view', 2),
('Unexpected ticket inspection fine', -3),
('Coffee with a friend', 4);

INSERT INTO games (user_id, start_station_id, destination_station_id, status, initial_coins, final_score, completed_at) VALUES
(1, 5, 1, 'completed', 20, 25, '2026-06-01 14:30:00'),
(2, 1, 2, 'completed', 20, 18, '2026-06-02 11:40:00');

INSERT INTO game_steps (
    game_id,
    step_order,
    from_station_id,
    to_station_id,
    event_id,
    coins_after_step
) VALUES
-- Game 1: Tripoli -> Batroun -> Byblos -> Jounieh -> Beirut
(1, 0, 5, 10, 5, 23),
(1, 1, 10, 6, 6, 25),
(1, 2, 6, 8, 1, 25),
(1, 3, 8, 1, 1, 25),

-- Game 2: Beirut -> Sidon
(2, 0, 1, 2, 2, 18);
