const postRouter = require("express").Router()
const postController = require("../../controllers/post/postController")
const jwtAuthentication = require("../../middlewares/jwtAuthentication")


postRouter.route("/create").post(jwtAuthentication,postController.create)
postRouter.route("/all").get(postController.getAll)

module.exports = postRouter