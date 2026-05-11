const Station = require("../models/station");

class StationService {
  constructor(client) {
    this.client = client;
  }

  async list(tournamentId, matchId) {
    try {
      if (!tournamentId || !matchId) {
        throw new Error("tournamentId and matchId are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/stations`,
        "GET",
      );
      return Station.fromListResponse(response);
    } catch (error) {
      console.error("Error listing stations:", error.message);
      throw error;
    }
  }

  async get(tournamentId, matchId, stationId) {
    try {
      if (!tournamentId || !matchId || !stationId) {
        throw new Error("tournamentId, matchId, and stationId are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/stations/${stationId}`,
        "GET",
      );
      return Station.fromSingleResponse(response);
    } catch (error) {
      console.error("Error getting station:", error.message);
      throw error;
    }
  }

  async create(tournamentId, matchId, data) {
    try {
      if (!tournamentId || !matchId || !data) {
        throw new Error("tournamentId, matchId, and data are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/stations`,
        "POST",
        {
          data: {
            type: "station",
            attributes: data,
          },
        },
      );
      return Station.fromSingleResponse(response);
    } catch (error) {
      console.error("Error creating station:", error.message);
      throw error;
    }
  }

  async update(tournamentId, matchId, stationId, data) {
    try {
      if (!tournamentId || !matchId || !stationId || !data) {
        throw new Error("tournamentId, matchId, stationId, and data are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/stations/${stationId}`,
        "PUT",
        {
          data: {
            type: "station",
            attributes: data,
          },
        },
      );
      return Station.fromSingleResponse(response);
    } catch (error) {
      console.error("Error updating station:", error.message);
      throw error;
    }
  }

  async delete(tournamentId, matchId, stationId) {
    try {
      if (!tournamentId || !matchId || !stationId) {
        throw new Error("tournamentId, matchId, and stationId are required");
      }

      await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/stations/${stationId}`,
        "DELETE",
      );
    } catch (error) {
      console.error("Error deleting station:", error.message);
      throw error;
    }
  }
}

module.exports = StationService;