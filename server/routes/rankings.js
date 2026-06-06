import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import { getRanking } from "../dao/ranking-dao.js";

const router = express.Router();

// GET /api/rankings
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const rankings = await getRanking();
    res.json(rankings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rankings" });
  }
});

export default router;
