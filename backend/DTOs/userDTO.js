module.exports = class UserDTO {
    email;
    id;
    emailVerified;

    constructor(user) {
        this.email = user.email;
        this.id = user.id;
        this.emailVerified = user.emailverified;
    }
}