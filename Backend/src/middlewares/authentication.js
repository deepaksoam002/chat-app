const { verifyRefreshToken, verifyAccessToken } = require('../../src/utils/auth.js');
const { parseCookie } = require('cookie');
const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/apiError.js');



const checkAuthenticationCookies = asyncHandler(async (req, res, next) => {

    const accessToken = req.header.Authorization?.replace("Bearer ", "") || req.cookies?.accessToken;

    if (!accessToken) {
        throw new ApiError(401, "Unauthorized Access")
    }

    const payload = verifyAccessToken(accessToken);

    const user = await User.findById(decodedToken?._id).select(
        "-password -isEmailVerified -refreshToken -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry"
    );


    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }

    req.user = payload;

    next();
})


// 2. YOUR NEW SOCKET.IO MIDDLEWARE
const socketAuthMiddleware = async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {

        throw new ApiError(401, "Your session has expired or is invalid. Please sign in again.")

    }

    try {

        const payload = verifyAccessToken(token);

        const user = await User.findById(decodedToken?._id).select(
            "-password -isEmailVerified -refreshToken -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry"
        );


        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        socket.user = user; // Attach user details to the socket instance
        return next();
    }
    catch (error) {

     next(error);
    }

}



module.exports = { checkAuthenticationCookies, socketAuthMiddleware };