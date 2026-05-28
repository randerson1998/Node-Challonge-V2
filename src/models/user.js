class user{
    constructor({ id, type, attributes = {} }) {
        id = id;
        type = type;

        this.username = attributes.username;
        this.email = attributes.email;
        this.imageUrl = attributes.image_url;
    }
}

module.exports = user;