const User = require("../models").User;
class UserService {
  constructor(client) {
    this.client = client;
  }

  async get() {
    try {
      const response = await this.client.request("/me", "GET");
      if (response && response.data) {
        return new User({
          id: response.data.id,
          type: response.data.type,
          attributes: response.data.attributes,
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }

    return null;
  }
}

module.exports = UserService;
