const commentRouter = require("express").Router()
const commentController = require("../../controllers/comment/commentController")
const jwtAuthentication = require("../../middlewares/jwtAuthentication")

commentRouter.route("/create/:idPost").post(jwtAuthentication,commentController.create)
commentRouter.route("/all/:idPost").get(commentController.getAll)
commentRouter.route("/count/:idPost").get(commentController.getTotalComments)

module.exports = commentRouter