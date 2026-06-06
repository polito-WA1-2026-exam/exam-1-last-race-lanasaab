import React, { useEffect, useState } from "react";
import { Container, Button, Card, Spinner, Alert, Row, Col, Badge } from "react-bootstrap";
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

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="display-6 d-flex align-items-center gap-3">
          <MapIcon className="text-primary" /> Metro Network Map
        </h2>
        <Button variant="success" size="lg" className="d-flex align-items-center gap-2 shadow" onClick={handleStartGame}>
          <Play fill="currentColor" /> Start Game
        </Button>
      </div>

      <Row className="g-4">
        {network.map((line) => (
          <Col md={6} key={line.id}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Header className="text-white fw-bold d-flex justify-content-between align-items-center" style={{ backgroundColor: line.color }}>
                {line.name}
                <Badge bg="light" text="dark">{line.stations.length} stops</Badge>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-column gap-3">
                  {line.stations.map((station, idx) => (
                    <div key={station.id} className="d-flex align-items-center gap-3">
                      <div className="d-flex flex-column align-items-center" style={{ width: "20px" }}>
                        <div className="rounded-circle border border-2 border-dark" style={{ width: "12px", height: "12px", backgroundColor: line.color }}></div>
                        {idx < line.stations.length - 1 && <div style={{ width: "2px", height: "24px", backgroundColor: line.color }}></div>}
                      </div>
                      <div>
                        <div className="fw-bold">{station.name} <span className="text-muted small">({station.arabicTitle})</span></div>
                        <div className="small text-secondary">{station.landmarkName}</div>
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
  );
};

export default Setup;
