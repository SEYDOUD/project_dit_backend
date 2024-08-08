const adminAuthRouter = require("express").Router()
const authController = require("../../controllers/authController")

adminAuthRouter.route("/login").post(authController.loginAdmin)
adminAuthRouter.route("/logout").get(authController.logout)

module.exports = adminAuthRouter