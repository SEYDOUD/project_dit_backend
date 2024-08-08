const userRouter = require("express").Router()
const userController = require("../../controllers/user/userController")

userRouter.route("/register").post(userController.create)

module.exports = userRouter