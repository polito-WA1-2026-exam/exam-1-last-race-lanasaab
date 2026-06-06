import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Button, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { GameAPI } from "../api";
import { cityInfo } from "../data/cityInfo";
import { ArrowRight, MapPinned, Home, Trophy } from "lucide-react";

const Journey = () => {
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
      } catch {
        setError("Failed to load journey.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  if (loading) {
    return (
      <main className="journey-page">
        <div className="loading-box">
          <Spinner animation="border" />
          <p>Preparing your route story...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="journey-page">
        <Alert variant="danger" className="journey-error">
          {error}
        </Alert>
      </main>
    );
  }

  const routeCities =
    game.steps && game.steps.length > 0
      ? [
          game.steps[0].fromStationName,
          ...game.steps.map((step) => step.toStationName),
        ]
      : [];

  return (
    <main className="journey-page">
      <style>{`
        .journey-page {
          min-height: 100vh;
          padding: 120px 2rem 3rem;
          background:
            radial-gradient(circle at 88% 8%, rgba(125, 211, 252, .18), transparent 20%),
            linear-gradient(135deg, #1a4d3c 0%, #064e3b 48%, #e9f4eb 100%);
          font-family: "Poppins", system-ui, sans-serif;
          color: white;
        }

        .journey-shell {
          max-width: 1400px;
          margin: 0 auto;
        }

        .journey-header {
          text-align: center;
          padding: 2rem;
          border-radius: 34px;
          background: rgba(255,255,255,.13);
          border: 1px solid rgba(255,255,255,.22);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
          margin-bottom: 2rem;
        }

        .journey-header h1 {
          font-size: 3.2rem;
          font-weight: 950;
          margin: 0;
        }

        .journey-header p {
          color: rgba(255,255,255,.7);
          margin-top: .5rem;
        }

        .route-strip {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: .7rem;
          margin-top: 1.4rem;
        }

        .route-pill {
          border-radius: 999px;
          background: rgba(255,255,255,.9);
          color: #0f5132;
          padding: .55rem 1rem;
          font-weight: 900;
        }

        .city-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.4rem;
        }

        .city-card {
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.22) !important;
          border-radius: 30px !important;
          background: rgba(255,255,255,.13) !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.16);
          transition: .25s ease;
          animation: fadeUp .65s ease both;
        }

        .city-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 34px 75px rgba(0,0,0,.22);
        }

        .city-image {
          height: 210px;
          width: 100%;
          object-fit: cover;
        }

        .city-body {
          padding: 1.4rem;
        }

        .city-name {
          color: rgba(255,255,255,.95);
          font-weight: 950;
          font-size: 1.5rem;
          margin-bottom: .4rem;
        }

        .city-title {
          display: inline-block;
          margin-bottom: .8rem;
          border-radius: 999px;
          background: rgba(255,255,255,.88);
          color: #0f5132;
          padding: .4rem .8rem;
          font-weight: 900;
        }

        .city-desc {
          color: rgba(255,255,255,.68);
          line-height: 1.7;
          margin: 0;
        }

        .actions {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .journey-btn {
          border: none !important;
          border-radius: 999px !important;
          padding: .9rem 1.5rem !important;
          font-weight: 950 !important;
        }

        .primary-action {
          background: linear-gradient(135deg, #15803d, #0f766e) !important;
          color: white !important;
        }

        .secondary-action {
          background: rgba(255,255,255,.9) !important;
          color: #0f5132 !important;
        }

        .loading-box {
          min-height: 100vh;
          display: grid;
          place-items: center;
          text-align: center;
        }

        .loading-box p {
          margin-top: 1rem;
          color: rgba(255,255,255,.72);
          font-weight: 800;
        }

        .journey-error {
          max-width: 800px;
          margin: 140px auto 0;
          border: none !important;
          border-radius: 22px !important;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Container fluid className="journey-shell px-0">
        <section className="journey-header">
          <MapPinned size={48} className="mb-3" />

          <h1>Your Route Journey</h1>

          <p>
            This is the path you chose across Lebanon, with the cultural
            landmark of each city.
          </p>

          <div className="route-strip">
            {routeCities.map((city, index) => (
              <React.Fragment key={`${city}-${index}`}>
                <span className="route-pill">{city}</span>
                {index < routeCities.length - 1 && <ArrowRight size={18} />}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="city-grid">
          {routeCities.map((city, index) => {
            const info = cityInfo[city] || {
              image: "/images/default-city.jpg",
              title: city,
              description: "A meaningful stop in your Lebanese journey.",
            };

            return (
              <Card className="city-card" key={`${city}-${index}`}>
                <img src={info.image} alt={city} className="city-image" />

                <div className="city-body">
                  <Badge bg={index === 0 ? "success" : "dark"} className="mb-3">
                    {index === 0
                      ? "START"
                      : index === routeCities.length - 1
                      ? "DESTINATION"
                      : `STOP ${index}`}
                  </Badge>

                  <h3 className="city-name">{city}</h3>

                  <span className="city-title">{info.title}</span>

                  <p className="city-desc">{info.description}</p>
                </div>
              </Card>
            );
          })}
        </section>

        <div className="actions">
          <Button
            className="journey-btn primary-action"
            onClick={() => navigate("/setup")}
          >
            <Home size={18} /> Play New Game
          </Button>

          <Button
            className="journey-btn secondary-action"
            onClick={() => navigate("/ranking")}
          >
            <Trophy size={18} /> View Rankings
          </Button>
        </div>
      </Container>
    </main>
  );
};

export default Journey;