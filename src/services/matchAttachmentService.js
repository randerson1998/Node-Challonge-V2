const MatchAttachment = require("../models/matchAttachment");

class MatchAttachmentService {
  constructor(client) {
    this.client = client;
  }

  async list(tournamentId, matchId) {
    try {
      if (!tournamentId || !matchId) {
        throw new Error("tournamentId and matchId are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/attachments`,
        "GET",
      );
      return MatchAttachment.fromListResponse(response);
    } catch (error) {
      console.error("Error listing match attachments:", error.message);
      throw error;
    }
  }

  async create(tournamentId, matchId, data) {
    try {
      if (!tournamentId || !matchId || !data) {
        throw new Error("tournamentId, matchId, and data are required");
      }

      const response = await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/attachments`,
        "POST",
        {
          data: {
            type: "match_attachment",
            attributes: data,
          },
        },
      );
      return MatchAttachment.fromSingleResponse(response);
    } catch (error) {
      console.error("Error creating match attachment:", error.message);
      throw error;
    }
  }

  async delete(tournamentId, matchId, attachmentId) {
    try {
      if (!tournamentId || !matchId || !attachmentId) {
        throw new Error("tournamentId, matchId, and attachmentId are required");
      }

      await this.client.request(
        `/tournaments/${tournamentId}/matches/${matchId}/attachments/${attachmentId}`,
        "DELETE",
      );
    } catch (error) {
      console.error("Error deleting match attachment:", error.message);
      throw error;
    }
  }
}

module.exports = MatchAttachmentService;
