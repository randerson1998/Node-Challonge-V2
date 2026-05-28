const ChallongeClient = require('./client');

function createChallongeClient(options = {}) {
  return new ChallongeClient(options);
}

createChallongeClient.ChallongeClient = ChallongeClient;
createChallongeClient.fromToken = ChallongeClient.fromToken;

module.exports = createChallongeClient;
module.exports.ChallongeClient = ChallongeClient;

