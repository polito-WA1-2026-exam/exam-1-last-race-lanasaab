import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Badge, Alert, Spinner } from "react-bootstrap";
import { GameAPI, NetworkAPI } from "../api";
import { Timer, MapPin, Navigation, ArrowRight, Trash2, Send } from "lucide-react";

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
  const routeRef = useRef(route); // Used for auto-submit

  // Update routeRef whenever route changes
  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameData, stationsData, segmentsData] = await Promise.all([
          GameAPI.getGameStatus(gameId),
          NetworkAPI.getStations(),
          NetworkAPI.getSegments()
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

  // Timer Logic
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
      // Map frontend route to backend format
      const formattedRoute = finalRoute.map(seg => ({
        fromId: seg.from.id,
        toId: seg.to.id
      }));
      await GameAPI.submitRoute(gameId, formattedRoute);
      navigate(`/execution/${gameId}`);
    } catch (err) {
      setError("Failed to submit route.");
    }
  };

  const addSegment = (seg) => {
    const lastStationId = route.length === 0 
      ? game.startStationId 
      : route[route.length - 1].to.id;

    // Determine direction
    let from, to;
    if (seg.stationA.id === lastStationId) {
      from = seg.stationA;
      to = seg.stationB;
    } else if (seg.stationB.id === lastStationId) {
      from = seg.stationB;
      to = seg.stationA;
    } else {
      return; // Not connectable to the end of current route
    }

    // Single use check
    const isUsed = route.some(r => 
      (r.from.id === from.id && r.to.id === to.id) || 
      (r.from.id === to.id && r.to.id === from.id)
    );
    if (isUsed) return;

    setRoute([...route, { from, to, id: seg.id }]);
  };

  const removeLast = () => {
    setRoute(route.slice(0, -1));
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const currentStationId = route.length === 0 ? game.startStationId : route[route.length - 1].to.id;
  const isComplete = currentStationId === game.destinationStationId;

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        {/* Left Column: Game Info & Timer */}
        <Col lg={4}>
          <Card className="shadow-sm mb-4 border-0">
            <Card.Body className="text-center">
              <div className={`display-4 fw-bold mb-3 ${timeLeft < 20 ? "text-danger animate-pulse" : "text-primary"}`}>
                <Timer className="me-2" /> {timeLeft}s
              </div>
              <hr />
              <div className="d-flex justify-content-around">
                <div className="text-center">
                  <Badge bg="success" className="mb-1">START</Badge>
                  <div className="fw-bold">{game.startStationName}</div>
                </div>
                <div className="d-flex align-items-center">
                  <ArrowRight size={20} className="text-muted" />
                </div>
                <div className="text-center">
                  <Badge bg="danger" className="mb-1">DESTINATION</Badge>
                  <div className="fw-bold">{game.destinationStationName}</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
              Your Route
              <Button variant="outline-secondary" size="sm" onClick={removeLast} disabled={route.length === 0}>
                <Trash2 size={16} />
              </Button>
            </Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {route.map((step, idx) => (
                <ListGroup.Item key={idx} className="small d-flex align-items-center gap-2">
                  <Badge bg="dark">{idx + 1}</Badge>
                  <span>{step.from.name}</span>
                  <ArrowRight size={12} />
                  <span className="fw-bold">{step.to.name}</span>
                </ListGroup.Item>
              ))}
              {route.length === 0 && <ListGroup.Item className="text-muted text-center py-4 italic">No segments selected</ListGroup.Item>}
            </ListGroup>
            <Card.Footer className="bg-white">
              <Button 
                variant={isComplete ? "success" : "primary"} 
                className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={() => submitRoute(route)}
                disabled={timeLeft <= 0}
              >
                <Send size={18} /> {isComplete ? "Finish & Submit" : "Submit Partial Route"}
              </Button>
              {!isComplete && <div className="text-center small text-muted mt-2">Route must end at {game.destinationStationName} to be valid</div>}
            </Card.Footer>
          </Card>
        </Col>

        {/* Middle Column: Station Map (Visual Helper) */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white fw-bold"><MapPin size={18} className="me-2 text-primary" />Station Map</Card.Header>
            <Card.Body className="p-2" style={{ backgroundColor: "#f8f9fa", position: "relative" }}>
               <div className="stations-grid d-flex flex-wrap gap-2 justify-content-center">
                  {stations.map(s => (
                    <Badge 
                      key={s.id} 
                      bg={s.id === currentStationId ? "primary" : (s.id === game.startStationId || s.id === game.destinationStationId ? "info" : "light")}
                      text={s.id === currentStationId || s.id === game.startStationId || s.id === game.destinationStationId ? "white" : "dark"}
                      className="p-2 border"
                    >
                      {s.name}
                    </Badge>
                  ))}
               </div>
               <div className="mt-4 text-center text-muted small px-3">
                 <p>Lines are hidden! Use the segment list on the right to build your path.</p>
               </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Segment Selection */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white fw-bold"><Navigation size={18} className="me-2 text-success" />Available Segments</Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: "600px", overflowY: "auto" }}>
              {segments.map((seg) => {
                const canConnect = seg.stationA.id === currentStationId || seg.stationB.id === currentStationId;
                const isUsed = route.some(r => r.id === seg.id);
                
                // UX Improvement: Show the "from" station first based on current location
                const labelFrom = seg.stationA.id === currentStationId ? seg.stationA.name : seg.stationB.name;
                const labelTo = seg.stationA.id === currentStationId ? seg.stationB.name : seg.stationA.name;

                return (
                  <ListGroup.Item 
                    key={seg.id} 
                    action 
                    disabled={!canConnect || isUsed}
                    onClick={() => addSegment(seg)}
                    className="d-flex justify-content-between align-items-center py-3"
                  >
                    <div>
                      {canConnect && !isUsed ? (
                        <>
                          <span className="fw-bold text-primary">{labelFrom}</span>
                          <ArrowRight size={14} className="mx-2 text-muted" />
                          <span className="fw-bold">{labelTo}</span>
                        </>
                      ) : (
                        <>
                          <span className="fw-bold">{seg.stationA.name}</span>
                          <span className="mx-2 text-muted">—</span>
                          <span className="fw-bold">{seg.stationB.name}</span>
                        </>
                      )}
                    </div>
                    {canConnect && !isUsed && <Badge bg="success">Connect</Badge>}
                    {isUsed && <Badge bg="secondary">Used</Badge>}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Planning;
