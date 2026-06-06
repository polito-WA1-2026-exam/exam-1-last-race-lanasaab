# Exam #1: "Last Race"
## Student: [Your Name]
## ID: [Your ID]

## 1. Server-side

### HTTP APIs
- **Sessions**
  - `POST /api/sessions`: Authenticates a user and starts a session.
  - `GET /api/sessions/current`: Returns the currently logged-in user.
  - `DELETE /api/sessions/current`: Logs out the user and destroys the session.
- **Network**
  - `GET /api/network`: Returns the full metro network (lines with their stations).
  - `GET /api/network/stations`: Returns a list of all stations.
  - `GET /api/network/segments`: Returns all physical connections between stations.
- **Games**
  - `POST /api/games`: Starts a new game, assigning start/destination with distance ≥ 3.
  - `GET /api/games/:id`: Returns status, score, and steps for a specific game.
  - `POST /api/games/:id/submit`: Submits a route for validation and executes the journey.
- **Rankings**
  - `GET /api/rankings`: Returns the global leaderboard with best scores and games played.

### Database Tables
- `users`: Stores user credentials (username, hash, and salt).
- `stations`: List of metro stations with names, Arabic titles, and landmarks.
- `lines`: Metro line definitions (name and color).
- `line_stations`: Maps stations to lines and defines their sequence/position.
- `segments`: Defines the physical bidirectional connections between stations.
- `events`: Stores the 8 random events (description and coin effect).
- `games`: Tracks game instances, including status, scores, and timestamps.
- `game_steps`: Records the history of steps and events for completed games.

## 2. Client-side

### React Routes
- `/`: Instructions page (accessible to anonymous users).
- `/login`: User authentication page.
- `/setup`: Phase 1: Viewing the full network map and starting a game.
- `/planning/:gameId`: Phase 2: Building a route within 90 seconds (hidden lines).
- `/execution/:gameId`: Phase 3: Step-by-step journey with event reveals.
- `/result/:gameId`: Phase 4: Final score display and replay options.
- `/ranking`: The global leaderboard showing the best results of registered users.

### Main React Components
- `Navbar`: Handles navigation and displays user session status.
- `ProtectedRoute`: Protects private routes from unauthorized access.
- `AuthContext`: Manages global authentication state across the application.
- `Instructions`, `Login`, `Setup`, `Planning`, `Execution`, `Result`, `Ranking`: Core page-level views.

## 3. Overall

### Screenshots
- **Ranking Page:** [Link to your ranking screenshot in repo]
- **Game Execution:** [Link to your game execution screenshot in repo]

### User Credentials
- **Username:** `lana` | **Password:** `password`
- **Username:** `sara` | **Password:** `password`
- **Username:** `adam` | **Password:** `password`

### AI Usage
AI was utilized to design the metro network data (Lebanese cities), optimize the SQL queries (specifically for line-change validation), and architect the React SPA structure. The AI's output was manually verified for strict compliance with the project's distance rules and interchange station constraints.
