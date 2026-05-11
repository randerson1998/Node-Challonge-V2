class StationQueuer{
    constructor(id, type, attributes) {
        this.id = id;
        this.type = type;

        this.match_id = attributes.match_id;
        this.position = attributes.position;
    }
}

module.exports = StationQueuer;