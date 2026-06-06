import React, { useEffect, useState } from "react";
import { Container, Table, Card, Spinner, Alert, Badge } from "react-bootstrap";
import { RankingAPI } from "../api";
import { Trophy, Medal, User, Crown, Coins, Gamepad2 } from "lucide-react";

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await RankingAPI.getRankings();
        setRankings(data);
      } catch (err) {
        setError("Failed to load rankings.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <main className="ranking-page">
        <div className="loading-box">
          <Spinner animation="border" />
          <p>Loading champions board...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ranking-page">
        <Alert variant="danger" className="ranking-error">
          {error}
        </Alert>
      </main>
    );
  }

  const topThree = rankings.slice(0, 3);

  return (
    <main className="ranking-page">
      <style>{`
        .ranking-page {
          min-height: 100vh;
          padding: 120px 2rem 3rem;
          background:
            radial-gradient(circle at 88% 8%, rgba(125, 211, 252, .18), transparent 20%),
            linear-gradient(135deg, #1a4d3c 0%, #064e3b 48%, #e9f4eb 100%);
          font-family: "Poppins", system-ui, sans-serif;
          color: rgba(255,255,255,.9);
        }

        .ranking-shell {
          max-width: 1300px;
          margin: 0 auto;
        }

        .ranking-hero {
          text-align: center;
          margin-bottom: 2rem;
          padding: 2rem;
          border-radius: 34px;
          background: rgba(255,255,255,.13);
          border: 1px solid rgba(255,255,255,.22);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
        }

        .hero-icon {
          width: 90px;
          height: 90px;
          margin: 0 auto 1rem;
          display: grid;
          place-items: center;
          border-radius: 28px;
          background: linear-gradient(135deg, #fff7ed, #fef3c7, #ecfdf5);
          box-shadow: 0 22px 50px rgba(251,191,36,.28);
          animation: trophyFloat 3s ease-in-out infinite;
        }

        .ranking-title {
          font-size: 3.4rem;
          font-weight: 950;
          margin: 0;
          color: rgba(255,255,255,.95);
        }

        .ranking-subtitle {
          margin-top: .5rem;
          color: rgba(255,255,255,.66);
          font-weight: 700;
        }

        .podium-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          margin-bottom: 2rem;
        }

        .podium-card {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          padding: 1.5rem;
          min-height: 210px;
          text-align: center;
          background: rgba(255,255,255,.90);
          color: #12372a;
          box-shadow: 0 24px 60px rgba(0,0,0,.16);
          animation: fadeUp .7s ease both;
        }

        .podium-card.first {
          background:
            radial-gradient(circle at top right, rgba(251,191,36,.30), transparent 35%),
            linear-gradient(135deg, #fff7ed, #ffffff, #ecfdf5);
          transform: translateY(-10px);
        }

        .podium-card.second {
          background:
            radial-gradient(circle at top right, rgba(148,163,184,.28), transparent 35%),
            linear-gradient(135deg, #f8fafc, #ffffff, #ecfdf5);
        }

        .podium-card.third {
          background:
            radial-gradient(circle at top right, rgba(251,146,60,.26), transparent 35%),
            linear-gradient(135deg, #fff7ed, #ffffff, #ecfdf5);
        }

        .podium-rank {
          position: absolute;
          top: 1rem;
          right: 1.2rem;
          font-size: 3rem;
          font-weight: 950;
          opacity: .12;
        }

        .podium-medal {
          margin-bottom: .8rem;
        }

        .podium-name {
          font-size: 1.5rem;
          font-weight: 950;
          margin-bottom: .6rem;
        }

        .podium-score {
          display: inline-flex;
          align-items: center;
          gap: .4rem;
          border-radius: 999px;
          padding: .55rem 1rem;
          background: #0f5132;
          color: white;
          font-weight: 950;
        }

        .podium-games {
          margin-top: .8rem;
          color: #64748b;
          font-weight: 700;
        }

        .ranking-card {
          border: 1px solid rgba(255,255,255,.22) !important;
          border-radius: 34px !important;
          overflow: hidden;
          background: rgba(255,255,255,.92) !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
        }

        .table-title {
          padding: 1.4rem 1.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid rgba(15,81,50,.10);
        }

        .table-title h3 {
          margin: 0;
          color: #0f5132;
          font-weight: 950;
        }

        .ranking-table {
          margin: 0 !important;
        }

        .ranking-table thead th {
          background: #0f5132 !important;
          color: white !important;
          border: 0 !important;
          padding: 1rem !important;
          font-weight: 900;
        }

        .ranking-table tbody td {
          padding: 1.1rem !important;
          border-color: rgba(15,81,50,.08) !important;
          vertical-align: middle;
          color: #12372a;
        }

        .ranking-row {
          transition: .25s ease;
        }

        .ranking-row:hover {
          background: rgba(236,253,245,.85);
          transform: scale(1.005);
        }

        .rank-cell {
          font-weight: 950;
          font-size: 1.1rem;
        }

        .player-cell {
          font-weight: 950;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
        }

        .score-badge {
          background: linear-gradient(135deg, #15803d, #0f766e) !important;
          border-radius: 999px !important;
          padding: .65rem 1rem !important;
          font-size: .95rem !important;
          font-weight: 950 !important;
        }

        .games-pill {
          display: inline-flex;
          align-items: center;
          gap: .4rem;
          border-radius: 999px;
          padding: .5rem .9rem;
          background: rgba(15,81,50,.08);
          color: #0f5132;
          font-weight: 900;
        }

        .empty-state {
          padding: 3rem !important;
          color: #64748b !important;
          font-weight: 700;
        }

        .floating-sparkle {
          position: fixed;
          font-size: 1.9rem;
          opacity: .45;
          animation: floatSparkle 5s ease-in-out infinite;
          pointer-events: none;
        }

        .sparkle-one {
          top: 18%;
          left: 8%;
        }

        .sparkle-two {
          top: 24%;
          right: 10%;
          animation-delay: 1.2s;
        }

        .sparkle-three {
          bottom: 14%;
          left: 12%;
          animation-delay: 2.1s;
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

        .ranking-error {
          max-width: 800px;
          margin: 140px auto 0;
          border: none !important;
          border-radius: 22px !important;
        }

        @keyframes trophyFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
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

        @keyframes floatSparkle {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-18px) rotate(10deg);
          }
        }

        @media (max-width: 900px) {
          .podium-grid {
            grid-template-columns: 1fr;
          }

          .podium-card.first {
            transform: none;
          }

          .ranking-title {
            font-size: 2.5rem;
          }

          .table-title {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <span className="floating-sparkle sparkle-one">🏆</span>
      <span className="floating-sparkle sparkle-two">🪙</span>
      <span className="floating-sparkle sparkle-three">🇱🇧</span>

      <Container fluid className="ranking-shell px-0">
        <section className="ranking-hero">
          <div className="hero-icon">
            <Trophy className="text-warning" size={54} />
          </div>

          <h1 className="ranking-title">Champions Ranking</h1>

          <p className="ranking-subtitle">
            The best navigators in the Lebanese metro network.
          </p>
        </section>

        {topThree.length > 0 && (
          <section className="podium-grid">
            {topThree.map((row, index) => (
              <div
                key={row.user_id}
                className={`podium-card ${
                  index === 0 ? "first" : index === 1 ? "second" : "third"
                }`}
              >
                <div className="podium-rank">#{index + 1}</div>

                <div className="podium-medal">
                  {index === 0 ? (
                    <Crown className="text-warning" size={46} />
                  ) : (
                    <Medal
                      className={
                        index === 1 ? "text-secondary" : "text-danger"
                      }
                      size={42}
                    />
                  )}
                </div>

                <div className="podium-name">{row.username}</div>

                <div className="podium-score">
                  <Coins size={18} />
                  {row.max_score} coins
                </div>

                <div className="podium-games">
                  {row.games_played} games played
                </div>
              </div>
            ))}
          </section>
        )}

        <Card className="ranking-card">
          <div className="table-title">
            <h3>Leaderboard</h3>

            <Badge className="score-badge">
              {rankings.length} players ranked
            </Badge>
          </div>

          <Table hover responsive className="align-middle text-center ranking-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Best Score</th>
                <th>Games Played</th>
              </tr>
            </thead>

            <tbody>
              {rankings.map((row, index) => (
                <tr key={row.user_id} className="ranking-row">
                  <td className="rank-cell">
                    {index === 0 ? (
                      <Medal className="text-warning" />
                    ) : (
                      `#${index + 1}`
                    )}
                  </td>

                  <td>
                    <div className="player-cell">
                      <User size={18} className="text-muted" />
                      {row.username}
                    </div>
                  </td>

                  <td>
                    <Badge className="score-badge">
                      {row.max_score} coins
                    </Badge>
                  </td>

                  <td>
                    <span className="games-pill">
                      <Gamepad2 size={16} />
                      {row.games_played}
                    </span>
                  </td>
                </tr>
              ))}

              {rankings.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No records found yet. Be the first to play!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
    </main>
  );
};

export default Ranking;