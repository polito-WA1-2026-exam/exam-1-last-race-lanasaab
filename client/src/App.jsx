import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import Login from "./pages/Login";
import Ranking from "./pages/Ranking";
import Setup from "./pages/Setup";
import Planning from "./pages/Planning";
import Execution from "./pages/Execution";
import Result from "./pages/Result";
import Journey from "./pages/Journey";
import Navbar from "./components/Layout/Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login";

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}

      <main className="w-100">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/login" element={<Login />} />

          {/* Private Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/planning/:gameId" element={<Planning />} />
            <Route path="/execution/:gameId" element={<Execution />} />
            <Route path="/result/:gameId" element={<Result />} />
            <Route path="/journey/:gameId" element={<Journey />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Instructions />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;