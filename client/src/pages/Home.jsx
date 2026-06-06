import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Stamp,
  Ticket,
  Landmark,
  TrainFront,
  MapPin,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);

    setTimeout(() => {
      document.querySelector(".experience-zone")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  return (
    <main className="home-page">
      <style>{`
        .home-page {
          min-height: 100vh;
          background:
            linear-gradient(rgba(3, 24, 18, .28), rgba(3, 24, 18, .45)),
            url("/images/web-image2.jpg") center/cover fixed no-repeat;
          font-family: "Poppins", system-ui, sans-serif;
          overflow-x: hidden;
          padding: 2rem;
        }

        .hero {
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
        }

        .hero-content {
          max-width: 850px;
          padding: 3rem;
          border-radius: 34px;
          background: rgba(3, 24, 18, .28);
          border: 1px solid rgba(255,255,255,.28);
          backdrop-filter: blur(8px);
          box-shadow: 0 35px 90px rgba(0,0,0,.25);
          animation: fadeUp .9s ease both;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          padding: .75rem 1.35rem;
          border-radius: 999px;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.28);
          font-weight: 900;
          letter-spacing: .1em;
          margin-bottom: 1.4rem;
        }

        .hero-title {
          font-size: 5rem;
          font-weight: 950;
          line-height: .95;
          margin-bottom: 1.4rem;
          letter-spacing: -.04em;
        }

        .hero-title span {
          color: #fff5c7;
          text-shadow: 0 0 35px rgba(255,245,199,.75);
        }

        .hero-text {
          max-width: 720px;
          margin: 0 auto;
          font-size: 1.22rem;
          line-height: 1.9;
          color: rgba(255,255,255,.94);
        }

        .sure-btn {
          margin-top: 2rem;
          border: none;
          border-radius: 999px;
          padding: 1rem 2.3rem;
          background: linear-gradient(135deg, #15803d, #0f766e);
          color: white;
          font-weight: 950;
          box-shadow: 0 20px 45px rgba(21,128,61,.38);
          transition: .3s ease;
        }

        .sure-btn:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 28px 60px rgba(21,128,61,.48);
        }

        .experience-zone {
          padding: 2rem 0;
          animation: fadeUp .7s ease both;
        }

        .section-title {
          color: white;
          font-weight: 950;
          margin-bottom: 1.2rem;
          text-shadow: 0 10px 25px rgba(0,0,0,.35);
        }

        .creative-grid {
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          gap: 1.3rem;
          margin-bottom: 1.3rem;
        }

        .passport-card,
        .ticket-card,
        .discover-card,
        .metro-card {
          border-radius: 28px;
          background: rgba(255,255,255,.90);
          color: #12372a;
          box-shadow: 0 24px 55px rgba(15,23,42,.18);
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,.45);
          backdrop-filter: blur(12px);
        }

        .passport-card {
          position: relative;
          overflow: hidden;
        }

        .stamp {
          position: absolute;
          right: 1.4rem;
          top: 1.4rem;
          border: 3px solid #dc2626;
          color: #dc2626;
          border-radius: 50%;
          width: 130px;
          height: 130px;
          display: grid;
          place-items: center;
          text-align: center;
          font-weight: 950;
          transform: rotate(-13deg);
          opacity: .75;
        }

        .passport-card h3,
        .ticket-card h3,
        .discover-card h3,
        .metro-card h3 {
          font-weight: 950;
          color: #0f5132;
          margin-bottom: 1rem;
        }

        .passport-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          padding: .55rem 0;
          border-bottom: 1px dashed rgba(15,81,50,.20);
        }

        .passport-row span:first-child {
          color: #64748b;
          font-weight: 800;
        }

        .passport-row span:last-child {
          font-weight: 900;
        }

        .ticket-card {
          background:
            linear-gradient(135deg, rgba(255,247,247,.94), rgba(255,255,255,.94), rgba(236,253,245,.94));
          position: relative;
          overflow: hidden;
        }

        .ticket-card::before,
        .ticket-card::after {
          content: "";
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(15,81,50,.82);
          top: 50%;
          transform: translateY(-50%);
        }

        .ticket-card::before {
          left: -19px;
        }

        .ticket-card::after {
          right: -19px;
        }

        .ticket-line {
          display: flex;
          justify-content: space-between;
          padding: .7rem 0;
          border-bottom: 1px dashed rgba(15,81,50,.25);
          font-weight: 800;
        }

        .metro-card {
          margin-bottom: 1.3rem;
          overflow: hidden;
        }

        .metro-line {
          position: relative;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metro-line::before {
          content: "";
          position: absolute;
          left: 10px;
          right: 10px;
          top: 50%;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, #dc2626, #f8fafc, #15803d, #7dd3fc);
        }

        .station-dot {
          position: relative;
          z-index: 2;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 5px solid #0f5132;
        }

        .train {
          position: absolute;
          top: 18px;
          left: 0;
          z-index: 3;
          color: #dc2626;
          animation: trainMove 6s ease-in-out infinite;
        }

        .discover-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .landmark {
          border-radius: 20px;
          padding: 1rem;
          min-height: 135px;
          background:
            radial-gradient(circle at top right, rgba(125,211,252,.22), transparent 35%),
            linear-gradient(135deg, #f8fafc, #ecfdf5);
          transition: .25s ease;
        }

        .landmark:hover {
          transform: translateY(-7px);
          box-shadow: 0 20px 35px rgba(15,23,42,.12);
        }

        .landmark strong {
          display: block;
          margin: .5rem 0 .25rem;
          color: #0f5132;
        }

        .landmark p {
          margin: 0;
          color: #64748b;
          font-size: .9rem;
        }

        .continue-panel {
          margin-top: 1.3rem;
          border-radius: 28px;
          padding: 1.5rem;
          background:
            radial-gradient(circle at top right, rgba(125,211,252,.18), transparent 30%),
            linear-gradient(135deg, rgba(153,27,27,.94), rgba(220,38,38,.94));
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 24px 55px rgba(0,0,0,.18);
        }

        .continue-panel h3 {
          font-weight: 950;
          margin: 0;
        }

        .continue-panel p {
          margin: .35rem 0 0;
          opacity: .9;
        }

        .continue-btn {
          border: none;
          border-radius: 999px;
          padding: .9rem 1.5rem;
          background: white;
          color: #991b1b;
          font-weight: 950;
          white-space: nowrap;
          transition: .25s ease;
        }

        .continue-btn:hover {
          transform: translateY(-3px);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes trainMove {
          0% { left: 0%; }
          50% { left: 87%; }
          100% { left: 0%; }
        }

        @media (max-width: 1000px) {
          .creative-grid,
          .discover-grid {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 3.4rem;
          }

          .continue-panel {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <Container fluid className="px-0">
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <Plane size={22} />
              LEBANON ARRIVAL MODE
            </div>

            <h1 className="hero-title">
              Wanna discover <span>Lebanon?</span>
            </h1>

            <p className="hero-text">
              You just landed. A hidden destination is waiting across the
              Lebanese metro network. Are you ready to enter the game, explore
              iconic cities, and begin your Last Race?
            </p>

            <button className="sure-btn" onClick={handleAccept}>
              SURE, LET ME IN 🇱🇧
            </button>
          </div>
        </section>

        {accepted && (
          <section className="experience-zone">
            <h2 className="section-title">Your Arrival Experience</h2>

            <div className="creative-grid">
              <div className="passport-card">
                <div className="stamp">
                  CLEARED
                  <br />
                  FOR ENTRY
                </div>

                <h3>
                  <Stamp size={28} /> Arrival Stamp
                </h3>

                <div className="passport-row">
                  <span>Passenger</span>
                  <span>Guest Traveler</span>
                </div>

                <div className="passport-row">
                  <span>Location</span>
                  <span>Beirut International Airport</span>
                </div>

                <div className="passport-row">
                  <span>Mission</span>
                  <span>Reach your destination</span>
                </div>

                <div className="passport-row">
                  <span>Starting Coins</span>
                  <span>20 Coins</span>
                </div>

                <div className="passport-row">
                  <span>Planning Time</span>
                  <span>90 Seconds</span>
                </div>
              </div>

              <div className="ticket-card">
                <h3>
                  <Ticket size={28} /> Metro Ticket
                </h3>

                <div className="ticket-line">
                  <span>FROM</span>
                  <span>Beirut</span>
                </div>

                <div className="ticket-line">
                  <span>TO</span>
                  <span>Unknown</span>
                </div>

                <div className="ticket-line">
                  <span>ROLE</span>
                  <span>Navigator</span>
                </div>

                <div className="ticket-line">
                  <span>STATUS</span>
                  <span>Not Started</span>
                </div>
              </div>
            </div>

            <div className="metro-card">
              <h3>
                <TrainFront size={28} /> Animated Metro Line
              </h3>

              <div className="metro-line">
                <TrainFront className="train" size={34} />
                <span className="station-dot"></span>
                <span className="station-dot"></span>
                <span className="station-dot"></span>
                <span className="station-dot"></span>
                <span className="station-dot"></span>
              </div>
            </div>

            <div className="discover-card">
              <h3>
                <Landmark size={28} /> Discover Along the Way
              </h3>

              <div className="discover-grid">
                <div className="landmark">
                  <MapPin size={24} />
                  <strong>Beirut</strong>
                  <p>صخرة الروشة and the start of your adventure.</p>
                </div>

                <div className="landmark">
                  <MapPin size={24} />
                  <strong>Baalbek</strong>
                  <p>Ancient temples and a powerful historical stop.</p>
                </div>

                <div className="landmark">
                  <MapPin size={24} />
                  <strong>Tyre</strong>
                  <p>Ruins, coastline, and a legendary Phoenician city.</p>
                </div>

                <div className="landmark">
                  <MapPin size={24} />
                  <strong>Byblos</strong>
                  <p>Castle views and one of the oldest cities in the world.</p>
                </div>
              </div>
            </div>

            <div className="continue-panel">
              <div>
                <h3>Ready for the briefing?</h3>
                <p>
                  Learn the rules, understand the phases, then begin your Last
                  Race.
                </p>
              </div>

              <button
                className="continue-btn"
                onClick={() => navigate("/instructions")}
              >
                Continue to Instructions →
              </button>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
};

export default Home;