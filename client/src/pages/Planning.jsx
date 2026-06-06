import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { GameAPI, NetworkAPI } from "../api";
import {
  Timer,
  MapPin,
  Navigation,
  ArrowRight,
  Trash2,
  Send,
  Route,
} from "lucide-react";

const Planning = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [stations, setStations] = useState([]);
  const [segments, setSegments] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const timerRef = useRef(null);
  const routeRef = useRef(route);

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameData, stationsData, segmentsData] = await Promise.all([
          GameAPI.getGameStatus(gameId),
          NetworkAPI.getStations(),
          NetworkAPI.getSegments(),
        ]);

        setGame(gameData);
        setStations(stationsData);
        setSegments(segmentsData);
      } catch (err) {
        setError("Failed to load game data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);

  useEffect(() => {
    if (loading || error || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, error]);

  const handleAutoSubmit = async () => {
    await submitRoute(routeRef.current);
  };

  const submitRoute = async (finalRoute) => {
    clearInterval(timerRef.current);

    try {
      const formattedRoute = finalRoute.map((seg) => ({
        fromId: seg.from.id,
        toId: seg.to.id,
      }));

      await GameAPI.submitRoute(gameId, formattedRoute);
      navigate(`/execution/${gameId}`);
    } catch (err) {
      setError("Failed to submit route.");
    }
  };

  const addSegment = (seg) => {
    const lastStationId =
      route.length === 0 ? game.startStationId : route[route.length - 1].to.id;

    let from, to;

    if (seg.stationA.id === lastStationId) {
      from = seg.stationA;
      to = seg.stationB;
    } else if (seg.stationB.id === lastStationId) {
      from = seg.stationB;
      to = seg.stationA;
    } else {
      return;
    }

    const isUsed = route.some(
      (r) =>
        (r.from.id === from.id && r.to.id === to.id) ||
        (r.from.id === to.id && r.to.id === from.id)
    );

    if (isUsed) return;

    setRoute([...route, { from, to, id: seg.id }]);
  };

  const removeLast = () => {
    setRoute(route.slice(0, -1));
  };

  if (loading) {
    return (
      <main className="planning-page">
        <div className="loading-box">
          <Spinner animation="border" />
          <p>Preparing your 90-second mission...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="planning-page">
        <Alert variant="danger" className="planning-error">
          {error}
        </Alert>
      </main>
    );
  }

  const currentStationId =
    route.length === 0 ? game.startStationId : route[route.length - 1].to.id;

  const isComplete = currentStationId === game.destinationStationId;

  return (
    <main className="planning-page">
      <style>{`
        .planning-page {
          min-height: 100vh;
          padding: 120px 2rem 3rem;
          background:
            radial-gradient(circle at 88% 8%, rgba(125, 211, 252, .18), transparent 20%),
            linear-gradient(135deg, #1a4d3c 0%, #064e3b 48%, #e9f4eb 100%);
          font-family: "Poppins", system-ui, sans-serif;
          color: rgba(255,255,255,.9);
        }

        .planning-shell {
          max-width: 1600px;
          margin: 0 auto;
        }

        .mission-header {
          margin-bottom: 2rem;
          padding: 1.6rem 1.8rem;
          border-radius: 30px;
          background: rgba(255,255,255,.13);
          border: 1px solid rgba(255,255,255,.22);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }

        .mission-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mission-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: rgba(255,255,255,.18);
          color: #dbeafe;
        }

        .mission-title h2 {
          margin: 0;
          font-size: 2.4rem;
          font-weight: 950;
          color: rgba(255,255,255,.94);
        }

        .mission-title p {
          margin: .25rem 0 0;
          color: rgba(255,255,255,.66);
        }

        .timer-pill {
          min-width: 160px;
          padding: 1rem 1.4rem;
          border-radius: 999px;
          background: rgba(255,255,255,.90);
          color: #0f5132;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .6rem;
          font-size: 1.4rem;
          font-weight: 950;
          box-shadow: 0 18px 38px rgba(0,0,0,.16);
        }

        .timer-danger {
          color: #dc2626;
          animation: pulseTimer 1s infinite;
        }

        .glass-card {
          border: 1px solid rgba(255,255,255,.22) !important;
          border-radius: 28px !important;
          background: rgba(255,255,255,.13) !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.16);
          overflow: hidden;
        }

        .glass-header {
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,.14) !important;
          color: rgba(255,255,255,.92);
          font-weight: 950;
          border-bottom: 1px solid rgba(255,255,255,.16);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .location-panel {
          padding: 1.4rem;
        }

        .journey-box {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
        }

        .station-mini {
          padding: 1rem;
          border-radius: 22px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.14);
          text-align: center;
        }

        .station-mini strong {
          display: block;
          margin-top: .45rem;
          color: rgba(255,255,255,.90);
        }

        .route-list {
          max-height: 330px;
          overflow-y: auto;
        }

        .route-item {
          background: rgba(255,255,255,.08) !important;
          color: rgba(255,255,255,.82) !important;
          border-color: rgba(255,255,255,.10) !important;
        }

        .route-empty {
          background: rgba(255,255,255,.05) !important;
          color: rgba(255,255,255,.54) !important;
          text-align: center;
          padding: 2rem !important;
        }

        .submit-area {
          padding: 1rem;
          background: rgba(255,255,255,.08);
          border-top: 1px solid rgba(255,255,255,.12);
        }

        .submit-btn {
          border: none !important;
          border-radius: 18px !important;
          padding: .9rem !important;
          font-weight: 950 !important;
          background: linear-gradient(135deg, #15803d, #0f766e) !important;
          box-shadow: 0 18px 38px rgba(21,128,61,.30);
        }

        .submit-btn.partial {
          background: linear-gradient(135deg, #2563eb, #0f766e) !important;
        }

        .helper-text {
          margin-top: .75rem;
          color: rgba(255,255,255,.56);
          font-size: .85rem;
          text-align: center;
        }

        .stations-map {
          min-height: 520px;
          padding: 1.2rem;
          background:
            radial-gradient(circle at top right, rgba(125,211,252,.14), transparent 32%),
            rgba(255,255,255,.08);
        }

        .stations-grid {
          display: flex;
          flex-wrap: wrap;
          gap: .8rem;
          justify-content: center;
        }

        .station-badge {
          border-radius: 999px !important;
          padding: .8rem 1rem !important;
          font-weight: 900 !important;
          border: 1px solid rgba(255,255,255,.22) !important;
          transition: .25s ease;
        }

        .station-badge:hover {
          transform: translateY(-3px);
        }

        .station-current {
          background: linear-gradient(135deg, #0ea5e9, #2563eb) !important;
          color: white !important;
          box-shadow: 0 14px 32px rgba(14,165,233,.35);
        }

        .station-special {
          background: linear-gradient(135deg, #15803d, #0f766e) !important;
          color: white !important;
        }

        .station-normal {
          background: rgba(255,255,255,.82) !important;
          color: #12372a !important;
        }

        .map-note {
          margin-top: 2rem;
          text-align: center;
          color: rgba(255,255,255,.64);
          line-height: 1.7;
        }

        .segment-list {
          max-height: 610px;
          overflow-y: auto;
        }

        .segment-item {
          background: rgba(255,255,255,.08) !important;
          color: rgba(255,255,255,.82) !important;
          border-color: rgba(255,255,255,.10) !important;
          padding: 1rem 1.2rem !important;
          transition: .2s ease;
        }

        .segment-item:hover:not(.disabled) {
          background: rgba(255,255,255,.16) !important;
          transform: translateX(5px);
        }

        .segment-item.disabled {
          opacity: .52;
        }

        .connect-label {
          background: rgba(21,128,61,.95) !important;
          color: white !important;
        }

        .used-label {
          background: rgba(100,116,139,.9) !important;
        }

        .planning-error {
          max-width: 800px;
          margin: 140px auto 0;
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
          color: rgba(255,255,255,.72);
          font-weight: 800;
        }

        @keyframes pulseTimer {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @media (max-width: 992px) {
          .mission-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .timer-pill {
            width: 100%;
          }

          .mission-title h2 {
            font-size: 2rem;
          }

          .journey-box {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Container fluid className="planning-shell px-0">
        <section className="mission-header">
          <div className="mission-title">
            <div className="mission-icon">
              <Route size={34} />
            </div>

            <div>
              <h2>Planning Mission</h2>
              <p>
                Build your route before the timer ends. Lines are hidden during
                planning.
              </p>
            </div>
          </div>

          <div className={`timer-pill ${timeLeft < 20 ? "timer-danger" : ""}`}>
            <Timer size={28} />
            {timeLeft}s
          </div>
        </section>

        <Row className="g-4">
          <Col lg={4}>
            <Card className="glass-card mb-4">
              <Card.Body className="location-panel">
                <div className="journey-box">
                  <div className="station-mini">
                    <Badge bg="success">START</Badge>
                    <strong>{game.startStationName}</strong>
                  </div>

                  <ArrowRight size={24} color="rgba(255,255,255,.65)" />

                  <div className="station-mini">
                    <Badge bg="danger">DESTINATION</Badge>
                    <strong>{game.destinationStationName}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="glass-card">
              <Card.Header className="glass-header">
                <span>Your Route</span>

                <Button
                  variant="outline-light"
                  size="sm"
                  className="rounded-pill"
                  onClick={removeLast}
                  disabled={route.length === 0}
                >
                  <Trash2 size={16} />
                </Button>
              </Card.Header>

              <ListGroup variant="flush" className="route-list">
                {route.map((step, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="route-item small d-flex align-items-center gap-2"
                  >
                    <Badge bg="dark">{idx + 1}</Badge>
                    <span>{step.from.name}</span>
                    <ArrowRight size={12} />
                    <span className="fw-bold">{step.to.name}</span>
                  </ListGroup.Item>
                ))}

                {route.length === 0 && (
                  <ListGroup.Item className="route-empty">
                    No segments selected yet
                  </ListGroup.Item>
                )}
              </ListGroup>

              <div className="submit-area">
                <Button
                  className={`w-100 d-flex align-items-center justify-content-center gap-2 submit-btn ${
                    isComplete ? "" : "partial"
                  }`}
                  onClick={() => submitRoute(route)}
                  disabled={timeLeft <= 0}
                >
                  <Send size={18} />
                  {isComplete ? "Finish & Submit" : "Submit Partial Route"}
                </Button>

                {!isComplete && (
                  <div className="helper-text">
                    Route must end at {game.destinationStationName} to be valid.
                  </div>
                )}
              </div>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="glass-card h-100">
              <Card.Header className="glass-header">
                <span>
                  <MapPin size={18} className="me-2" />
                  Station Map
                </span>
              </Card.Header>

              <Card.Body className="stations-map">
                <div className="stations-grid">
                  {stations.map((s) => {
                    const badgeClass =
                      s.id === currentStationId
                        ? "station-current"
                        : s.id === game.startStationId ||
                          s.id === game.destinationStationId
                        ? "station-special"
                        : "station-normal";

                    return (
                      <Badge key={s.id} className={`station-badge ${badgeClass}`}>
                        {s.name}
                      </Badge>
                    );
                  })}
                </div>

                <div className="map-note">
                  Lines are hidden. Use the available segment list to discover
                  your path through the Lebanese network.
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="glass-card h-100">
              <Card.Header className="glass-header">
                <span>
                  <Navigation size={18} className="me-2" />
                  Available Segments
                </span>
              </Card.Header>

              <ListGroup variant="flush" className="segment-list">
                {segments.map((seg) => {
                  const canConnect =
                    seg.stationA.id === currentStationId ||
                    seg.stationB.id === currentStationId;

                  const isUsed = route.some((r) => r.id === seg.id);

                  const labelFrom =
                    seg.stationA.id === currentStationId
                      ? seg.stationA.name
                      : seg.stationB.name;

                  const labelTo =
                    seg.stationA.id === currentStationId
                      ? seg.stationB.name
                      : seg.stationA.name;

                  return (
                    <ListGroup.Item
                      key={seg.id}
                      action
                      disabled={!canConnect || isUsed}
                      onClick={() => addSegment(seg)}
                      className="segment-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        {canConnect && !isUsed ? (
                          <>
                            <span className="fw-bold text-info">{labelFrom}</span>
                            <ArrowRight size={14} className="mx-2" />
                            <span className="fw-bold">{labelTo}</span>
                          </>
                        ) : (
                          <>
                            <span className="fw-bold">{seg.stationA.name}</span>
                            <span className="mx-2">—</span>
                            <span className="fw-bold">{seg.stationB.name}</span>
                          </>
                        )}
                      </div>

                      {canConnect && !isUsed && (
                        <Badge className="connect-label">Connect</Badge>
                      )}

                      {isUsed && <Badge className="used-label">Used</Badge>}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Planning;