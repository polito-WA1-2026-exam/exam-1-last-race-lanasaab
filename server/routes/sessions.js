import express from "express";
import passport from "../authentication/passport.js";

const router = express.Router();

// POST /api/sessions
router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        error: info?.message || "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      return res.json({
        id: user.id,
        username: user.username,
      });
    });
  })(req, res, next);
});

// GET /api/sessions/current
router.get("/current", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }

  return res.json(req.user);
});

// DELETE /api/sessions/current
router.delete("/current", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        error: "Logout failed",
      });
    }

    return res.status(200).json({});
  });
});

export default router;