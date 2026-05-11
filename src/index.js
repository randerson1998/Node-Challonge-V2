const ChallongeClient = require('./client');

function createChallongeClient(options = {}) {
  return new ChallongeClient(options);
}

module.exports = createChallongeClient;
module.exports.ChallongeClient = ChallongeClient;
