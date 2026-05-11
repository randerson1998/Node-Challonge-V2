const Participant = require("../models/participant");

class ParticipantService {
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
        `/tournaments/${tournamentId}/participants${query}`,
        "GET",
      );
      return Participant.fromListResponse(response);
    } catch (error) {
      console.error("Error listing participants:", error.message);
      throw error;
    }
  }

  async get(tournamentId, participantId) {
    try {
      if (!tournamentId || !participantId) {
        throw new Error("tournamentId and participantId are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/participants/${participantId}`,
        "GET",
      );
      return Participant.fromSingleResponse(response);
    } catch (error) {
      console.error("Error getting participant:", error.message);
      throw error;
    }
  }

  async create(tournamentId, data) {
    try {
      if (!tournamentId || !data) {
        throw new Error("tournamentId and data are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/participants`,
        "POST",
        {
          data: {
            type: "participant",
            attributes: data,
          },
        },
      );
      return Participant.fromSingleResponse(response);
    } catch (error) {
      console.error("Error creating participant:", error.message);
      throw error;
    }
  }

  async update(tournamentId, participantId, data) {
    try {
      if (!tournamentId || !participantId || !data) {
        throw new Error("tournamentId, participantId, and data are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/participants/${participantId}`,
        "PUT",
        {
          data: {
            type: "participant",
            attributes: data,
          },
        },
      );
      return Participant.fromSingleResponse(response);
    } catch (error) {
      console.error("Error updating participant:", error.message);
      throw error;
    }
  }

  async delete(tournamentId, participantId) {
    try {
      if (!tournamentId || !participantId) {
        throw new Error("tournamentId and participantId are required");
      }

      await this.client.request(
        `/tournaments/${tournamentId}/participants/${participantId}`,
        "DELETE",
      );
    } catch (error) {
      console.error("Error deleting participant:", error.message);
      throw error;
    }
  }

  async bulkCreate(tournamentId, participants) {
    try {
      if (!tournamentId || !participants) {
        throw new Error("tournamentId and participants are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/participants/bulk_create`,
        "POST",
        { participants },
      );
      return Participant.fromListResponse(response);
    } catch (error) {
      console.error("Error bulk creating participants:", error.message);
      throw error;
    }
  }

  async clearAll(tournamentId) {
    try {
      if (!tournamentId) {
        throw new Error("tournamentId is required");
      }

      await this.client.request(
        `/tournaments/${tournamentId}/participants/clear`,
        "POST",
      );
    } catch (error) {
      console.error("Error clearing participants:", error.message);
      throw error;
    }
  }

  async randomize(tournamentId) {
    try {
      if (!tournamentId) {
        throw new Error("tournamentId is required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/participants/randomize`,
        "POST",
      );
      return Participant.fromListResponse(response);
    } catch (error) {
      console.error("Error randomizing participants:", error.message);
      throw error;
    }
  }

  async registerMe(tournamentId) {
    try {
      if (!tournamentId) {
        throw new Error("tournamentId is required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/participants/register`,
        "POST",
      );
      return Participant.fromSingleResponse(response);
    } catch (error) {
      console.error("Error registering participant:", error.message);
      throw error;
    }
  }

  async unregisterMe(tournamentId) {
    try {
      if (!tournamentId) {
        throw new Error("tournamentId is required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/participants/unregister`,
        "POST",
      );
      return Participant.fromSingleResponse(response);
    } catch (error) {
      console.error("Error unregistering participant:", error.message);
      throw error;
    }
  }
}

module.exports = ParticipantService;
