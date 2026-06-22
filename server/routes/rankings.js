import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import { getRanking } from "../dao/ranking-dao.js";

//O(U+G) where U is the number of users 
//and G is the number of completed games, 
// since we need to fetch and sort the completed games to generate the rankings.
const router = express.Router();

// GET /api/rankings
router.get("/", isLoggedIn, async (req, res) => {
  try {
    //calls getRanking from the DAO to fetch the top 10 completed games
    //and returns them as JSON response
    const rankings = await getRanking();
    res.json(rankings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rankings" });
  }
});

export default router;
