const router = require("express").Router()
const user = require('../controllers/userController')
const authentication = require('../controllers/authenticationController')
const authorization = require('../controllers/authorizationMiddleware')
module.exports = app => {

    //Auth:
    let authRouter = router

    authRouter.post("/", authorization("User"), authentication.auth)
    authRouter.post("/login", authentication.login)
    authRouter.post("/logout", authorization("User"), authentication.logout)
    authRouter.post("/forgot", authentication.reset)

    // Users:
    let userRouter = router

    userRouter.post("/new", authorization("Admin"), user.create)
    userRouter.get("/:id", authorization("User"), user.getOne)
    userRouter.get("/", authorization("Admin"), user.getAll)
    userRouter.get("/:role", authorization("Admin"), user.getAllRoles)
    userRouter.put("/:id", authorization("Admin"), user.editOne)
    userRouter.delete("/:id", authorization("Admin"), user.deleteOne)

    app.use("/auth", authRouter)
    app.use("/data/users", userRouter)
}