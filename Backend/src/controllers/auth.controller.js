const User = require('../models/user.models');
const { verifyRefreshToken, getAccessToken, getRefreshToken } = require('../../src/utils/auth')


const register = async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {

            res.status(400).json({ error: "Bad Request", message: "missing required field" });
        };

        // create refreshToken version
        const refreshTokenVersion = 7548;   // this field is require in schema  so for now i save that random number but when we create refresh token it will override with some random number

        const user = await User.create({ username, email, password, refreshTokenVersion });

        // genrate accessToken and RefreshToken

        const refreshToken = await getRefreshToken(user);
        const accessToken = getAccessToken(user);

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: accessToken
        }

        res.cookie('uuid30d', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: "new user create successfully", payload });

    } catch (error) {

        console.log("Internal Server Error:", error);
        res.status(500).json({ "error": "Internal Server Error" })
    }

}



const login = async (req, res) => {
    console.log("getting login request" )
    try {

        const { email, password } = req.body;

        const data = await User.matchPasswordAndReturnToken(email, password);

        if (!data) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const refreshToken = await getRefreshToken(data);
        const accessToken = await getAccessToken(data);

        if (!refreshToken && !accessToken) {

            return res.status(500).json({ message: "Internal Server Error" });
        }

        res.cookie('uuid30d', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: "Login Successful", user: data.payload, accessToken: accessToken });

    } catch (error) {

        console.error("Login error:", error);
        return res.status(401).json({ error: "Invalid email or password" });

    }
}


const refresh = async (req, res) => {

    const refreshTokenCookieName = "uuid30d";
    const refreshToken = req.cookies[refreshTokenCookieName];

    if (!refreshToken || refreshToken == undefined) {

        return res.status(401).json({ "error": "Unauthorized Access! Please login again" })

    }

    try {

        const decoded = verifyRefreshToken(refreshToken);           // decode refreshtoken

        if (!decoded) {

            return res.status(401).json({
                error: "Unauthrized",
                message: "Authentication Failed!! Please login again",
                status: "401"
            })
        }

        const user = await User.findById(decoded.id);

        if (!decoded.tokenVersion || decoded.tokenVersion != user.refreshTokenVersion) {

            return res.status(401).json({
                error: "Unauthrized",
                message: "Authentication Failed!! token version mismatch",
                status: "401",

            })
        }

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
        }

        const newAccessToken = getAccessToken(decoded);
        res.status(200).json({
            message: "new token send successfully",
            accessToken: newAccessToken,
            payload: payload
        })

    } catch (error) {

        res.status(401).json({ "error": "Unauthorized Access! Please login again" })

    }
}

const logout = async (req, res) => { };
const checkUsername = async (req, res) => { }
const checkEmail = async (req, res) => { }
const sendEmailVerificationEmail = async (req, res) => { }
const validateEmailVerificationToken = async (req, res) => { }
const resendVerificationLink = async (req, res) => { }
const forgotPassword = async (req, res) => { }
const resetPasswordLink = async (req, res) => { }
const resetPassword = async (req, res) => { }


module.exports = {
    register,
    login,
    refresh,
    logout,
    checkUsername,
    checkEmail,
    sendEmailVerificationEmail,
    validateEmailVerificationToken,
    resendVerificationLink,
    forgotPassword,
    resetPasswordLink,
    resetPassword
}