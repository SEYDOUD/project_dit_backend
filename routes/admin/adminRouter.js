const jwtAuthentication = require("../../middlewares/jwtAuthentication")
const adminRouter = require("express").Router()
const adminController = require("../../controllers/admin/adminController")

adminRouter.route("/create").post(jwtAuthentication,adminController.create)
adminRouter.route("/deleteUser/:idUser").delete(adminController.deleteUser)
adminRouter.route("/deletePost/:idPost").delete(adminController.deletePost)
adminRouter.route("/deleteComment/:idComment").delete(adminController.deleteComment)
adminRouter.route("/users").get(adminController.getAllUsers)
adminRouter.route("/posts").get(adminController.getAllPost)
adminRouter.route("/countPosts").get(adminController.getNumberPost)
adminRouter.route("/countUsers").get(adminController.getNumberUser)
adminRouter.route("/countComments").get(adminController.getNumberComments)
adminRouter.route("/countNegativeComments").get(adminController.getNumberNegativeComments)
adminRouter.route("/comments").get(adminController.getAllComment)

module.exports = adminRouter