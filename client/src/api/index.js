import axios from "axios";

const API_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for sessions/cookies
});

export const AuthAPI = {
  login: async (username, password) => {
    const response = await api.post("/sessions", { username, password });
    return response.data;
  },
  logout: async () => {
    await api.delete("/sessions/current");
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get("/sessions/current");
      return response.data;
    } catch (err) {
      return null;
    }
  },
};

export const NetworkAPI = {
  getFullNetwork: async () => {
    const response = await api.get("/network");
    return response.data;
  },
  getStations: async () => {
    const response = await api.get("/network/stations");
    return response.data;
  },
  getSegments: async () => {
    const response = await api.get("/network/segments");
    return response.data;
  },
};

export const GameAPI = {
  startGame: async () => {
    const response = await api.post("/games");
    return response.data;
  },
  getGameStatus: async (gameId) => {
    const response = await api.get(`/games/${gameId}`);
    return response.data;
  },
  submitRoute: async (gameId, route) => {
    const response = await api.post(`/games/${gameId}/submit`, { route });
    return response.data;
  },
};

export const RankingAPI = {
  getRankings: async () => {
    const response = await api.get("/rankings");
    return response.data;
  },
};

export default api;
