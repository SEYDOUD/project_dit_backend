const authRouter = require("express").Router()
const authController = require("../../controllers/authController")

authRouter.route("/login").post(authController.login)
authRouter.route("/logout").get(authController.logout)

module.exports = authRouter