const{
    TimeStamps,
} = require("./matchAttachmentOptions");
class MatchAttachment{
    constructor({ id, type, attributes = {} }) {
        this.id = id;
        this.type = type;

        this.url = attributes.url;
        this.description = attributes.description;
        this.timestamp = TimeStamps.from(attributes.timestamp);
    }            
}

module.exports = MatchAttachment;