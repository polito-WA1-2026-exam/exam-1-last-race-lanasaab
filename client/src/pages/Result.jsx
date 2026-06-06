import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { GameAPI } from "../api";
import { Trophy, Home, RotateCcw, Coins } from "lucide-react";

const Result = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await GameAPI.getGameStatus(gameId);
        setGame(data);
      } catch (err) {
        setError("Failed to load game results.");
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  const isSuccess = game.finalScore > 0;

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-lg border-0 text-center p-5" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="mb-4">
          <Trophy size={80} className={isSuccess ? "text-warning" : "text-secondary"} />
        </div>
        
        <h2 className="display-4 fw-bold mb-2">Game Over!</h2>
        <p className="lead text-muted mb-4">You have reached your destination.</p>

        <div className="bg-light rounded-4 p-4 mb-5 border">
          <div className="text-uppercase small fw-bold text-muted mb-1">Final Score</div>
          <div className="display-3 fw-bold d-flex align-items-center justify-content-center gap-2">
            <Coins size={48} className="text-warning" />
            {game.finalScore}
          </div>
          <div className="text-muted">coins</div>
        </div>

        <div className="d-grid gap-3">
          <Button variant="primary" size="lg" className="py-3 d-flex align-items-center justify-content-center gap-2" onClick={() => navigate("/setup")}>
            <RotateCcw size={20} /> Play New Game
          </Button>
          <Button variant="outline-secondary" size="lg" className="py-3 d-flex align-items-center justify-content-center gap-2" onClick={() => navigate("/ranking")}>
            <Home size={20} /> View Rankings
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default Result;
