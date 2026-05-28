const TournamentService = require("./services/tournamentService");
const MatchService = require("./services/matchService");
const ParticipantService = require("./services/participantService");
const StationQueuerService = require("./services/stationQueuerService");
const StationService = require("./services/stationService");
const MatchAttachmentService = require("./services/matchAttachmentService");
const UserService = require("./services/userService");

const DEFAULT_BASE_URL = "https://api.challonge.com/v2.1";
const DEFAULT_OAUTH_BASE_URL = "https://api.challonge.com";

class ChallongeClient {
  constructor({
    username,
    apiKey,
    accessToken,
    refreshToken,
    baseUrl = DEFAULT_BASE_URL,
    oauthBaseUrl = DEFAULT_OAUTH_BASE_URL,
    authType = "v1",
  } = {}) {
    if (authType === "v1") {
      if (!apiKey) {
        throw new Error("apiKey is required for authType v1");
      }
    } else if (authType === "basic") {
      if (!username || !apiKey) {
        throw new Error("username and apiKey are required for authType basic");
      }
    } else if (authType === "bearer") {
      if (!accessToken) {
        throw new Error("accessToken is required for authType bearer");
      }
    } else {
      throw new Error(`Unsupported authType: ${authType}`);
    }

    this.username = username;
    this.apiKey = apiKey;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.baseUrl = baseUrl;
    this.oauthBaseUrl = oauthBaseUrl;
    this.authType = authType;
    this.tournaments = new TournamentService(this);
    this.matches = new MatchService(this);
    this.participants = new ParticipantService(this);
    this.stationQueuers = new StationQueuerService(this);
    this.stations = new StationService(this);
    this.matchAttachments = new MatchAttachmentService(this);
    this.user = new UserService(this);
  }

  get authHeader() {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/vnd.api+json",
      "Authorization-Type": this.authType.toLowerCase(),
    };

    if (this.authType === "v1") {
      headers.Authorization = this.apiKey;
    } else if (this.authType === "basic") {
      headers.Authorization = `Basic ${Buffer.from(`${this.username}:${this.apiKey}`).toString("base64")}`;
    } else if (this.authType === "bearer") {
      if (!this.accessToken) {
        throw new Error("accessToken is required when authType is bearer");
      }
      headers["Authorization-Type"] = "v2";
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  static fromToken(accessToken, baseUrl = DEFAULT_BASE_URL) {
    return new ChallongeClient({
      authType: "bearer",
      accessToken: accessToken,
      baseUrl: baseUrl,
    });
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    this.authType = "bearer";
  }

  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  setAuthType(authType) {
    this.authType = authType;
  }

  async request(path, method = "GET", body) {
    const url = `${this.baseUrl}${path}`;
    const headers = Object.fromEntries(
      Object.entries(this.authHeader).filter(
        ([, value]) => value != null && value !== "",
      ),
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
      const error = new Error(
        (data && data.message) ||
          `Challonge API request failed (${response.status})`,
      );
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  }

  async oauthRequest(path, params = {}, method = "POST") {
    const url = `${this.oauthBaseUrl}${path}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const options = {
      method,
      headers,
      body: new URLSearchParams(params).toString(),
    };

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
      const error = new Error(
        (data && data.error_description) ||
          (data && data.error) ||
          `Challonge OAuth request failed (${response.status})`,
      );
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  }

  getAuthorizationUrl({
    clientId,
    redirectUri,
    scope = "",
    responseType = "code",
    state,
    prompt,
  }) {
    if (!clientId || !redirectUri) {
      throw new Error(
        "clientId and redirectUri are required to build the authorization URL",
      );
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope: Array.isArray(scope) ? scope.join(" ") : scope,
    });

    if (state) {
      params.set("state", state);
    }

    if (prompt) {
      params.set("prompt", prompt);
    }

    return `${this.oauthBaseUrl}/oauth/authorize?${params.toString()}`;
  }

  async requestOAuthToken(params) {
    const tokenResponse = await this.oauthRequest(
      "/oauth/token",
      params,
      "POST",
    );

    if (tokenResponse.access_token) {
      this.setAccessToken(tokenResponse.access_token);
    }

    if (tokenResponse.refresh_token) {
      this.setRefreshToken(tokenResponse.refresh_token);
    }

    return tokenResponse;
  }

  async exchangeAuthorizationCode({
    clientId,
    clientSecret,
    code,
    redirectUri,
  }) {
    return this.requestOAuthToken({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    });
  }

  async refreshAccessToken({
    clientId,
    clientSecret,
    refreshToken,
    redirectUri,
  }) {
    return this.requestOAuthToken({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: redirectUri,
    });
  }

  async requestClientCredentialsToken({ clientId, clientSecret, scope = "" }) {
    return this.requestOAuthToken({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      scope: Array.isArray(scope) ? scope.join(" ") : scope,
    });
  }

  async getCurrentUser() {
    // The API endpoint from your screenshot
    const response = await this.request("/me.json", "GET");

    // Based on the response structure in your image: { data: { id, type, attributes } }
    if (response && response.data) {
      return this.user.get();
    }

    return null;
  }
}

module.exports = ChallongeClient;
