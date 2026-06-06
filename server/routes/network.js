import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import { getFullNetwork, getStations, getSegments } from "../dao/network-dao.js";

const router = express.Router();

// All network routes require authentication
router.use(isLoggedIn);

// GET /api/network
router.get("/", async (req, res) => {
  try {
    const network = await getFullNetwork();
    res.json(network);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch network" });
  }
});

// GET /api/network/stations
router.get("/stations", async (req, res) => {
  try {
    const stations = await getStations();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stations" });
  }
});

// GET /api/network/segments
router.get("/segments", async (req, res) => {
  try {
    const segments = await getSegments();
    res.json(segments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch segments" });
  }
});

export default router;
