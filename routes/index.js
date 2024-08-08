const express = require("express");
const userRouter = require("./user/userRouter");
const authRouter = require("./authentication/authRouter")
const postRouter = require("./post/postRouter");
const commentRouter = require("./comment/commentRouter");
const appreciationRouter = require("./appreciation/appreciationRouter");
const adminRouter = require("./admin/adminRouter");
const adminAuthRouter = require("./authentication/adminAuthRouter");
const router = express.Router()

router.get("/",(req,res)=>{
    res.send("hello mifa")
})

router.use("/api",userRouter)
router.use("/api",authRouter)
router.use("/api/post",postRouter)
router.use("/api/comment",commentRouter)
router.use("/api/appreciation",appreciationRouter)

router.use("/api_admin/",adminRouter)
router.use("/api_admin/",adminAuthRouter)

module.exports = router