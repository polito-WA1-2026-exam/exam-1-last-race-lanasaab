import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import { LogIn } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("lana"); // Pre-filled for easy testing
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(username, password);
      navigate("/setup");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <Card className="shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <LogIn size={48} className="text-primary mb-2" />
            <h2 className="fw-bold">Login</h2>
            <p className="text-muted">Welcome back, Navigator</p>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
            </Button>
          </Form>

          <div className="mt-4 text-center small text-muted">
            Try <strong>lana</strong>, <strong>sara</strong>, or <strong>adam</strong>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
