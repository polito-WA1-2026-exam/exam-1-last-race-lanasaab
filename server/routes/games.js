import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import * as gameDao from "../dao/game-dao.js";
import { getShortestDistance, validateRoute } from "../utils/game-utils.js";

const router = express.Router();

// POST /api/games - Start a new game
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const stations = await gameDao.getAllStations();
    const segments = await gameDao.getAllSegments();

    let startStation, destStation;
    let distance = -1;

    // Pick random start and destination with distance >= 3
    // We try multiple times if needed
    let attempts = 0;
    while (distance < 3 && attempts < 100) {
      startStation = stations[Math.floor(Math.random() * stations.length)];
      destStation = stations[Math.floor(Math.random() * stations.length)];

      if (startStation.id !== destStation.id) {
        distance = getShortestDistance(stations, segments, startStation.id, destStation.id);
      }
      attempts++;
    }

    if (distance < 3) {
      return res.status(500).json({ error: "Failed to generate a valid game" });
    }

    const game = await gameDao.createGame(req.user.id, startStation.id, destStation.id);
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: "Failed to create game" });
  }
});

// GET /api/games/:id - Get game status
router.get("/:id", isLoggedIn, async (req, res) => {
  const gameId = Number(req.params.id);

  if (!Number.isInteger(gameId) || gameId <= 0) {
    return res.status(400).json({ error: "Invalid game id" });
  }

  try {
    const game = await gameDao.getGameById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    
    // Safety: only owner can see their game
    if (game.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    // If completed/failed, include steps
    if (game.status !== 'planning') {
      const steps = await gameDao.getGameSteps(game.id);
      game.steps = steps;
    }

    res.json(game);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch game" });
  }
});

// POST /api/games/:id/submit - Submit route
router.post("/:id/submit", isLoggedIn, async (req, res) => {
  const gameId = Number(req.params.id);

  if (!Number.isInteger(gameId) || gameId <= 0) {
    return res.status(400).json({ error: "Invalid game id" });
  }

  const { route } = req.body; // Array of { fromId, toId }

  // Basic validation
  if (!Array.isArray(route)) {
    return res.status(400).json({ error: "Route must be an array of segments" });
  }

  try {
    const game = await gameDao.getGameById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    if (game.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
    if (game.status !== 'planning') return res.status(400).json({ error: "Game already submitted" });

    const lineStations = await gameDao.getAllLineStations();
    const segments = await gameDao.getAllSegments();

    const isValid = validateRoute(route, game.startStationId, game.destinationStationId, lineStations, segments);

    if (!isValid) {
      await gameDao.failGame(game.id);
      return res.json({ status: 'failed', finalScore: 0 });
    }

    // Process route with random events
    let currentCoins = game.initialCoins;
    const steps = [];

    for (let i = 0; i < route.length; i++) {
      const event = await gameDao.getRandomEvent();
      currentCoins += event.effect;
      
      await gameDao.addGameStep(
        game.id,
        i,
        route[i].fromId,
        route[i].toId,
        event.id,
        currentCoins
      );

      steps.push({
        fromId: route[i].fromId,
        toId: route[i].toId,
        event,
        coinsAfterStep: currentCoins
      });
    }

    const finalScore = Math.max(0, currentCoins);
    await gameDao.completeGame(game.id, finalScore);

    res.json({
      status: 'completed',
      finalScore,
      steps
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit game" });
  }
});

export default router;
