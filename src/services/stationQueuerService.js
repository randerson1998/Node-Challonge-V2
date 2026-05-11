const StationQueuer = require("../models/stationQueuer");

class StationQueuerService {
  constructor(client) {
    this.client = client;
  }

  async list(tournamentId, matchId) {
    try {
      if (!tournamentId || !matchId) {
        throw new Error("tournamentId and matchId are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/station_queuer`,
        "GET",
      );
      return StationQueuer.fromListResponse(response);
    } catch (error) {
      console.error("Error listing station queuers:", error.message);
      throw error;
    }
  }

  async get(tournamentId, matchId) {
    try {
      if (!tournamentId || !matchId) {
        throw new Error("tournamentId and matchId are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/station_queuer`,
        "GET",
      );
      return StationQueuer.fromSingleResponse(response);
    } catch (error) {
      console.error("Error getting station queuer:", error.message);
      throw error;
    }
  }

  async create(tournamentId, matchId, data) {
    try {
      if (!tournamentId || !matchId || !data) {
        throw new Error("tournamentId, matchId, and data are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/station_queuer`,
        "POST",
        {
          data: {
            type: "station_queuer",
            attributes: data,
          },
        },
      );
      return StationQueuer.fromSingleResponse(response);
    } catch (error) {
      console.error("Error creating station queuer:", error.message);
      throw error;
    }
  }

  async update(tournamentId, matchId, data) {
    try {
      if (!tournamentId || !matchId || !data) {
        throw new Error("tournamentId, matchId, and data are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/station_queuer`,
        "PUT",
        {
          data: {
            type: "station_queuer",
            attributes: data,
          },
        },
      );
      return StationQueuer.fromSingleResponse(response);
    } catch (error) {
      console.error("Error updating station queuer:", error.message);
      throw error;
    }
  }

  async delete(tournamentId, matchId) {
    try {
      if (!tournamentId || !matchId) {
        throw new Error("tournamentId and matchId are required");
      }

      await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/station_queuer`,
        "DELETE",
      );
    } catch (error) {
      console.error("Error deleting station queuer:", error.message);
      throw error;
    }
  }
}

module.exports = StationQueuerService;
