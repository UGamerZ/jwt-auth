const userService = require('../services/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../errorHandling/api-errors');

class UserController {
    async registration(req, res, next) {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()) return next(ApiError.BadRequest('Validation Error', errors.array()));

            const { email, password } = req.body;
            const userData = await userService.registration(email, password, req.socket.remoteAddress);

            res.cookie('refresh', userData.refresh, {httpOnly: true, maxAge: 2592000000});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try{
            const { email, password } = req.body;
            const userData = await userService.login(email, password, req.socket.remoteAddress);

            res.cookie('refresh', userData.refresh, {httpOnly: true, maxAge: 2592000000});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try{
            const { refresh } = req.cookies;
            res.clearCookie('refresh');
            return res.json(await userService.logout(refresh));
        } catch (e) {
            next(e);
        }
    }

    async activation(req, res, next) {
        try{
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try{
            const { refresh } = req.cookies;
            const userData = await userService.refresh(refresh, req.socket.remoteAddress);

            res.cookie('refresh', userData.refresh, {httpOnly: true, maxAge: 2592000000});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async users(req, res, next) {
        try{
            res.json(await userService.getUsers());
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();