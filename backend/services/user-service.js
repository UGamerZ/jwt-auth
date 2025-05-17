const db = require('../db/db');
const bcrypt = require('bcrypt');
const { v4: uuidV4 } = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const ApiError = require('../errorHandling/api-errors');
const tokenGen = require('./tokenGen');

class UserService {
    async registration(email, password, ip){
        console.log(ip);
        const candidate = await db.query('SELECT * FROM users where email = $1', [email]);
        if(candidate.rows[0])
            throw ApiError.BadRequest('User with this email already exists');
        password = bcrypt.hashSync(password, 5);
        const activationLink = uuidV4();

        const user = await db.query('INSERT INTO users (email, password, activationlink) VALUES ($1, $2, $3) RETURNING *', [email, password, activationLink]);
        await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`);

        return await tokenGen(user, ip);
    }

    async activate(activateLink){
        const user = await db.query('SELECT * FROM users where activationlink = $1', [activateLink]);
        if(!user.rows[0]) throw ApiError.BadRequest('No such user');
        await db.query('UPDATE users SET emailverified = true where activationlink = $1', [activateLink]);
    }

    async login(email, password, ip) {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if(!user.rows[0]) throw ApiError.BadRequest('No registered user on this email');
        if(!bcrypt.compareSync(password, user.rows[0].password)) throw ApiError.BadRequest('Incorrect password');

        return await tokenGen(user, ip);
    }

    async logout(refresh) {
        return await tokenService.removeToken(refresh);
    }

    async refresh(refresh, ip) {
        if(!refresh) throw ApiError.UnauthorizedError();
        const userData = tokenService.validateRefresh(refresh);
        if(!userData || !await tokenService.findToken(refresh))
            throw ApiError.UnauthorizedError();
        const user = await db.query('SELECT * FROM users WHERE id = $1', [userData.id]);

        return await tokenGen(user, ip)
    }

    async getUsers() {
        const users = await db.query('SELECT * FROM users');
        return users.rows;
    }
}

module.exports = new UserService();