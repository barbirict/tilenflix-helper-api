const router = require("express").Router()
const user = require('../controllers/userController')
const authentication = require('../controllers/authenticationController')
const authorization = require('../controllers/authorizationMiddleware')
const requests = require('../controllers/requestsController')
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

    let requestRouter = router

    requestRouter.post("/requests/new", authorization("User"), requests.create)
    requestRouter.get("/requests/:id", authorization("Service_user"), requests.getOne)
    requestRouter.get("/requests", authorization("Service_user"), requests.getAll)
    requestRouter.get("/requests/:date_range", authorization("Service_user"), requests.getDateRange)
    requestRouter.get("/requests/u/:id", authorization("User"), requests.getBySubId)
    requestRouter.get("/requests/:type", authorization("Service_user"), requests.getByType)
    requestRouter.get("/requests/verify/:type", authorization("User"), requests.verify)
    requestRouter.put("/requests/:id", authorization("Service_user"), requests.modifyId)
    requestRouter.delete("/requests/:id", authorization("Admin"), requests.deleteId)

    app.use("/auth", authRouter)
    app.use("/data", requestRouter)
    app.use("/data/users", userRouter)

}