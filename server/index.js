import express from "express";
//to log http requests to the console
import morgan from "morgan";
//for middleware
import cors from "cors";
//this allows server to store login sessions
import session from "express-session";
import passport from "./authentication/passport.js";

// Import routes
import sessionRoutes from "./routes/sessions.js";
import networkRoutes from "./routes/network.js";
import gameRoutes from "./routes/games.js";
import rankingRoutes from "./routes/rankings.js";

const app = express();
const port = 3001;

// Middleware
//logs all incoming requests to the console for debugging and monitoring
app.use(morgan("dev"));
//allows express to read JSON request bodies
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Health check
app.get("/api/ping", (req, res) => res.send("pong"));

// Session setup
app.use(
  session({
    secret: "shhh, it's a secret for the exam",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/rankings", rankingRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
