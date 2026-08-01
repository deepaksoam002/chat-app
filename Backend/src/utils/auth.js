const jwt = require('jsonwebtoken');
const User = require('../models/user.models.js');
require('dotenv').config();


const jwtRefreshSecrateKey = process.env.JWT_REFRESH_TOKEN_SECRATE_KEY
const jwtAccessSecrateKey = process.env.JWT_ACCESS_TOKEN_SECRATE_KEY

async function getRefreshToken(payload) {

    try {
        const username = payload.username
        const email = payload.email
        const id = payload._id

        if (!username || !email ) {

            console.error("username and email not found in refresh token payload");
            throw new Error( "message: Invalid username and password" );
        }

      

        const randomTokenVersion =  Math.floor(1000 + Math.random() * 9000);
        const userId = id;
         
        const data = {
            id: userId,
            username: username,
            email: email,
            tokenType: "refresh",
            tokenVersion: randomTokenVersion
        }

        // save or  update token version in database 

        const user = await User.findOne({_id:userId});
        user.refreshTokenVersion = randomTokenVersion;

        const updatedUser = await user.save()


        const token = jwt.sign(data, jwtRefreshSecrateKey, { expiresIn: "15d" });
        
        return token;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Failed to generate refresh token");
    }
};


function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, jwtRefreshSecrateKey);
        return decoded;
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        throw new Error("Invalid or expired refresh token");
    }
}



function getAccessToken(payload) {

   
    

    try {
        const { username, email, id } =payload
       
        const data = {
            id: id,
            username: username ,
            email: email ,
            tokenType: "access"
        }

        if (!username || !email) {

            console.error("username and email not found in Access token payload");
            throw new Error( "message: Invalid username and password" );
        }

        const token = jwt.sign(data, jwtAccessSecrateKey, { expiresIn: "15m" });

        return token;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Failed to generate refresh token");
    }
};


function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, jwtAccessSecrateKey);
        return decoded;
    } catch (error) {
        console.error("Error verifying access token:", error);
        throw new Error("Access Token Expire ")
    }
}






module.exports = {
    getRefreshToken,
    verifyRefreshToken,
    getAccessToken,
    verifyAccessToken,
};