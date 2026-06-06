import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import { Info, Map as MapIcon, Timer, Coins, Plane } from "lucide-react";

const Instructions = () => {
  const [flippedCard, setFlippedCard] = useState(null);
  const navigate = useNavigate();

  const toggleCard = (card) => {
    setFlippedCard(flippedCard === card ? null : card);
  };

  return (
    <main className="instructions-page">
      <style>{`
        .instructions-page {
          min-height: 100vh;
          padding-top: 80px;
          background:
            radial-gradient(circle at 88% 8%, rgba(125, 211, 252, .28), transparent 18%),
            linear-gradient(135deg, #1a4d3c 0%, #064e3b 48%, #e9f4eb 100%);
          font-family: "Poppins", system-ui, sans-serif;
        }

        .main-card {
          border: 0 !important;
          border-radius: 34px !important;
          overflow: hidden;
          background: rgba(255, 255, 255, .14) !important;
          backdrop-filter: blur(18px);
          box-shadow: 0 30px 90px rgba(16, 64, 50, .28);
        }

        .hero {
          position: relative;
          min-height: 520px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 2rem;
          padding: 3rem;
          color: white;
          overflow: hidden;
        }

        .plane {
          position: absolute;
          top: 45px;
          left: -90px;
          color: rgba(255,255,255,.72);
          animation: fly 9s linear infinite;
        }

        .hero-visual {
          position: relative;
          height: 460px;
        }

        .hero-circle {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 6px solid rgba(255,255,255,.32);
          overflow: hidden;
          box-shadow: inset 0 0 70px rgba(255,255,255,.08);
        }

        .hero-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .floating-card {
          position: absolute;
          padding: 1rem 1.25rem;
          border-radius: 22px;
          background: rgba(255,255,255,.80);
          color: #064e3b;
          font-weight: 900;
          box-shadow: 0 22px 45px rgba(0,0,0,.14);
        }

        .station-card {
          top: 75px;
          left: -10px;
        }

        .coins-card {
          bottom: 60px;
          right: 15px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          padding: .7rem 1.35rem;
          border-radius: 999px;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.28);
          font-weight: 900;
          letter-spacing: .08em;
          margin-bottom: 1.4rem;
        }

        .hero-title {
          font-size: 4.8rem;
          font-weight: 950;
          line-height: .95;
          margin-bottom: 1.4rem;
        }

        .hero-title span {
          color: #fff5c7;
          text-shadow: 0 0 30px rgba(255,245,199,.55);
        }

        .hero-text {
          max-width: 620px;
          font-size: 1.15rem;
          line-height: 1.9;
          color: rgba(255,255,255,.9);
        }

        .route-pill {
          margin-top: 1.6rem;
          max-width: 560px;
          background: rgba(255,255,255,.94);
          color: #475569;
          border-radius: 999px;
          padding: .75rem .8rem .75rem 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 18px 38px rgba(0,0,0,.14);
        }

        .start-dot {
          background: linear-gradient(135deg, #15803d, #0f766e);
          color: white;
          border: none;
          padding: .85rem 1.6rem;
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
          transition: all .3s ease;
          box-shadow: 0 10px 25px rgba(21,128,61,.25);
          white-space: nowrap;
        }

        .start-dot:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 18px 35px rgba(21,128,61,.40);
        }

        .start-dot:active {
          transform: scale(.97);
        }

        .instructions-panel {
          margin: 0 2rem 2rem;
          border-radius: 28px !important;
          border: 0 !important;
          background: rgba(248, 250, 252, .96) !important;
        }

        .instructions-title {
          color: #0f5132;
          font-weight: 900;
        }

        .phase-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.3rem;
          margin-bottom: 1.5rem;
        }

        .flip-card {
          min-height: 280px;
          perspective: 1200px;
          cursor: pointer;
        }

        .flip-inner {
          position: relative;
          width: 100%;
          min-height: 280px;
          transition: transform .75s cubic-bezier(.2,.8,.2,1);
          transform-style: preserve-3d;
        }

        .flip-card.flipped .flip-inner {
          transform: rotateY(180deg);
        }

        .phase-card {
          position: absolute;
          inset: 0;
          overflow: hidden;
          padding: 1.6rem;
          border-radius: 28px;
          box-shadow: 0 20px 45px rgba(15, 23, 42, .10);
          backface-visibility: hidden;
          transition: .25s ease;
        }

        .flip-card:hover .phase-card {
          box-shadow: 0 28px 60px rgba(15, 23, 42, .16);
        }

        .phase-front {
          background:
            radial-gradient(circle at top right, rgba(125, 211, 252, .22), transparent 34%),
            linear-gradient(135deg, #f8fafc, #eef7f2);
          color: #12372a;
          border: 1px solid rgba(6, 78, 59, .12);
        }

        .phase-front.red-touch {
          background:
            radial-gradient(circle at top right, rgba(34, 197, 94, .18), transparent 34%),
            linear-gradient(135deg, #fff7f7, #f8fafc, #eef7f2);
          border-top: 6px solid #b91c1c;
        }

        .phase-front.green-touch {
          border-top: 6px solid #15803d;
        }

        .phase-back {
          transform: rotateY(180deg);
          color: white;
          background:
            radial-gradient(circle at top right, rgba(125, 211, 252, .24), transparent 35%),
            linear-gradient(135deg, #0f5132, #0f766e);
        }

        .phase-number {
          position: absolute;
          top: 1rem;
          right: 1.2rem;
          font-size: 3.3rem;
          font-weight: 950;
          opacity: .12;
        }

        .phase-card h5 {
          margin-top: 1rem;
          font-weight: 900;
        }

        .phase-card p {
          margin: .8rem 0 0;
          line-height: 1.7;
          font-size: .95rem;
        }

        .phase-front p {
          color: #64748b;
        }

        .phase-back p {
          color: rgba(255,255,255,.88);
        }

        .icon-box {
          width: 52px;
          height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: rgba(255,255,255,.92);
          box-shadow: 0 10px 25px rgba(15,23,42,.08);
        }

        .flip-hint {
          position: absolute;
          bottom: 1.2rem;
          left: 1.6rem;
          font-size: .78rem;
          font-weight: 800;
          color: #0f766e;
          opacity: .8;
        }

        .phase-back .flip-hint {
          color: #dbeafe;
        }

        .note-box {
          background: linear-gradient(135deg, #fef2f2, #ffffff, #ecfdf5, #eff6ff);
          border-radius: 20px;
          padding: 1.1rem 1.25rem;
          color: #334155;
        }

        @keyframes fly {
          from { transform: translateX(0) rotate(8deg); }
          to { transform: translateX(120vw) rotate(8deg); }
        }

        @media (max-width: 900px) {
          .hero, .phase-grid {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 3.2rem;
          }

          .instructions-panel {
            margin: 0 1rem 1rem;
          }

          .route-pill {
            border-radius: 26px;
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      <Container fluid className="px-0">
        <Card className="main-card border-0 rounded-0">
          <section className="hero">
            <Plane className="plane" size={42} />

            <div className="hero-visual">
              <div className="hero-circle">
                <img src="/images/web-image1.jpg" alt="صخرة الروشة" />
              </div>

              <div className="floating-card station-card">
                ✈️ Beirut International Airport
                <br />
                Your adventure starts here
              </div>

              <div className="floating-card coins-card">🪙 Start with 20 coins</div>
            </div>

            <div>
              <div className="badge-pill">🇱🇧 METRO STRATEGY GAME</div>

              <h1 className="hero-title">
                Welcome to <span>Lebanon.</span>
              </h1>

              <p className="hero-text">
                You just landed. Ready for a unique experience? In{" "}
                <strong className="text-warning">Last Race</strong>, you are a
                single-player metro navigator traveling across Lebanese cities.
                Plan your route, discover landmarks, survive random events, and
                reach your destination with the highest number of coins.
              </p>

              <div className="route-pill">
                <span>Beirut → Baalbek → Tyre → Byblos...</span>

                <button className="start-dot" onClick={() => navigate("/login")}>
                  Start Journey →
                </button>
              </div>
            </div>
          </section>

          <Card className="instructions-panel shadow-lg">
            <Card.Body className="p-4 p-lg-5">
              <Card.Title className="display-6 mb-4 instructions-title d-flex align-items-center gap-3">
                <Info size={40} />
                How to Play: Last Race
              </Card.Title>

              <div className="phase-grid">
                <div
                  className={`flip-card ${flippedCard === 1 ? "flipped" : ""}`}
                  onClick={() => toggleCard(1)}
                >
                  <div className="flip-inner">
                    <div className="phase-card phase-front red-touch">
                      <span className="phase-number">01</span>
                      <div className="icon-box">
                        <MapIcon className="text-success" />
                      </div>
                      <h5>Phase 1: Setup</h5>
                      <p>
                        Study the full metro network map with all stations and
                        lines. When you're ready, start the game.
                      </p>
                      <span className="flip-hint">Click to reveal tip</span>
                    </div>

                    <div className="phase-card phase-back">
                      <span className="phase-number">TIP</span>
                      <h5>Navigator Tip</h5>
                      <p>
                        Look carefully for interchange stations. They are the key
                        to changing lines legally during the route.
                      </p>
                      <span className="flip-hint">Click to return</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`flip-card ${flippedCard === 2 ? "flipped" : ""}`}
                  onClick={() => toggleCard(2)}
                >
                  <div className="flip-inner">
                    <div className="phase-card phase-front green-touch">
                      <span className="phase-number">02</span>
                      <div className="icon-box">
                        <Timer className="text-warning" />
                      </div>
                      <h5>Phase 2: Planning</h5>
                      <p>
                        You'll see a map with stations only, no lines. You have{" "}
                        <strong>90 seconds</strong> to build a valid route using
                        a list of station pairs.
                      </p>
                      <span className="flip-hint">Click to reveal tip</span>
                    </div>

                    <div className="phase-card phase-back">
                      <span className="phase-number">TIP</span>
                      <h5>Time Strategy</h5>
                      <p>
                        Build the route step by step. The first selected segment
                        must start from your assigned starting station.
                      </p>
                      <span className="flip-hint">Click to return</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`flip-card ${flippedCard === 3 ? "flipped" : ""}`}
                  onClick={() => toggleCard(3)}
                >
                  <div className="flip-inner">
                    <div className="phase-card phase-front red-touch">
                      <span className="phase-number">03</span>
                      <div className="icon-box">
                        <Coins className="text-primary" />
                      </div>
                      <h5>Phase 3: Execution</h5>
                      <p>
                        Your route is validated. Random events happen on each
                        segment, and you gain or lose coins.
                      </p>
                      <span className="flip-hint">Click to reveal tip</span>
                    </div>

                    <div className="phase-card phase-back">
                      <span className="phase-number">TIP</span>
                      <h5>Score Rule</h5>
                      <p>
                        You start with 20 coins. If the final score becomes
                        negative, it is stored and displayed as zero.
                      </p>
                      <span className="flip-hint">Click to return</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="note-box shadow-sm">
                <strong>Note:</strong> You must be a registered user to play and
                view the network map.
              </div>
            </Card.Body>
          </Card>
        </Card>
      </Container>
    </main>
  );
};

export default Instructions;