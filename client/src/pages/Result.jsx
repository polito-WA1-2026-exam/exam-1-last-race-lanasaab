import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { GameAPI } from "../api";
import { Trophy, Home, RotateCcw, Coins, Sparkles } from "lucide-react";

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

  if (loading) {
    return (
      <main className="result-page">
        <div className="loading-box">
          <Spinner animation="border" />
          <p>Calculating your final score...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="result-page">
        <Alert variant="danger" className="result-error">
          {error}
        </Alert>
      </main>
    );
  }

  const isSuccess = game.finalScore > 0;

  return (
    <main className="result-page">
      <style>{`
        .result-page {
          min-height: 100vh;
          padding: 120px 2rem 3rem;
          background:
            radial-gradient(circle at 88% 8%, rgba(125, 211, 252, .18), transparent 20%),
            linear-gradient(135deg, #1a4d3c 0%, #064e3b 48%, #e9f4eb 100%);
          font-family: "Poppins", system-ui, sans-serif;
          overflow: hidden;
        }

        .result-shell {
          min-height: calc(100vh - 160px);
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .result-card {
          position: relative;
          max-width: 620px;
          width: 100%;
          border: 1px solid rgba(255,255,255,.28) !important;
          border-radius: 36px !important;
          background: rgba(255,255,255,.92) !important;
          backdrop-filter: blur(18px);
          box-shadow: 0 35px 95px rgba(0,0,0,.25);
          text-align: center;
          padding: 3rem;
          animation: popCard .8s ease both;
          overflow: hidden;
          z-index: 2;
        }

        .result-card::before {
          content: "";
          position: absolute;
          inset: -80px;
          background:
            radial-gradient(circle at 20% 20%, rgba(220,38,38,.12), transparent 20%),
            radial-gradient(circle at 85% 10%, rgba(125,211,252,.20), transparent 22%),
            radial-gradient(circle at 50% 95%, rgba(21,128,61,.18), transparent 28%);
          z-index: -1;
        }

        .trophy-wrap {
          width: 120px;
          height: 120px;
          margin: 0 auto 1.4rem;
          display: grid;
          place-items: center;
          border-radius: 36px;
          background: linear-gradient(135deg, #fff7ed, #fef3c7, #ecfdf5);
          box-shadow: 0 22px 50px rgba(251,191,36,.28);
          animation: trophyFloat 3s ease-in-out infinite;
        }

        .result-title {
          font-size: 3.2rem;
          font-weight: 950;
          color: #12372a;
          margin-bottom: .4rem;
        }

        .result-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .score-box {
          position: relative;
          border-radius: 30px;
          padding: 2rem;
          margin-bottom: 2rem;
          background:
            radial-gradient(circle at top right, rgba(125,211,252,.20), transparent 30%),
            linear-gradient(135deg, #fef2f2, #ffffff, #ecfdf5);
          border: 1px solid rgba(15,81,50,.12);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.65);
        }

        .score-label {
          text-transform: uppercase;
          font-size: .8rem;
          letter-spacing: .14em;
          font-weight: 950;
          color: #64748b;
          margin-bottom: .5rem;
        }

        .score-value {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: .8rem;
          font-size: 4.6rem;
          font-weight: 950;
          color: #0f5132;
          line-height: 1;
          animation: scorePulse 2.5s ease-in-out infinite;
        }

        .score-unit {
          margin-top: .4rem;
          color: #64748b;
          font-weight: 800;
        }

        .message-pill {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          margin-bottom: 2rem;
          padding: .75rem 1.2rem;
          border-radius: 999px;
          background: ${isSuccess ? "rgba(21,128,61,.12)" : "rgba(100,116,139,.12)"};
          color: ${isSuccess ? "#0f5132" : "#475569"};
          font-weight: 900;
        }

        .action-btn {
          border: none !important;
          border-radius: 20px !important;
          padding: 1rem !important;
          font-weight: 950 !important;
          transition: .25s ease;
        }

        .play-btn {
          background: linear-gradient(135deg, #15803d, #0f766e) !important;
          color: white !important;
          box-shadow: 0 18px 38px rgba(21,128,61,.30);
        }

        .ranking-btn {
          background: rgba(15,81,50,.08) !important;
          color: #0f5132 !important;
          border: 1px solid rgba(15,81,50,.16) !important;
        }

        .action-btn:hover {
          transform: translateY(-3px);
        }

        .floating-coin {
          position: absolute;
          font-size: 2rem;
          animation: floatCoin 5s ease-in-out infinite;
          opacity: .55;
        }

        .coin-one {
          top: 12%;
          left: 12%;
        }

        .coin-two {
          top: 18%;
          right: 15%;
          animation-delay: 1s;
        }

        .coin-three {
          bottom: 14%;
          left: 18%;
          animation-delay: 2s;
        }

        .coin-four {
          bottom: 18%;
          right: 12%;
          animation-delay: 3s;
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
          color: rgba(255,255,255,.75);
          font-weight: 800;
        }

        .result-error {
          max-width: 800px;
          margin: 140px auto 0;
          border: none !important;
          border-radius: 22px !important;
        }

        @keyframes popCard {
          from {
            opacity: 0;
            transform: translateY(30px) scale(.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes trophyFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        @keyframes scorePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes floatCoin {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-22px) rotate(12deg);
          }
        }

        @media (max-width: 700px) {
          .result-card {
            padding: 2rem;
          }

          .result-title {
            font-size: 2.4rem;
          }

          .score-value {
            font-size: 3.5rem;
          }
        }
      `}</style>

      <Container fluid className="result-shell px-0">
        <span className="floating-coin coin-one">🪙</span>
        <span className="floating-coin coin-two">🏆</span>
        <span className="floating-coin coin-three">🇱🇧</span>
        <span className="floating-coin coin-four">🪙</span>

        <Card className="result-card">
          <div className="trophy-wrap">
            <Trophy
              size={82}
              className={isSuccess ? "text-warning" : "text-secondary"}
            />
          </div>

          <h2 className="result-title">Game Over!</h2>

          <p className="result-subtitle">
            You have reached your destination across the Lebanese network.
          </p>

          <div className="score-box">
            <div className="score-label">Final Score</div>

            <div className="score-value">
              <Coins size={54} className="text-warning" />
              {game.finalScore}
            </div>

            <div className="score-unit">coins</div>
          </div>

          <div className="message-pill">
            <Sparkles size={18} />
            {isSuccess
              ? "Journey completed successfully"
              : "No coins left, but the journey is complete"}
          </div>

          <div className="d-grid gap-3">
            <Button
              size="lg"
              className="action-btn play-btn d-flex align-items-center justify-content-center gap-2"
              onClick={() => navigate("/setup")}
            >
              <RotateCcw size={20} />
              Play New Game
            </Button>

            <Button
              size="lg"
              className="action-btn ranking-btn d-flex align-items-center justify-content-center gap-2"
              onClick={() => navigate("/ranking")}
            >
              <Home size={20} />
              View Rankings
            </Button>
          </div>
        </Card>
      </Container>
    </main>
  );
};

export default Result;