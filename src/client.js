const TournamentService = require('./services/tournamentService');
const MatchService = require('./services/matchService');
const ParticipantService = require('./services/participantService');
const StationQueuerService = require('./services/stationQueuerService');
const StationService = require('./services/stationService');
const MatchAttachmentService = require('./services/matchAttachmentService');

class ChallongeClient {
  constructor({ username, apiKey, baseUrl = 'https://api.challonge.com/v2', authType = 'v1' } = {}) {
    if (!apiKey) {
      throw new Error('apiKey is required to create a ChallongeClient');
    }

    if (authType !== 'v1' && !username) {
      throw new Error('username is required for auth types other than v1');
    }

    this.username = username;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.authType = authType;
    this.tournaments = new TournamentService(this);
    this.matches = new MatchService(this);
    this.participants = new ParticipantService(this);
    this.stationQueuers = new StationQueuerService(this);
    this.stations = new StationService(this);
    this.matchAttachments = new MatchAttachmentService(this);
  }

  get authHeader() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization-Type': this.authType,
    };

    if (this.authType === 'v1') {
      headers.Authorization = this.apiKey;
    } else {
      headers.Authorization = `Basic ${Buffer.from(`${this.username}:${this.apiKey}`).toString('base64')}`;
    }

    return headers;
  }

  async request(path, method = 'GET', body) {
    const url = `${this.baseUrl}${path}`;
    const headers = Object.fromEntries(
      Object.entries(this.authHeader).filter(([, value]) => value != null && value !== '')
    );

    const options = {
      method,
      headers,
    };

    if (body != null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const error = new Error((data && data.message) || `Challonge API request failed (${response.status})`);
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  }
}

module.exports = ChallongeClient;
