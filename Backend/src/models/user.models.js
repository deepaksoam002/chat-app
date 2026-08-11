const { Schema, model } = require('mongoose');
const crypto = require('crypto')
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase:true,
        index:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String

    },
    refreshToken: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: String
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: String
    }
}, { timestamps: true });


// hash password befor save in data base.........

userSchema.pre("save", asyncHandler(async function () {


    if (!this.isModified("password")) return;

    const salt = crypto.randomBytes(16).toString();
    const hashPassword = crypto
        .createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashPassword;

}
));


userSchema.method.isPasswordCorrect = async function (password) {

    const salt = this.salt;
    const hashPassword = this.password;

    const userProvidedHashPassword = crypto
        .createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashPassword !== userProvidedHashPassword) {
        throw new ApiError(400, "Invalid Username or Password")
    }

    return true;
}


//generate Access Token

userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRATE_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// generate refresh token

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            _id: this._id

        },
        process.env.REFRESH_TOKEN_SECRATE_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// Generate temporary token

userSchema.methods.generateTemporaryToken = function () {

    const unhashToken = crypto.randomBytes(20).toString("hex");

    const hashToken = crypto
        .createHash("sha256")
        .update(unhashToken)
        .digest("hex")


    const tokenExpiry = Date.now() + (5 * 60 * 1000)   // 5min

    return { unhashToken, hashToken, tokenExpiry }
}




module.exports = model('User', userSchema);