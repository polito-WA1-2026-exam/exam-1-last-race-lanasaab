import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { NetworkAPI, GameAPI } from "../api";
import { useNavigate } from "react-router-dom";
import { Map as MapIcon, Play } from "lucide-react";

const Setup = () => {
  const [network, setNetwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const data = await NetworkAPI.getFullNetwork();
        setNetwork(data);
      } catch (err) {
        setError("Failed to load network map.");
      } finally {
        setLoading(false);
      }
    };

    fetchNetwork();
  }, []);

  const handleStartGame = async () => {
    try {
      const game = await GameAPI.startGame();
      navigate(`/planning/${game.id}`);
    } catch (err) {
      setError("Failed to start game. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="setup-page">
        <div className="loading-box">
          <Spinner animation="border" />
          <p>Loading Lebanese metro network...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="setup-page">
      <style>{`
        .setup-page {
          min-height: 100vh;
          padding: 120px 2rem 3rem;
          background:
            radial-gradient(circle at 88% 8%, rgba(125, 211, 252, .18), transparent 20%),
            linear-gradient(135deg, #1a4d3c 0%, #064e3b 48%, #e9f4eb 100%);
          font-family: "Poppins", system-ui, sans-serif;
          color: #f8fafc;
        }

        .setup-shell {
          max-width: 1500px;
          margin: 0 auto;
        }

        .setup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.6rem 1.8rem;
          border-radius: 30px;
          background: rgba(255,255,255,.13);
          border: 1px solid rgba(255,255,255,.22);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
        }

        .title-block {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .title-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: rgba(255,255,255,.18);
          color: #dbeafe;
        }

        .setup-title {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 950;
          color: rgba(255,255,255,.92);
          letter-spacing: -.03em;
        }

        .setup-subtitle {
          margin: .25rem 0 0;
          color: rgba(255,255,255,.68);
          font-size: .98rem;
        }

        .start-btn {
          border: none !important;
          border-radius: 999px !important;
          padding: .95rem 1.6rem !important;
          background: linear-gradient(135deg, #15803d, #0f766e) !important;
          color: white !important;
          font-weight: 950 !important;
          box-shadow: 0 18px 38px rgba(21,128,61,.35);
          transition: .25s ease;
          white-space: nowrap;
        }

        .start-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 50px rgba(21,128,61,.45);
        }

        .line-card {
          overflow: hidden;
          border-radius: 28px !important;
          border: 1px solid rgba(255,255,255,.22) !important;
          background: rgba(255,255,255,.13) !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.16);
          transition: .25s ease;
        }

        .line-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 32px 70px rgba(0,0,0,.22);
          background: rgba(255,255,255,.18) !important;
        }

        .line-header {
          padding: 1rem 1.25rem;
          color: rgba(255,255,255,.94);
          font-weight: 950;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .line-badge {
          border-radius: 999px !important;
          padding: .45rem .75rem !important;
          background: rgba(255,255,255,.86) !important;
          color: #12372a !important;
          font-weight: 900 !important;
        }

        .line-body {
          padding: 1.5rem !important;
        }

        .station-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .station-track {
          width: 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .station-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.85);
          box-shadow: 0 0 0 4px rgba(255,255,255,.10);
        }

        .station-line {
          width: 3px;
          height: 33px;
          opacity: .75;
        }

        .station-name {
          font-size: 1.1rem;
          font-weight: 950;
          color: rgba(255,255,255,.88);
        }

        .station-arabic {
          color: rgba(255,255,255,.62);
          font-size: .9rem;
          font-weight: 800;
        }

        .landmark {
          margin-top: .15rem;
          color: rgba(255,255,255,.56);
          font-size: .92rem;
          font-weight: 600;
        }

        .error-box {
          max-width: 900px;
          margin: 130px auto 0;
          border: none !important;
          border-radius: 22px !important;
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
          font-weight: 800;
          color: rgba(255,255,255,.75);
        }

        @media (max-width: 900px) {
          .setup-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .setup-title {
            font-size: 2rem;
          }

          .start-btn {
            width: 100%;
          }
        }
      `}</style>

      <Container fluid className="setup-shell px-0">
        {error && (
          <Alert variant="danger" className="error-box">
            {error}
          </Alert>
        )}

        <section className="setup-header">
          <div className="title-block">
            <div className="title-icon">
              <MapIcon size={34} />
            </div>

            <div>
              <h2 className="setup-title">Metro Network Map</h2>
              <p className="setup-subtitle">
                Study the full Lebanese network before the 90-second planning
                phase begins.
              </p>
            </div>
          </div>

          <Button className="start-btn d-flex align-items-center gap-2" onClick={handleStartGame}>
            <Play fill="currentColor" size={22} />
            Start Game
          </Button>
        </section>

        <Row className="g-4">
          {network.map((line) => (
            <Col md={6} key={line.id}>
              <Card className="line-card h-100">
                <Card.Header
                  className="line-header"
                  style={{
                    background: `linear-gradient(135deg, ${line.color}, rgba(255,255,255,.10))`,
                  }}
                >
                  <span>{line.name}</span>

                  <Badge className="line-badge">
                    {line.stations.length} stops
                  </Badge>
                </Card.Header>

                <Card.Body className="line-body">
                  <div className="d-flex flex-column">
                    {line.stations.map((station, idx) => (
                      <div key={`${line.id}-${station.id}`} className="station-row">
                        <div className="station-track">
                          <div
                            className="station-dot"
                            style={{ backgroundColor: line.color }}
                          />

                          {idx < line.stations.length - 1 && (
                            <div
                              className="station-line"
                              style={{ backgroundColor: line.color }}
                            />
                          )}
                        </div>

                        <div style={{ paddingBottom: "1.15rem" }}>
                          <div className="station-name">
                            {station.name}{" "}
                            <span className="station-arabic">
                              ({station.arabicTitle})
                            </span>
                          </div>

                          <div className="landmark">{station.landmarkName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default Setup;