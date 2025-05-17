const jwt = require('jsonwebtoken');
const db = require('../db/db');
class TokenService {
    generateTokens(payload) {
        const access = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '15s'});
        const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            access,
            refresh
        }
    }

    validateAccess(token) {
        try{
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return null;
        }
    }

    validateRefresh(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

    async saveToken(uID, refresh, ip) {
        const tokenData = await db.query('SELECT * FROM tokens WHERE user_id = $1 and ip = $2', [uID, ip]);
        if(tokenData.rows[0]) {
            return await db.query('UPDATE tokens set refreshtoken = $2 WHERE user_id = $1 and ip = $3 RETURNING *', [uID, refresh, ip]);
        }
        return await db.query('INSERT INTO tokens (user_id, refreshtoken, ip) VALUES ($1, $2, $3) RETURNING *', [uID, refresh, ip]);
    }

    async removeToken(refresh) {
        const tokenData = await db.query('DELETE FROM tokens WHERE refreshtoken = $1 RETURNING *', [refresh]);
        return tokenData.rows[0];
    }

    async findToken(refresh) {
        const tokenData = await db.query('SELECT * FROM tokens WHERE refreshtoken = $1', [refresh]);
        return tokenData.rows[0];
    }
}

module.exports = new TokenService();