class States {
  /**
   * @param {Boolean} active
   */
  constructor(active = true) {
    this.active = active;
  }

  static from(value) {
    return value instanceof States ? value : new States(value);
  }

  toJSON() {
    return {
      active: this.active,
    };
  }
}

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
    return value instanceof TimeStamps ? value : new TimeStamps(value);
  }

  toJSON() {
    return {
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = {
  States,
  TimeStamps,
};
