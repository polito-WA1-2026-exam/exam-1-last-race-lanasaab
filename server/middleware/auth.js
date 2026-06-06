import express from "express";
import passport from "passport";

const router = express.Router();

router.post("/sessions", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json(info);
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json(user);
    });
  })(req, res, next);
});

router.get("/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }

  return res.status(401).json({
    error: "Not authenticated",
  });
});

router.delete("/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

export default router;