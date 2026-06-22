import express from "express";
import passport from "../authentication/passport.js";

const router = express.Router();

// POST /api/sessions
//this file manages user sessions
//post for user login
//get for fetching current session info: gets refer to : "who am i"
//delete for user logout

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
//when user logins in" client sends username and password
//passport local strategy checks the credentials against the database 
// the local strategy calls getUserByUsername() and checkPassword()
//if not valide -> return 401 with error message
//if valid -> passport creates a session and stores user info in req.user
//req.login() is called to establish the session,
//and then we return the user info as JSON response (excluding sensitive data like password)
// then serialize user id into session cookie
//and then deserialize user to get user from database

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

//efficiency of these routes is O(1) for the current session routes, as they involve simple checks and operations on the session object.

// The POST /api/sessions route is O(1) for the authentication step, 
// but the overall efficiency depends on the underlying user lookup and password verification, 
// which is typically O(1) with proper indexing and hashing. 
// The GET and DELETE routes are O(1) as they operate directly on the session without needing to query the database.
