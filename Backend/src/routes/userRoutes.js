const { Router } = require('express');
const authentication = require('../middlewares/authentication')
const { handleNewConnection, handleConnection, handleGetUserQuery } = require('../controllers/user.controller.js');


const router = Router();

router.get("/", async (req, res) => {

    return res.status(200).json({ message : "this is working"})
})

// User Router
router.route("/new-connection").post(authentication.checkAuthenticationCookies(), handleNewConnection)
router.route("/connections").get(authentication.checkAuthenticationCookies(), handleConnection)
router.route("/:query").get(authentication.checkAuthenticationCookies(), handleGetUserQuery)   // all dynamic route should be in bottom


module.exports = router;
