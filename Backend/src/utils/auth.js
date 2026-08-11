const jwt = require('jsonwebtoken');


function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRATE_KEY);
        return decoded;
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        throw new Error("Invalid or expired refresh token");
    }
}


function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRATE_KEY);
        return decoded;
    } catch (error) {
        console.error("Error verifying access token:", error);
        throw new Error("Access Token Expire ")
    }
}






module.exports = {
    verifyRefreshToken,
    verifyAccessToken,
};

