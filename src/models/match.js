const {
  TimeStamps,
  MatchRelationships,
} = require("./matchOptions");

class Match {
  constructor({ id, type, attributes = {} }) {
    this.id = id;
    this.type = type;

    this.state = attributes.state;
    this.round = attributes.round;
    this.identifier = attributes.identifier;
    this.suggested_play_order = attributes.suggested_play_order;
    this.scores = attributes.scores;
    this.score_in_sets = attributes.score_in_sets;
    this.points_by_participant = attributes.points_by_participant;
    this.timestamps = TimeStamps.from(attributes.timestamps);
    this.relationships = MatchRelationships.from(attributes.relationships);
    this.winner_id = attributes.winner_id;
    this.relationships = MatchRelationships.from(attributes.relationships);
  }
}

module.exports = Match;