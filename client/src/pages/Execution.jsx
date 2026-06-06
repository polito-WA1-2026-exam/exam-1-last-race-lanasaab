import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Badge, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { GameAPI } from "../api";
import { TrainFront, Coins, AlertCircle, CheckCircle } from "lucide-react";

const Execution = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await GameAPI.getGameStatus(gameId);
        if (data.status === "planning") {
          setError("This game is still in the planning phase.");
        } else {
          setGame(data);
        }
      } catch (err) {
        setError("Failed to load game results.");
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  const handleNext = () => {
    if (currentStepIdx < game.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      navigate(`/result/${gameId}`);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  if (game.status === "failed") {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-lg border-0 p-5">
          <AlertCircle size={80} className="text-danger mb-4 mx-auto" />
          <h2 className="display-4 fw-bold text-danger">Invalid Route!</h2>
          <p className="lead text-muted mb-4">
            The route you submitted was incomplete or invalid. You lost all 20 coins.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate("/setup")}>Try Again</Button>
        </Card>
      </Container>
    );
  }

  const currentStep = game.steps[currentStepIdx];
  const progress = ((currentStepIdx + 1) / game.steps.length) * 100;

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <div className="mb-4">
        <h2 className="text-center mb-3">Journey Execution</h2>
        <ProgressBar now={progress} label={`${currentStepIdx + 1} / ${game.steps.length}`} variant="success" className="shadow-sm" style={{ height: "20px" }} />
      </div>

      <Card className="shadow-lg border-0 overflow-hidden">
        <Card.Header className="bg-primary text-white py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <TrainFront />
            <span>Step {currentStepIdx + 1}</span>
          </div>
          <Badge bg="light" text="dark" className="fs-6 d-flex align-items-center gap-2">
            <Coins size={16} className="text-warning" />
            {currentStep.coinsAfterStep} coins
          </Badge>
        </Card.Header>
        <Card.Body className="p-5 text-center">
          <div className="mb-4">
            <div className="text-muted small mb-1">Current Segment</div>
            <h4 className="fw-bold">
              {currentStep.fromStationName} → {currentStep.toStationName}
            </h4>
          </div>

          <div className={`p-4 rounded-4 mb-4 ${currentStep.eventEffect >= 0 ? "bg-success-subtle border-success" : "bg-danger-subtle border-danger"} border border-2`}>
            <div className="small text-uppercase fw-bold mb-2">Unexpected Event</div>
            <h3 className="mb-2">{currentStep.eventDescription}</h3>
            <Badge bg={currentStep.eventEffect >= 0 ? "success" : "danger"} className="fs-5">
              {currentStep.eventEffect > 0 ? "+" : ""}{currentStep.eventEffect} coins
            </Badge>
          </div>

          <Button variant="primary" size="lg" className="w-100 py-3 fw-bold shadow-sm" onClick={handleNext}>
            {currentStepIdx < game.steps.length - 1 ? "Next Step" : "See Final Result"}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Execution;
