import React, { useEffect, useState } from "react";
import { Container, Table, Card, Spinner, Alert, Badge } from "react-bootstrap";
import { RankingAPI } from "../api";
import { Trophy, Medal, User } from "lucide-react";

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

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Card.Title className="display-6 mb-4 text-center d-flex align-items-center justify-content-center gap-3">
            <Trophy className="text-warning" size={40} />
            Global Ranking
          </Card.Title>

          <Table hover responsive className="align-middle text-center mt-3">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Best Score</th>
                <th>Games Played</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((row, index) => (
                <tr key={row.user_id}>
                  <td>
                    {index === 0 ? <Medal className="text-warning" /> : index + 1}
                  </td>
                  <td className="fw-bold d-flex align-items-center justify-content-center gap-2">
                    <User size={16} className="text-muted" />
                    {row.username}
                  </td>
                  <td>
                    <Badge bg="success" className="p-2 fs-6">
                      {row.max_score} coins
                    </Badge>
                  </td>
                  <td>{row.games_played}</td>
                </tr>
              ))}
              {rankings.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-muted py-4">No records found yet. Be the first to play!</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Ranking;
