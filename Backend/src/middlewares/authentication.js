const { verifyRefreshToken, verifyAccessToken, getAccessToken } = require('../../src/utils/auth.js');
const { parseCookie } = require('cookie');



function checkAuthenticationCookies() {
    return (req, res, next) => {
        // Look for the Authorization header
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];


        // CASE 1: No Authorization header at all -> Return 401
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                code: "AUTH_TOKEN_MISSING",
                message: "Authentication required. Please provide an Authorization header."
            });
        }

        // CASE 2: Token exists -> Validate it
        try {
            // Split "Bearer <token>"
            const accessToken = authHeader.split(' ')[1];

            if (!accessToken) {
                return res.status(401).json({
                    success: false,
                    code: "INVALID_TOKEN_FORMAT",
                    message: "Authorization header format must be 'Bearer <token>'"
                });
            }

            const payload = verifyAccessToken(accessToken);

            // Attach user payload to the request
            req.user = payload;
            next();      // Continue to the route

        } catch (error) {
            console.error(`Token validation error: ${error.message}`);

            // CASE 3: Token is present but invalid/expired -> Return 401
            return res.status(401).json({
                success: false,
                code: "TOKEN_INVALID_OR_EXPIRED",
                message: "Your session has expired or is invalid. Please sign in again."
            });
        }
    };
}

// 2. YOUR NEW SOCKET.IO MIDDLEWARE
function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth.token;

    if (!token) {
        const err = new Error('AUTHENTICATION_REQUIRED');
        err.data = {
            statusCode: 401,
            message: "Your session has expired or is invalid. Please sign in again."
        }
        return next(err);
    }


    // Check Access Token

    try {

        const payload = verifyAccessToken(token);
        socket.user = payload; // Attach user details to the socket instance
        return next();
    }
    catch (error) {
        
        error.data = {
            statusCode: 401,
            message: "Your session has expired or is invalid. Please sign in again."
        }

        console.error(`Socket Access Token Invalid: ${error.message}`);
        return next(error);
    }

}



module.exports = { checkAuthenticationCookies, socketAuthMiddleware };