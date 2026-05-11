class TimeStamps {
  /**
   * @param {String} created_at
   * @param {String} updated_at
   */
  constructor(
    created_at = "2023-04-21T14:29:06.374Z",
    updated_at = "2023-04-21T14:31:45.981Z",
  ) {
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static from(value) {
    return value instanceof TimeStamps
      ? value
      : new TimeStamps(value?.created_at, value?.updated_at);
  }

  toJSON() {
    return {
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

class RelationshipData {
  constructor({ id, type } = {}) {
    this.id = id;
    this.type = type;
  }

  static from(value) {
    return value instanceof RelationshipData
      ? value
      : new RelationshipData(value || {});
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
    };
  }
}

class PlayerRelationship {
  constructor({ data } = {}) {
    this.data = RelationshipData.from(data);
  }

  static from(value) {
    return value instanceof PlayerRelationship
      ? value
      : new PlayerRelationship(value || {});
  }

  toJSON() {
    return {
      data: this.data.toJSON(),
    };
  }
}

class MatchRelationships {
  constructor({ player1, player2 } = {}) {
    this.player1 = PlayerRelationship.from(player1);
    this.player2 = PlayerRelationship.from(player2);
  }

  static from(value) {
    return value instanceof MatchRelationships
      ? value
      : new MatchRelationships(value || {});
  }

  toJSON() {
    return {
      player1: this.player1.toJSON(),
      player2: this.player2.toJSON(),
    };
  }
}

module.exports = {
  TimeStamps,
  MatchRelationships,
  PlayerRelationship,
  RelationshipData,
};
