const ApiError = require('../errorHandling/api-errors');
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader) return next(ApiError.UnauthorizedError());

        const accessToken = authHeader.split(' ')[1];
        if(!accessToken) return next(ApiError.UnauthorizedError());

        const userData = tokenService.validateAccess(accessToken);
        if(!userData) return next(ApiError.UnauthorizedError());

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}