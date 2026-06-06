import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as RBNavbar, Nav, Container, Button } from "react-bootstrap";
import { TrainFront } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <RBNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <RBNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <TrainFront size={28} />
          <span>Last Race</span>
        </RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="basic-navbar-nav" />
        <RBNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Instructions</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/setup">New Game</Nav.Link>
                <Nav.Link as={Link} to="/ranking">Ranking</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center gap-3">
            {user ? (
              <>
                <RBNavbar.Text className="text-light">
                  Welcome, <strong>{user.username}</strong>
                </RBNavbar.Text>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="primary" size="sm">
                Login
              </Button>
            )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default Navbar;
