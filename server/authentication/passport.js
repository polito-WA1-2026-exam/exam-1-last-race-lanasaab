import passport from "passport";
import LocalStrategy from "passport-local";

import {
  getUserByUsername,
  getUserById,
  checkPassword,
} from "../dao/user-dao.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);

      if (!user) {
        return done(null, false, {
          message: "Incorrect username",
        });
      }

      const valid = await checkPassword(user, password);

      if (!valid) {
        return done(null, false, {
          message: "Incorrect password",
        });
      }

      return done(null, {
        id: user.id,
        username: user.username,
      });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;