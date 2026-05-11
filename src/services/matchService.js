const Match = require("../models/match");

class MatchService {
  constructor(client) {
    this.client = client;
  }

  async list(tournamentId, options = {}) {
    try {
      if (!tournamentId) {
        throw new Error("tournamentId is required");
      }

      const query = options ? `?${new URLSearchParams(options)}` : "";
      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches${query}`,
        "GET",
      );
      return Match.fromListResponse(response);
    } catch (error) {
      console.error("Error listing matches:", error.message);
      throw error;
    }
  }

  async get(tournamentId, matchId) {
    try {
      if (!tournamentId || !matchId) {
        throw new Error("tournamentId and matchId are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}`,
        "GET",
      );
      return Match.fromSingleResponse(response);
    } catch (error) {
      console.error("Error getting match:", error.message);
      throw error;
    }
  }

  async changeMatchState(tournamentId, matchId, state) {
    try {
      if (!tournamentId || !matchId || !state) {
        throw new Error("tournamentId, matchId, and state are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/change_state`,
        "POST",
        { state },
      );
      return Match.fromSingleResponse(response);
    } catch (error) {
      console.error("Error changing match state:", error.message);
      throw error;
    }
  }
}

module.exports = MatchService;
