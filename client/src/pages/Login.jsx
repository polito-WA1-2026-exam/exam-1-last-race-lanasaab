import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import { LogIn, TrainFront, Eye, EyeOff, User, LockKeyhole } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("lana");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
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
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background:
            linear-gradient(rgba(3, 24, 18, .54), rgba(3, 24, 18, .78)),
            url("/images/web-image2.jpg") center/cover fixed no-repeat;
          font-family: "Poppins", system-ui, sans-serif;
          overflow: hidden;
        }

        .login-shell {
          position: relative;
          width: min(1080px, 100%);
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          border-radius: 36px;
          overflow: hidden;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.24);
          backdrop-filter: blur(18px);
          box-shadow: 0 35px 95px rgba(0,0,0,.36);
          animation: fadeUp .8s ease both;
        }

        .story-side {
          position: relative;
          padding: 3rem;
          color: white;
          overflow: hidden;
          background:
            radial-gradient(circle at 25% 20%, rgba(125,211,252,.25), transparent 26%),
            linear-gradient(135deg, rgba(15,81,50,.55), rgba(6,78,59,.25));
        }

        .story-side::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          border: 6px solid rgba(255,255,255,.22);
          left: -120px;
          bottom: -120px;
          animation: pulseCircle 5s ease-in-out infinite;
        }

        .story-badge {
          display: inline-flex;
          align-items: center;
          gap: .55rem;
          padding: .7rem 1.2rem;
          border-radius: 999px;
          background: rgba(255,255,255,.16);
          border: 1px solid rgba(255,255,255,.26);
          font-weight: 900;
          letter-spacing: .09em;
          margin-bottom: 1.3rem;
        }

        .story-title {
          position: relative;
          z-index: 2;
          font-size: 4.2rem;
          font-weight: 950;
          line-height: .95;
          margin: 0 0 1.2rem;
        }

        .story-title span {
          color: #fff5c7;
          text-shadow: 0 0 30px rgba(255,245,199,.7);
        }

        .story-text {
          position: relative;
          z-index: 2;
          max-width: 520px;
          font-size: 1.05rem;
          line-height: 1.9;
          color: rgba(255,255,255,.9);
        }

        .route-preview {
          position: relative;
          z-index: 2;
          margin-top: 2rem;
          padding: 1.2rem;
          border-radius: 24px;
          background: rgba(255,255,255,.16);
          border: 1px solid rgba(255,255,255,.20);
          backdrop-filter: blur(12px);
        }

        .route-line {
          position: relative;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .route-line::before {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          top: 50%;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, #dc2626, #ffffff, #15803d, #7dd3fc);
        }

        .dot {
          position: relative;
          z-index: 2;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 5px solid #15803d;
        }

        .moving-train {
          position: absolute;
          top: 10px;
          left: 0;
          z-index: 3;
          color: #fff5c7;
          filter: drop-shadow(0 0 12px rgba(255,245,199,.7));
          animation: trainMove 5.5s ease-in-out infinite;
        }

        .route-labels {
          display: flex;
          justify-content: space-between;
          color: rgba(255,255,255,.88);
          font-size: .85rem;
          font-weight: 800;
          margin-top: .4rem;
        }

        .form-side {
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(135deg, rgba(255,255,255,.95), rgba(236,253,245,.92));
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          border: 0 !important;
          background: transparent !important;
        }

        .login-icon {
          width: 76px;
          height: 76px;
          margin: 0 auto 1rem;
          display: grid;
          place-items: center;
          border-radius: 24px;
          background: linear-gradient(135deg, #dcfce7, #eff6ff);
          color: #15803d;
          box-shadow: 0 18px 36px rgba(21,128,61,.18);
          animation: iconFloat 3s ease-in-out infinite;
        }

        .login-title {
          text-align: center;
          color: #12372a;
          font-weight: 950;
          font-size: 2.4rem;
          margin-bottom: .3rem;
        }

        .login-subtitle {
          text-align: center;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .field-label {
          color: #12372a;
          font-weight: 800;
          margin-bottom: .5rem;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #15803d;
          z-index: 2;
        }

        .login-input {
          height: 54px;
          border-radius: 16px !important;
          border: 1px solid rgba(15,81,50,.16) !important;
          padding-left: 3rem !important;
          font-weight: 700;
          color: #12372a !important;
          box-shadow: 0 10px 25px rgba(15,23,42,.05);
        }

        .login-input:focus {
          border-color: #15803d !important;
          box-shadow: 0 0 0 .2rem rgba(21,128,61,.12) !important;
        }

        .password-toggle {
          position: absolute;
          right: .9rem;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #64748b;
          z-index: 3;
        }

        .signin-btn {
          height: 56px;
          border: 0 !important;
          border-radius: 18px !important;
          background: linear-gradient(135deg, #15803d, #0f766e) !important;
          font-weight: 950 !important;
          box-shadow: 0 18px 38px rgba(21,128,61,.28);
          transition: .25s ease;
        }

        .signin-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 50px rgba(21,128,61,.38);
        }

        .test-users {
          margin-top: 1.5rem;
          text-align: center;
          color: #64748b;
          font-size: .92rem;
        }

        .test-users strong {
          color: #0f5132;
        }

        .error-alert {
          border: 0 !important;
          border-radius: 16px !important;
          font-size: .9rem;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseCircle {
          0%, 100% { transform: scale(1); opacity: .8; }
          50% { transform: scale(1.05); opacity: .45; }
        }

        @keyframes trainMove {
          0% { left: 0%; }
          50% { left: 87%; }
          100% { left: 0%; }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @media (max-width: 950px) {
          .login-shell {
            grid-template-columns: 1fr;
          }

          .story-title {
            font-size: 3.1rem;
          }

          .story-side,
          .form-side {
            padding: 2rem;
          }
        }
      `}</style>

      <section className="login-shell">
        <div className="story-side">
          <div className="story-badge">
            <TrainFront size={22} />
            LAST RACE ACCESS
          </div>

          <h1 className="story-title">
            Enter the <span>Network.</span>
          </h1>

          <p className="story-text">
            Your Lebanese journey is about to begin. Sign in as a navigator,
            unlock the metro map, plan your route in 90 seconds, and compete for
            the highest score.
          </p>

          <div className="route-preview">
            <div className="route-line">
              <TrainFront className="moving-train" size={32} />
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>

            <div className="route-labels">
              <span>Beirut</span>
              <span>Baalbek</span>
              <span>Tyre</span>
            </div>
          </div>
        </div>

        <div className="form-side">
          <Card className="login-card">
            <Card.Body>
              <div className="login-icon">
                <LogIn size={42} />
              </div>

              <h2 className="login-title">Login</h2>
              <p className="login-subtitle">Welcome back, Navigator</p>

              {error && (
                <Alert variant="danger" className="py-2 error-alert">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="field-label">Username</Form.Label>

                  <div className="input-wrap">
                    <User size={20} className="input-icon" />
                    <Form.Control
                      className="login-input"
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="field-label">Password</Form.Label>

                  <div className="input-wrap">
                    <LockKeyhole size={20} className="input-icon" />
                    <Form.Control
                      className="login-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 signin-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Sign In & Start Journey"
                  )}
                </Button>
              </Form>

              <div className="test-users">
                Try <strong>lana</strong>, <strong>sara</strong>, or{" "}
                <strong>adam</strong>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Login;