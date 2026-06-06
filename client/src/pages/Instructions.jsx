import React from "react";
import { Card, Container, ListGroup } from "react-bootstrap";
import { Info, Map as MapIcon, Timer, Coins } from "lucide-react";

const Instructions = () => {
  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Card.Title className="display-6 mb-4 text-primary d-flex align-items-center gap-3">
            <Info size={40} />
            How to Play: Last Race
          </Card.Title>
          
          <p className="lead mb-4">
            Welcome to <strong>Last Race</strong>! You are a metro navigator in Lebanon. 
            Your goal is to reach your destination with as many coins as possible.
          </p>

          <ListGroup variant="flush" className="mb-4">
            <ListGroup.Item className="py-3">
              <h5 className="d-flex align-items-center gap-2">
                <MapIcon className="text-success" /> Phase 1: Setup
              </h5>
              <p className="text-muted mb-0">Study the full metro network map with all stations and lines. When you're ready, start the game.</p>
            </ListGroup.Item>
            
            <ListGroup.Item className="py-3">
              <h5 className="d-flex align-items-center gap-2">
                <Timer className="text-warning" /> Phase 2: Planning
              </h5>
              <p className="text-muted mb-0">You'll see a map with stations only (no lines!). You have <strong>90 seconds</strong> to build a route from your start to your destination using a list of pairs.</p>
            </ListGroup.Item>

            <ListGroup.Item className="py-3">
              <h5 className="d-flex align-items-center gap-2">
                <Coins className="text-primary" /> Phase 3: Execution
              </h5>
              <p className="text-muted mb-0">Your route is validated. For each segment, a random event occurs, and you'll gain or lose coins. Reach the end to save your score!</p>
            </ListGroup.Item>
          </ListGroup>

          <div className="alert alert-info border-0 shadow-sm">
            <strong>Note:</strong> You must be a registered user to play and view the network map.
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Instructions;
