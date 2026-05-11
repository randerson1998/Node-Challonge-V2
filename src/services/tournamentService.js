const Tournament = require("../models/tournament");

class TournamentService {
  constructor(client) {
    this.client = client;
  }

  async list(params) {
    try {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      const response = await this.client.request(`/tournaments${query}`, "GET");
      if (!response || !response.data) {
        throw new Error("Invalid response format: 'data' field is missing");
      } else if (response.data.errors) {
        throw new Error(`API Error: ${JSON.stringify(response.data.errors)}`);
      }
      return Tournament.fromListResponse(response);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      throw error;
    }
  }

  async get(tournamentId) {
    try {
      const response = await this.client.request(
        `/tournaments/${tournamentId}`,
        "GET",
      );

      if (!response || !response.data) {
        throw new Error("Invalid response format: 'data' field is missing");
      } else if (response.data.errors) {
        throw new Error(`API Error: ${JSON.stringify(response.data.errors)}`);
      }
      return Tournament.fromSingleResponse(response);
    } catch (error) {
      console.error(
        `Error fetching tournament with ID ${tournamentId}:`,
        error,
      );
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await this.client.request("/tournaments", "POST", {
        data: {
          type: "tournament",
          attributes: data,
        },
      });

      if (!response || !response.data) {
        throw new Error("Invalid response format: 'data' field is missing");
      } else if (response.data.errors) {
        throw new Error(`API Error: ${JSON.stringify(response.data.errors)}`);
      }

      return Tournament.fromSingleResponse(response);
    } catch (error) {
      console.error("Error creating tournament:", error);
      throw error;
    }
  }

  async update(tournamentId, data) {
    try {
      const response = await this.client.request(
        `/tournaments/${tournamentId}`,
        "PUT",
        {
          data: {
            type: "tournament",
            id: tournamentId,
            attributes: data,
          },
        },
      );

      if (!response || !response.data) {
        throw new Error("Invalid response format: 'data' field is missing");
      } else if (response.data.errors) {
        throw new Error(`API Error: ${JSON.stringify(response.data.errors)}`);
      }

      return Tournament.fromSingleResponse(response);
    } catch (error) {
      console.error(
        `Error updating tournament with ID ${tournamentId}:`,
        error,
      );
      throw error;
    }
  }

  async delete(tournamentId) {
    try {
      await this.client.request(`/tournaments/${tournamentId}`, "DELETE");
    } catch (error) {
      console.error(
        `Error deleting tournament with ID ${tournamentId}:`,
        error,
      );
      throw error;
    }
  }

  async changeState(tournamentId, state) {
    try {
      const response = await this.client.request(
        `/tournaments/${tournamentId}/change_state`,
        "POST",
        { state },
      );
      return Tournament.fromSingleResponse(response);
    } catch (error) {
      console.error(
        `Error changing state of tournament with ID ${tournamentId} to ${state}:`,
        error,
      );
      throw error;
    }
  }
}

module.exports = TournamentService;
