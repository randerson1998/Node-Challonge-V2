class Stations{
    constructor(id, type, attributes) {
        this.id = id;
        this.type = type;

        this.name = attributes.name;
        this.stream_url = attributes.stream_url;
        this.match_id = attributes.match_id;
    }
}

module.exports = Stations;