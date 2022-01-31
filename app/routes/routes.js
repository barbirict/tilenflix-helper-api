const router = require("express").Router()
const user = require('../controllers/userController')
const authentication = require('../controllers/authenticationController')
const authorization = require('../controllers/authorizationMiddleware')
module.exports = app => {

    //Auth:
    let authRouter = router

    authRouter.post("/", authorization("User"), authentication.auth)

    authRouter.post("/login", authentication.login)

    authRouter.post("/logout", authentication.logout)

    authRouter.post("/forgot", authentication.reset)

    // Users:
    let userRouter = router

    userRouter.post("/new", /*authorization("Admin"),*/ user.create)

    app.use("/auth", authRouter)
    app.use("/data/users", userRouter)
}