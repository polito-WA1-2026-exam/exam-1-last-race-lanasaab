import express from "express";
//middleware to check if user is logged in before accessing network routes
import { isLoggedIn } from "../middleware/auth.js";
import { getFullNetwork, getStations, getSegments } from "../dao/network-dao.js";

//imports the DAO functions to fetch the full network from database
const router = express.Router();

// All network routes require authentication
router.use(isLoggedIn);

// GET /api/network - Fetch the full network of lines and stations
router.get("/", async (req, res) => {
  try {
    //gets full network from DAO and sends it as JSON
    //getFulllNetwork is more efficient than multiple queriesto fetch all necessary data in one go, 
    // reducing the number of database round-trips and improving performance
    const network = await getFullNetwork();
    res.json(network);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch network" });
  }
});

// GET /api/network/stations
//return stations from the database as JSON response
router.get("/stations", async (req, res) => {
  try {
    const stations = await getStations();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stations" });
  }
});

// GET /api/network/segments
//return segments (direct station pairs) from the database as JSON response
router.get("/segments", async (req, res) => {
  try {
    const segments = await getSegments();
    res.json(segments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch segments" });
  }
});

export default router;

// Efficiency: these routes are O(n) in the number of returned records.
// getFullNetwork is heavier because it joins line_stations, lines, and stations,
// but it is still efficient for this project because the network is small and retrieved in one query.
// Since the network is static, a possible optimization would be caching it in memory.