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
      //this calls user-dao.js
      //it takes entered password + stored salt -> runs scrypt and compare hashes
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

//runs once after login to store only the user id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//runs on every authenticated request
//browser sends cookie and passport calls getUserById(1)
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