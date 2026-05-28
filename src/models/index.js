const tournamentOptions = require("./tournamentOptions");
const participantOptions = require("./participantOptions");
const matchOptions = require("./matchOptions");
const matchAttachmentOptions = require("./matchAttachmentOptions");

const Tournament = require("./tournament");
const Participant = require("./participant");
const Match = require("./match");
const MatchAttachment = require("./matchAttachment");
const Station = require("./station");
const StationQueuer = require("./stationQueuer");
const User = require("./user");

module.exports = {
  // Spread all options classes directly (TournamentGroupStageOptions, SwissOptions, etc.)
  ...tournamentOptions,
  ...participantOptions,
  ...matchOptions,
  ...matchAttachmentOptions,

  // Core Data Models
  Tournament,
  Participant,
  Match,
  MatchAttachment,
  Station,
  StationQueuer,
  User
};