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

  async createTournament(name, playerCount, gameName, groupStageEnabled) {
    const finalistCount = this._getFinalistCount(playerCount);
    const stageType = this._getStageType(playerCount);
    let swissRoundCount = 0;

    if (stageType === "swiss") {
      swissRoundCount = this._getSwissRoundCount(playerCount);
    }

    const groupStageOptions = groupStageEnabled
      ? {
          stage_type: stageType,
          group_size: playerCount,
          participant_count_to_advance_per_group: finalistCount,
          tie_breaks: [
            "points difference",
            "match wins vs tied",
            "points scored",
          ],
        }
      : undefined;
    const swissOptions =
      stageType === "swiss" ? { round_count: swissRoundCount } : undefined;

    const payload = {
      name: name,
      tournament_type: "single elimination",
      game_name: gameName,
      group_stage_enabled: groupStageEnabled,
      group_stage_options: groupStageOptions,
      swiss_options: swissOptions,
    };

    return await this.create(payload);
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

  _getStageType(playerCount) {
    switch (true) {
      case playerCount <= 8:
        return "round robin";
      case playerCount <= 64:
        return "swiss";
      case playerCount <= 128:
        return "double elimination";
      case playerCount > 128:
        return "single elimination";
      default:
        return "round robin";
    }
  }

  _getFinalistCount(playerCount) {
    switch (true) {
      case playerCount <= 8:
        return 2;
      case playerCount <= 16:
        return 4;
      case playerCount <= 48:
        return 8;
      case playerCount <= 94:
        return 16;
      case playerCount <= 256:
        return 32;
      default:
    }
    return 2;
  }

  _getSwissRoundCount(playerCount) {
    switch (true) {
      case playerCount <= 16:
        return 4;
      case playerCount <= 32:
        return 5;
      case playerCount <= 64:
        return 6;
      default:
        return 4;
    }
  }
}

module.exports = TournamentService;
