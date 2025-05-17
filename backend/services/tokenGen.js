const UserDTO = require("../DTOs/userDTO");
const tokenService = require("./token-service");

module.exports = async function (user, ip) {
    const userDTO = new UserDTO(user.rows[0]);
    const tokens = tokenService.generateTokens({...userDTO});
    await tokenService.saveToken(userDTO.id, tokens.refresh, ip);

    return { ...tokens, user: userDTO };
}