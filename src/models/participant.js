const { States, TimeStamps } = require("./participantOptions");

class Participant {
  constructor({ id, type, attributes = {} }) {
    this.id = id;
    this.type = type;

    this.name = attributes.name;
    this.seed = attributes.seed;
    this.group_id = attributes.group_id;
    this.tournament_id = attributes.tournament_id;
    this.username = attributes.username;
    this.final_rank = attributes.final_rank;
    this.states = States.from(attributes.states);
    this.misc = attributes.misc; // Apparently we can store whatever we want in here lol
    this.Timestamps = TimeStamps.from(attributes.timestamps);
  }

  static fromResource(resource) {
    return new Participant(resource);
  }

  static fromListResponse(response) {
    return (response.data || []).map(Participant.fromResource);
  }

  static fromSingleResponse(response) {
    return Participant.fromResource(response.data);
  }
}

module.exports = Participant;
