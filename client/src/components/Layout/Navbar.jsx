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
    <RBNavbar
      variant="dark"
      expand="lg"
      className="navbar-custom position-absolute w-100 border-0"
      style={{
        zIndex: 1000,
        background: "transparent",
      }}
    >
      <Container fluid className="px-4 py-2">
        <RBNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 fw-bold text-white fs-4"
        >
          <TrainFront size={32} />
          <span style={{ letterSpacing: "1px" }}>
            LAST RACE
          </span>
        </RBNavbar.Brand>

        <RBNavbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
        />

        <RBNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-4">
            <Nav.Link
              as={Link}
              to="/instructions"
              className="text-white-50 px-3"
            >
              Instructions
            </Nav.Link>

            {user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/setup"
                  className="text-white-50 px-3"
                >
                  New Game
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/ranking"
                  className="text-white-50 px-3"
                >
                  Ranking
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-center gap-3">
            {user ? (
              <>
                <RBNavbar.Text className="text-white-50 me-2">
                  Navigator:{" "}
                  <strong className="text-white">
                    {user.username}
                  </strong>
                </RBNavbar.Text>

                <Button
                  variant="outline-light"
                  size="sm"
                  className="rounded-pill px-4 border-2 fw-bold"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="light"
                size="sm"
                className="rounded-pill px-4 fw-bold shadow-sm"
              >
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