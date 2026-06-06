import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { GameAPI } from "../api";
import {
  TrainFront,
  Coins,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react";

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

  if (loading) {
    return (
      <main className="execution-page">
        <div className="loading-box">
          <Spinner animation="border" />
          <p>Launching your journey...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="execution-page">
        <Alert variant="danger" className="execution-error">
          {error}
        </Alert>
      </main>
    );
  }

  if (game.status === "failed") {
    return (
      <main className="execution-page">
        <style>{`
          .execution-page {
            min-height: 100vh;
            padding: 120px 2rem 3rem;
            background:
              radial-gradient(circle at 88% 8%, rgba(125, 211, 252, .18), transparent 20%),
              linear-gradient(135deg, #1a4d3c 0%, #064e3b 48%, #e9f4eb 100%);
            font-family: "Poppins", system-ui, sans-serif;
          }

          .failed-card {
            max-width: 760px;
            margin: 0 auto;
            border: 0 !important;
            border-radius: 34px !important;
            background: rgba(255,255,255,.92) !important;
            box-shadow: 0 30px 80px rgba(0,0,0,.22);
            text-align: center;
            padding: 3rem;
          }

          .try-btn {
            border: none !important;
            border-radius: 999px !important;
            padding: .95rem 1.8rem !important;
            background: linear-gradient(135deg, #15803d, #0f766e) !important;
            font-weight: 950 !important;
          }
        `}</style>

        <Card className="failed-card">
          <AlertCircle size={82} className="text-danger mb-4 mx-auto" />

          <h2 className="display-5 fw-bold text-danger">Invalid Route!</h2>

          <p className="lead text-muted mb-4">
            The route you submitted was incomplete or invalid. You lost all 20
            coins.
          </p>

          <Button className="try-btn" size="lg" onClick={() => navigate("/setup")}>
            Try Again
          </Button>
        </Card>
      </main>
    );
  }

  const currentStep = game.steps[currentStepIdx];
  const progress = ((currentStepIdx + 1) / game.steps.length) * 100;
  const positiveEvent = currentStep.eventEffect >= 0;

  return (
    <main className="execution-page">
      <style>{`
        .execution-page {
          min-height: 100vh;
          padding: 120px 2rem 3rem;
          background:
            radial-gradient(circle at 88% 8%, rgba(125, 211, 252, .18), transparent 20%),
            linear-gradient(135deg, #1a4d3c 0%, #064e3b 48%, #e9f4eb 100%);
          font-family: "Poppins", system-ui, sans-serif;
          color: rgba(255,255,255,.9);
        }

        .execution-shell {
          max-width: 1200px;
          margin: 0 auto;
        }

        .execution-header {
          margin-bottom: 2rem;
          padding: 1.6rem 1.8rem;
          border-radius: 30px;
          background: rgba(255,255,255,.13);
          border: 1px solid rgba(255,255,255,.22);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
        }

        .execution-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.2rem;
        }

        .execution-title h2 {
          margin: 0;
          font-size: 2.4rem;
          font-weight: 950;
          color: rgba(255,255,255,.94);
        }

        .execution-title p {
          margin: .25rem 0 0;
          color: rgba(255,255,255,.66);
        }

        .step-pill {
          background: rgba(255,255,255,.9);
          color: #0f5132;
          border-radius: 999px;
          padding: .8rem 1.2rem;
          font-weight: 950;
          white-space: nowrap;
          box-shadow: 0 18px 35px rgba(0,0,0,.14);
        }

        .progress {
          height: 18px !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,.22) !important;
          overflow: hidden;
        }

        .progress-bar {
          background: linear-gradient(90deg, #dc2626, #ffffff, #15803d, #7dd3fc) !important;
          color: #12372a !important;
          font-weight: 950;
        }

        .journey-card {
          border: 1px solid rgba(255,255,255,.22) !important;
          border-radius: 34px !important;
          overflow: hidden;
          background: rgba(255,255,255,.14) !important;
          backdrop-filter: blur(18px);
          box-shadow: 0 30px 90px rgba(0,0,0,.22);
        }

        .journey-top {
          padding: 1.4rem 1.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          color: white;
          background:
            radial-gradient(circle at top right, rgba(125,211,252,.22), transparent 30%),
            linear-gradient(135deg, rgba(15,81,50,.88), rgba(15,118,110,.86));
        }

        .step-title {
          display: flex;
          align-items: center;
          gap: .7rem;
          font-weight: 950;
          font-size: 1.15rem;
        }

        .coin-badge {
          background: rgba(255,255,255,.9) !important;
          color: #12372a !important;
          border-radius: 999px !important;
          padding: .7rem 1rem !important;
          font-weight: 950 !important;
        }

        .journey-body {
          padding: 3rem;
          text-align: center;
          color: white;
        }

        .segment-card {
          max-width: 760px;
          margin: 0 auto 2rem;
          padding: 1.4rem;
          border-radius: 28px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.18);
        }

        .segment-label {
          color: rgba(255,255,255,.62);
          font-size: .82rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
          margin-bottom: .65rem;
        }

        .segment-route {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 1.6rem;
          font-weight: 950;
          color: rgba(255,255,255,.94);
        }

        .station-chip {
          padding: .75rem 1.2rem;
          border-radius: 999px;
          background: rgba(255,255,255,.88);
          color: #0f5132;
          box-shadow: 0 16px 32px rgba(0,0,0,.12);
        }

        .event-card {
          max-width: 760px;
          margin: 0 auto 2rem;
          padding: 2rem;
          border-radius: 30px;
          border: 2px solid;
          animation: popIn .55s ease both;
        }

        .event-positive {
          background:
            radial-gradient(circle at top right, rgba(125,211,252,.18), transparent 30%),
            linear-gradient(135deg, rgba(21,128,61,.22), rgba(236,253,245,.16));
          border-color: rgba(34,197,94,.55);
        }

        .event-negative {
          background:
            radial-gradient(circle at top right, rgba(125,211,252,.16), transparent 30%),
            linear-gradient(135deg, rgba(220,38,38,.22), rgba(254,242,242,.16));
          border-color: rgba(220,38,38,.55);
        }

        .event-kicker {
          color: rgba(255,255,255,.68);
          font-size: .8rem;
          font-weight: 950;
          letter-spacing: .13em;
          text-transform: uppercase;
          margin-bottom: .8rem;
        }

        .event-title {
          font-size: 2rem;
          font-weight: 950;
          margin-bottom: 1rem;
          color: white;
        }

        .effect-badge {
          border-radius: 999px !important;
          padding: .75rem 1.2rem !important;
          font-size: 1rem !important;
          font-weight: 950 !important;
        }

        .next-btn {
          max-width: 760px;
          margin: 0 auto;
          border: none !important;
          border-radius: 22px !important;
          padding: 1rem !important;
          font-weight: 950 !important;
          background: linear-gradient(135deg, #15803d, #0f766e) !important;
          box-shadow: 0 20px 45px rgba(21,128,61,.32);
          transition: .25s ease;
        }

        .next-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 28px 60px rgba(21,128,61,.42);
        }

        .loading-box {
          min-height: 100vh;
          display: grid;
          place-items: center;
          text-align: center;
          color: white;
        }

        .loading-box p {
          margin-top: 1rem;
          color: rgba(255,255,255,.72);
          font-weight: 800;
        }

        .execution-error {
          max-width: 800px;
          margin: 140px auto 0;
          border: none !important;
          border-radius: 22px !important;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 900px) {
          .execution-title {
            flex-direction: column;
            align-items: flex-start;
          }

          .journey-body {
            padding: 2rem;
          }

          .segment-route {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <Container fluid className="execution-shell px-0">
        <section className="execution-header">
          <div className="execution-title">
            <div>
              <h2>Journey Execution</h2>
              <p>Watch your selected route unfold segment by segment.</p>
            </div>

            <div className="step-pill">
              Step {currentStepIdx + 1} / {game.steps.length}
            </div>
          </div>

          <ProgressBar
            now={progress}
            label={`${currentStepIdx + 1} / ${game.steps.length}`}
          />
        </section>

        <Card className="journey-card">
          <Card.Header className="journey-top">
            <div className="step-title">
              <TrainFront />
              Segment {currentStepIdx + 1}
            </div>

            <Badge className="coin-badge d-flex align-items-center gap-2">
              <Coins size={16} className="text-warning" />
              {currentStep.coinsAfterStep} coins
            </Badge>
          </Card.Header>

          <Card.Body className="journey-body">
            <div className="segment-card">
              <div className="segment-label">Current Segment</div>

              <div className="segment-route">
                <span className="station-chip">
                  <MapPin size={18} /> {currentStep.fromStationName}
                </span>

                <ArrowRight />

                <span className="station-chip">
                  <MapPin size={18} /> {currentStep.toStationName}
                </span>
              </div>
            </div>

            <div
              className={`event-card ${
                positiveEvent ? "event-positive" : "event-negative"
              }`}
            >
              <div className="event-kicker">
                {positiveEvent ? (
                  <>
                    <CheckCircle size={18} /> Lucky Event
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} /> Unexpected Problem
                  </>
                )}
              </div>

              <h3 className="event-title">
                <Sparkles size={28} /> {currentStep.eventDescription}
              </h3>

              <Badge
                bg={positiveEvent ? "success" : "danger"}
                className="effect-badge"
              >
                {currentStep.eventEffect > 0 ? "+" : ""}
                {currentStep.eventEffect} coins
              </Badge>
            </div>

            <Button className="w-100 next-btn" size="lg" onClick={handleNext}>
              {currentStepIdx < game.steps.length - 1
                ? "Next Step →"
                : "See Final Result →"}
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default Execution;