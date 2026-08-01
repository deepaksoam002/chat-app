const { Router } = require("express");
const {
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
    resetPassword,
} = require('../controllers/auth.controller.js');


const router = Router();




// Auth Router  ----
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/refresh").post(refresh);
router.route("/check-username").post(checkUsername);
router.route("/check-email").post(checkEmail);
router.route("/email-verification").post(sendEmailVerificationEmail);
router.route("/Otp-validation/:token").get(validateEmailVerificationToken)
router.route("resend-verification-link").post(resendVerificationLink);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPasswordLink);
router.route("/reset-password/:token").post(resetPassword);
// router.route("oauth/:provider").get(OAuth)





module.exports = router