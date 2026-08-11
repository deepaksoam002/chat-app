const User = require('../models/user.models');
const { verifyRefreshToken } = require('../../src/utils/auth');
const { ApiError } = require('../utils/apiError');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');


const cookiesOptions = {
    httpOnly: true,
    secure: true,
}

const generateRefreshTokenAndAccessToken = async (userId) => {

    try {

        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {

        console.error("Error:", error);
        throw new ApiError(500, " Something went wrong");
    }
}


const register = asyncHandler(async (req, res) => {


    const { username, email, password } = req.body;


    const user = await User.create({ username, email, password, refreshToken });

    // genrate accessToken and RefreshToken

    const { refreshToken, accessToken } = generateRefreshTokenAndAccessToken(user._id);


    return res.status(201)
        .cookie("accessToken", accessToken, cookiesOptions)
        .cookie("refreshToken", refreshToken, cookiesOptions)
        .json(
            new ApiResponse(
                201,
                {
                    accessToken,
                    refreshToken
                },
                "New User register Successfully"
            )
        );


}
)


const login = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    const user = await User.findOne({ $or: [{username}, {email}] });

    const isPasswordCorrect = user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { refreshToken, accessToken } = await generateRefreshTokenAndAccessToken(user._id);

    const loginUser = await User.findById(user._id)
        .select("-password -salt -isEmailVerified -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry")


    return res.status(200)
        .cookie("accessToken", accessToken, cookiesOptions)
        .cookie("refreshToken", refreshToken, cookiesOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loginUser,
                    refreshToken,
                    accessToken
                },
                "User login successfully"
            )
        );

})


const refresh = asyncHandler(async (req, res) => {

    const receivedRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!receivedRefreshToken) {
        throw new ApiError(400, "Unauthorized Access")
    }

    const payload = verifyRefreshToken(receivedRefreshToken);
    if (!payload) {

        throw new ApiError(401,"Authentication Failed!! Please login again")
    }

    const user = await User.findById(payload._id);

    const {accessToken, refreshToken} = generateRefreshTokenAndAccessToken(user._id);

   return res.status(200)
      .cookie("accessToken",accessToken,cookiesOptions)
      .cookie("refreshToken",refreshToken,cookiesOptions)
      .json(
           new ApiResponse(
            200,
            {
                refreshToken,
                accessToken
            },
            "Access token refresh successfully"
           )
      )
})

const logout = asyncHandler(async (req, res) => { 
    const userId = req.user._id;

    const user = await User.findById(userId);

    user.refreshToken = null;
    await user.save({validateBeforeSave: false});

    return res.status(200)
     .clearCookie("accessToken",cookiesOptions)
     .clearCookie("refreshToken",cookiesOptions)
     .json(
        new ApiResponse(
            200,
            {},
            "User logout successfully"
        )
     )
});

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