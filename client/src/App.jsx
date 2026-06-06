import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder Pages (we will implement these next)
import Instructions from "./pages/Instructions";
import Login from "./pages/Login";
import Ranking from "./pages/Ranking";
import Setup from "./pages/Setup";
import Planning from "./pages/Planning";
import Execution from "./pages/Execution";
import Result from "./pages/Result";

// Layout
import Navbar from "./components/Layout/Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="container mt-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Instructions />} />
              <Route path="/login" element={<Login />} />

              {/* Private Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/setup" element={<Setup />} />
                <Route path="/planning/:gameId" element={<Planning />} />
                <Route path="/execution/:gameId" element={<Execution />} />
                <Route path="/result/:gameId" element={<Result />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Instructions />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
