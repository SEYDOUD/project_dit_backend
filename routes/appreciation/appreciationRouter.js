const appreciationRouter = require("express").Router()
const appreciationController = require("../../controllers/appreciation/appreciationController")
const jwtAuthentication = require("../../middlewares/jwtAuthentication")

appreciationRouter.route("/edit/:idPost").put(jwtAuthentication,appreciationController.appreciate)
appreciationRouter.route("/countLike/:idPost").get(appreciationController.getTotalLike)
appreciationRouter.route("/countDislike/:idPost").get(appreciationController.getTotalDislike)

module.exports = appreciationRouter